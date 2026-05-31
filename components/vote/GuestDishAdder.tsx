"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { m, AnimatePresence } from "framer-motion";
import { addDishAsMemberAction, updateDishAsMemberAction, removeDishAsMemberAction } from "@/actions/dishes";
import { TOPIC_CONFIG, getCategoriesForTopic, type TopicKey } from "@/lib/presets";
import { listContainerVariants, listItemVariants, scaleInVariants } from "@/components/motion/variants";

type UnsplashPhoto = { thumb: string; url: string; alt: string };
type TmdbMovie = { id: number; title: string; year: string | null; posterThumb: string | null; posterUrl: string; voteAverage: number | null };
type MealDbIngredient = { id: string; name: string; slugEn: string; thumb: string; imageUrl: string; description: string | null };

interface ExistingDish {
  id: string;
  name: string;
  imageUrl: string | null;
  canModify: boolean;
  author: string | null;
}

interface Props {
  existingDishes: ExistingDish[];
  topic?: TopicKey;
}

function normalizeImageUrl(url: string): string {
  if (!url.includes("images.unsplash.com")) return url;
  try {
    const u = new URL(url);
    u.searchParams.set("w", "600");
    u.searchParams.set("h", "400");
    u.searchParams.set("fit", "crop");
    u.searchParams.set("q", "80");
    u.searchParams.set("auto", "format");
    return u.toString();
  } catch {
    return url;
  }
}

function resizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const maxW = 800;
      const scale = img.width > maxW ? maxW / img.width : 1;
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = reject;
    img.src = url;
  });
}

function PhotoPicker({
  imageUrl, onChange, unsplashPhotos, unsplashLoading,
}: {
  imageUrl: string; onChange: (url: string) => void;
  unsplashPhotos: UnsplashPhoto[]; unsplashLoading: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try { onChange(await resizeImage(file)); }
    finally { setUploading(false); e.target.value = ""; }
  }

  return (
    <div className="space-y-2">
      {unsplashLoading && <p className="text-xs text-indigo-500">Chargement des suggestions…</p>}
      {unsplashPhotos.length > 0 && (
        <div className="grid grid-cols-3 gap-1.5">
          {unsplashPhotos.map((photo) => (
            <button key={photo.url} type="button"
              onClick={() => onChange(imageUrl === photo.url ? "" : photo.url)}
              className={`relative h-14 rounded-lg overflow-hidden border-2 transition-all ${
                imageUrl === photo.url ? "border-indigo-500 ring-2 ring-indigo-300" : "border-transparent hover:border-gray-300"
              }`}
            >
              <Image src={photo.thumb} alt={photo.alt} fill sizes="80px" className="object-cover" />
              {imageUrl === photo.url && (
                <div className="absolute inset-0 bg-indigo-500/30 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
          className="flex-shrink-0 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-gray-200 bg-white text-indigo-700 hover:bg-indigo-50 disabled:opacity-50 transition-colors">
          {uploading ? "…" : "📎 Fichier"}
        </button>
        <input type="text" value={imageUrl.startsWith("data:") ? "" : imageUrl}
          onChange={(e) => onChange(e.target.value)}
          onBlur={(e) => onChange(normalizeImageUrl(e.target.value))}
          placeholder="Coller une URL…"
          aria-label="URL de l'image"
          className="flex-1 min-w-0 px-2 py-1.5 text-xs rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-400"
        />
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="" className="w-9 h-9 rounded-lg object-cover flex-shrink-0 border border-gray-200"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            onLoad={(e) => { (e.target as HTMLImageElement).style.display = ""; }}
          />
        )}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} aria-label="Téléverser une image" />
      </div>
    </div>
  );
}

function SessionDishRow({
  dish, isEditing, alreadyAdded, editName, editImageUrl, editUnsplashPhotos, editUnsplashLoading,
  isPending, topic, onToggleEdit, onChangeName, onChangeImage, onSave, onDelete,
}: {
  dish: ExistingDish; isEditing: boolean; alreadyAdded: boolean; editName: string; editImageUrl: string;
  editUnsplashPhotos: UnsplashPhoto[]; editUnsplashLoading: boolean; isPending: boolean;
  topic: TopicKey;
  onToggleEdit: () => void; onChangeName: (v: string) => void; onChangeImage: (v: string) => void;
  onSave: () => void; onDelete: () => void;
}) {
  const canModify = dish.canModify;
  const thumb = isEditing ? editImageUrl : (dish.imageUrl ?? "");
  const [thumbBroken, setThumbBroken] = useState(false);
  useEffect(() => { setThumbBroken(false); }, [thumb]);
  const showThumb = thumb && !thumbBroken;
  const placeholderClass = `${topic === "movies" ? "w-10 h-14" : "w-12 h-12"} rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0 text-indigo-400 text-xl`;

  return (
    <m.div
      variants={listItemVariants}
      className={`rounded-xl border overflow-hidden transition-colors ${isEditing ? "border-indigo-300" : "border-gray-200"}`}
    >
      <div className="flex items-center bg-white">
        {(() => {
          const inner = (
            <>
              {showThumb ? (
                <div className={`relative ${topic === "movies" ? "w-10 h-14" : "w-12 h-12"} rounded-lg overflow-hidden flex-shrink-0`}>
                  {thumb.startsWith("data:") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={thumb} alt={dish.name} className="w-full h-full object-cover"
                      onError={() => setThumbBroken(true)} />
                  ) : (
                    <Image src={thumb} alt={dish.name} fill sizes="48px" className="object-cover"
                      onError={() => setThumbBroken(true)} />
                  )}
                </div>
              ) : (
                <div className={placeholderClass}>{TOPIC_CONFIG[topic].emoji}</div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{dish.name}</p>
                {dish.author && <p className="text-xs text-gray-400 truncate">par {dish.author}</p>}
                {alreadyAdded && <p className="text-xs text-indigo-500">Déjà ajouté</p>}
              </div>
              <span className={`text-xs font-medium flex-shrink-0 mr-2 ${canModify ? "text-gray-500" : "text-gray-300"}`}>
                {canModify ? (isEditing ? "✕" : "Éditer") : "Éditer"}
              </span>
            </>
          );
          return canModify ? (
            <button onClick={onToggleEdit}
              className="flex-1 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left px-3 py-2 min-w-0">
              {inner}
            </button>
          ) : (
            <div className="flex-1 flex items-center gap-3 text-left px-3 py-2 min-w-0 cursor-default">
              {inner}
            </div>
          );
        })()}
        <m.button
          onClick={onDelete}
          disabled={isPending || !canModify}
          whileTap={canModify ? { scale: 0.88 } : undefined}
          className={`flex-shrink-0 px-3 self-stretch flex items-center transition-colors disabled:opacity-50 ${
            canModify ? "text-gray-500 hover:text-red-400" : "text-gray-300 cursor-not-allowed"
          }`}
        >
          🗑
        </m.button>
      </div>

      <AnimatePresence>
        {isEditing && (
          <m.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 py-3 bg-white border-t border-indigo-100 space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Nom</label>
                <input type="text" value={editName} onChange={(e) => onChangeName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-400" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Photo</label>
                <PhotoPicker imageUrl={editImageUrl} onChange={onChangeImage}
                  unsplashPhotos={editUnsplashPhotos} unsplashLoading={editUnsplashLoading} />
              </div>
              <div className="flex gap-2 pt-1">
                <button onClick={onToggleEdit} className="flex-1 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">Annuler</button>
                <button onClick={onSave} disabled={isPending || !editName.trim()}
                  className="flex-1 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg hover:from-indigo-600 hover:to-indigo-700 disabled:opacity-50 transition-all">Enregistrer</button>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </m.div>
  );
}

export function GuestDishAdder({ existingDishes, topic = "ingredients" }: Props) {
  const topicCfg = TOPIC_CONFIG[topic];
  const categories = getCategoriesForTopic(topic);
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(20);
  const [isDrafting, setIsDrafting] = useState(false);
  const [draftCategory, setDraftCategory] = useState("Autre");
  const [draftImageUrl, setDraftImageUrl] = useState("");
  const [draftUnsplashPhotos, setDraftUnsplashPhotos] = useState<UnsplashPhoto[]>([]);
  const [draftUnsplashLoading, setDraftUnsplashLoading] = useState(false);
  const [editingDishId, setEditingDishId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editUnsplashPhotos, setEditUnsplashPhotos] = useState<UnsplashPhoto[]>([]);
  const [editUnsplashLoading, setEditUnsplashLoading] = useState(false);
  const [tmdbResults, setTmdbResults] = useState<TmdbMovie[]>([]);
  const [tmdbLoading, setTmdbLoading] = useState(false);
  const [tmdbError, setTmdbError] = useState<string | null>(null);
  const [mealDbIngResults, setMealDbIngResults] = useState<MealDbIngredient[]>([]);
  const [mealDbIngLoading, setMealDbIngLoading] = useState(false);

  useEffect(() => {
    if (topic === "movies") return;
    if (!isDrafting || !search.trim()) return;
    setDraftUnsplashPhotos([]); setDraftUnsplashLoading(true);
    fetch(`/api/unsplash?q=${encodeURIComponent(search.trim())}`)
      .then((r) => r.json()).then((d) => setDraftUnsplashPhotos(d.photos ?? []))
      .finally(() => setDraftUnsplashLoading(false));
  }, [topic, isDrafting, search]);

  useEffect(() => {
    if (topic === "movies") return;
    if (!editingDishId || !editName.trim()) return;
    setEditUnsplashPhotos([]); setEditUnsplashLoading(true);
    fetch(`/api/unsplash?q=${encodeURIComponent(editName.trim())}`)
      .then((r) => r.json()).then((d) => setEditUnsplashPhotos(d.photos ?? []))
      .finally(() => setEditUnsplashLoading(false));
  }, [topic, editingDishId, editName]);

  useEffect(() => {
    if (topic !== "ingredients") return;
    const trimmed = search.trim();
    if (!trimmed) { setMealDbIngResults([]); return; }
    const controller = new AbortController();
    const timer = setTimeout(() => {
      setMealDbIngLoading(true);
      fetch(`/api/mealdb-ingredients?q=${encodeURIComponent(trimmed)}`, { signal: controller.signal })
        .then((r) => r.json())
        .then((d) => setMealDbIngResults(d.ingredients ?? []))
        .catch((e) => { if (e.name !== "AbortError") setMealDbIngResults([]); })
        .finally(() => setMealDbIngLoading(false));
    }, 350);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [topic, search]);

  useEffect(() => {
    if (topic !== "movies") return;
    const trimmed = search.trim();
    if (!trimmed) { setTmdbResults([]); setTmdbError(null); return; }
    setTmdbError(null);
    const controller = new AbortController();
    const timer = setTimeout(() => {
      setTmdbLoading(true);
      fetch(`/api/tmdb?q=${encodeURIComponent(trimmed)}`, { signal: controller.signal })
        .then((r) => r.json())
        .then((d) => {
          if (d.error) { setTmdbError(d.error); setTmdbResults([]); }
          else setTmdbResults(d.movies ?? []);
        })
        .catch((e) => { if (e.name !== "AbortError") setTmdbError("Erreur TMDB"); })
        .finally(() => setTmdbLoading(false));
    }, 350);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [topic, search]);

  const normalize = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const q = normalize(search);
  const existingNames = new Set(existingDishes.map((d) => d.name.toLowerCase()));
  const filtered = existingDishes.filter((d) => !search.trim() || normalize(d.name).includes(q));
  const isNewCustom = search.trim() !== "" && !existingNames.has(search.trim().toLowerCase());
  // External API suggestions: only surface items not already in the catalogue.
  // Existing ones already render below as editable rows, so a buttonless
  // "Déjà ajouté" duplicate is just confusing noise.
  const tmdbNew = tmdbResults.filter((mv) => !existingNames.has(mv.title.toLowerCase()));
  const mealDbIngNew = mealDbIngResults.filter((ing) => !existingNames.has(ing.name.toLowerCase()));

  function toggleEdit(dish: ExistingDish) {
    if (editingDishId === dish.id) {
      setEditingDishId(null); setEditName(""); setEditImageUrl(""); setEditUnsplashPhotos([]);
    } else {
      setEditingDishId(dish.id); setEditName(dish.name); setEditImageUrl(dish.imageUrl ?? ""); setEditUnsplashPhotos([]);
    }
  }

  function showFeedback(msg: string, ms = 2500) {
    setFeedback(msg); setTimeout(() => setFeedback(null), ms);
  }

  async function addDish(dish: { name: string; category: string; imageUrl: string; tmdbRating?: number | null }) {
    startTransition(async () => {
      const result = await addDishAsMemberAction({ ...dish, topic });
      if (result?.error) showFeedback(result.error, 3000);
      else { showFeedback(`✓ "${dish.name}" ajouté !`); setSearch(""); setIsDrafting(false); setDraftImageUrl(""); router.refresh(); }
    });
  }

  async function removeDish(dishId: string) {
    startTransition(async () => {
      const result = await removeDishAsMemberAction(dishId);
      if (result?.error) showFeedback(result.error, 3000);
      else {
        if (editingDishId === dishId) { setEditingDishId(null); setEditName(""); setEditImageUrl(""); }
        router.refresh();
      }
    });
  }

  async function saveEdit() {
    if (!editingDishId) return;
    startTransition(async () => {
      const result = await updateDishAsMemberAction(editingDishId, {
        name: editName.trim() || undefined,
        imageUrl: editImageUrl,
      });
      if (result?.error) showFeedback(result.error, 3000);
      else { showFeedback("✓ Plat modifié !"); setEditingDishId(null); setEditName(""); setEditImageUrl(""); router.refresh(); }
    });
  }

  return (
    <div className="w-full pb-6">
      {/* Animated feedback toast */}
      <AnimatePresence>
        {feedback && (
          <m.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="mb-3 text-xs text-center py-2 px-3 rounded-xl bg-white border border-indigo-100 text-indigo-700 font-medium shadow-sm"
          >
            {feedback}
          </m.div>
        )}
      </AnimatePresence>

      <input
        type="text" value={search}
        onChange={(e) => { setSearch(e.target.value); setIsDrafting(false); setVisibleCount(20); }}
        placeholder={topicCfg.addPlaceholder}
        aria-label={topicCfg.addPlaceholder}
        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-400 bg-white mb-3 transition-all"
      />

      <div className="space-y-2">
        {/* Add custom dish */}
        <AnimatePresence mode="wait">
          {isNewCustom && (
            isDrafting ? (
              <m.div
                key="draft-form"
                variants={scaleInVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="rounded-2xl border border-indigo-200 overflow-hidden mb-2 bg-white shadow-sm"
              >
                <div className="px-4 py-3 bg-indigo-50 border-b border-indigo-100">
                  <p className="text-sm font-semibold text-indigo-900">Nouveau{topicCfg.itemLabelFem ? "lle" : ""} {topicCfg.itemLabel} : &quot;{search.trim()}&quot;</p>
                </div>
                <div className="px-4 py-3 space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Catégorie</label>
                    <div className="flex flex-wrap gap-1.5">
                      {categories.map((cat) => (
                        <m.button
                          key={cat}
                          type="button"
                          onClick={() => setDraftCategory(cat)}
                          whileTap={{ scale: 0.92 }}
                          className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${draftCategory === cat ? "bg-indigo-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                        >
                          {cat}
                        </m.button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Photo</label>
                    <PhotoPicker imageUrl={draftImageUrl} onChange={setDraftImageUrl}
                      unsplashPhotos={draftUnsplashPhotos} unsplashLoading={draftUnsplashLoading} />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => { setIsDrafting(false); setDraftImageUrl(""); setDraftCategory("Autre"); }}
                      className="flex-1 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">Annuler</button>
                    <button onClick={() => addDish({ name: search.trim(), category: draftCategory, imageUrl: draftImageUrl })}
                      disabled={isPending}
                      className="flex-1 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg hover:from-indigo-600 hover:to-indigo-700 disabled:opacity-50 transition-all">
                      Confirmer l&apos;ajout
                    </button>
                  </div>
                </div>
              </m.div>
            ) : (
              <m.button
                key="add-button"
                variants={scaleInVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={() => setIsDrafting(true)}
                disabled={isPending}
                whileHover={{ borderColor: "#6366f1" }}
                className="w-full flex items-center gap-3 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 transition-all text-left px-3 py-2"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-200 flex items-center justify-center flex-shrink-0 text-indigo-600 font-bold text-xl">+</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-indigo-900">Ajouter &quot;{search.trim()}&quot;</p>
                  <p className="text-xs text-indigo-500">Nouveau{topicCfg.itemLabelFem ? "lle" : ""} {topicCfg.itemLabel} personnalisé{topicCfg.itemLabelFem ? "e" : ""}</p>
                </div>
              </m.button>
            )
          )}
        </AnimatePresence>

        {/* TMDB live results — movies topic only */}
        {topic === "movies" && (
          <>
            {tmdbLoading && (
              <p className="text-xs text-center text-indigo-500 py-2">Recherche TMDB…</p>
            )}
            {tmdbError && (
              <p className="text-xs text-center text-red-400 py-2">{tmdbError}</p>
            )}
            {tmdbNew.length > 0 && (
              <m.div className="space-y-2" variants={listContainerVariants} initial="hidden" animate="visible">
                {tmdbNew.map((movie) => (
                  <m.button
                    key={movie.id}
                    variants={listItemVariants}
                    type="button"
                    disabled={isPending}
                    onClick={() => addDish({ name: movie.title, category: "Autre", imageUrl: movie.posterUrl, tmdbRating: movie.voteAverage })}
                    className="w-full flex items-center gap-3 rounded-2xl border bg-white text-left px-3 py-2 transition-all border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/40"
                  >
                    <div className="relative w-10 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                      {movie.posterThumb ? (
                        <Image src={movie.posterThumb} alt={movie.title} fill sizes="40px" className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 text-lg">🎬</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{movie.title}</p>
                      {movie.year && <p className="text-xs text-gray-500">{movie.year}</p>}
                    </div>
                    <span className="flex-shrink-0 text-indigo-400 text-lg font-bold">+</span>
                  </m.button>
                ))}
              </m.div>
            )}
          </>
        )}

        {/* MealDB ingredient live results — ingredients topic only */}
        {topic === "ingredients" && (
          <>
            {mealDbIngLoading && (
              <p className="text-xs text-center text-indigo-500 py-2">Recherche d&apos;ingrédients…</p>
            )}
            {mealDbIngNew.length > 0 && (
              <m.div className="space-y-2" variants={listContainerVariants} initial="hidden" animate="visible">
                {mealDbIngNew.map((ing) => (
                  <m.button
                    key={ing.id}
                    variants={listItemVariants}
                    type="button"
                    disabled={isPending}
                    onClick={() => addDish({ name: ing.name, category: "Autre", imageUrl: ing.imageUrl })}
                    className="w-full flex items-center gap-3 rounded-2xl border bg-white text-left px-3 py-2 transition-all border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/40"
                  >
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                      <Image src={ing.thumb} alt={ing.name} fill sizes="48px" className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{ing.name}</p>
                      {ing.description && (
                        <p className="text-xs text-gray-500 truncate">{ing.description.slice(0, 60)}…</p>
                      )}
                    </div>
                    <span className="flex-shrink-0 text-indigo-400 text-lg font-bold">+</span>
                  </m.button>
                ))}
              </m.div>
            )}
          </>
        )}

        {/* Dish list with stagger */}
        <m.div
          className="space-y-2"
          variants={listContainerVariants}
          initial="hidden"
          animate="visible"
        >
          {filtered.slice(0, visibleCount).map((dish) => (
            <SessionDishRow
              key={dish.id} dish={dish}
              isEditing={editingDishId === dish.id}
              alreadyAdded={search.trim() !== ""}
              editName={editName} editImageUrl={editImageUrl}
              editUnsplashPhotos={editUnsplashPhotos} editUnsplashLoading={editUnsplashLoading}
              isPending={isPending}
              topic={topic}
              onToggleEdit={() => toggleEdit(dish)}
              onChangeName={setEditName} onChangeImage={setEditImageUrl}
              onSave={saveEdit} onDelete={() => removeDish(dish.id)}
            />
          ))}
        </m.div>

        {filtered.length > visibleCount && (
          <button
            onClick={() => setVisibleCount((n) => n + 20)}
            className="w-full py-2.5 text-sm font-medium text-indigo-600 bg-white hover:bg-gray-50 rounded-xl border border-gray-200 transition-colors"
          >
            Voir plus ({filtered.length - visibleCount} restants)
          </button>
        )}
      </div>
    </div>
  );
}
