"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { addDishAsMemberAction, updateDishAsMemberAction, removeDishAsMemberAction } from "@/actions/dishes";
import { PRESET_CATEGORIES } from "@/lib/dishes-preset";

type UnsplashPhoto = { thumb: string; url: string; alt: string };

interface ExistingDish {
  id: string;
  name: string;
  imageUrl: string | null;
  authorsJson: string;
}

interface Props {
  existingDishes: ExistingDish[];
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
      {unsplashLoading && <p className="text-xs text-orange-500">Chargement des suggestions…</p>}
      {unsplashPhotos.length > 0 && (
        <div className="grid grid-cols-3 gap-1.5">
          {unsplashPhotos.map((photo) => (
            <button key={photo.url} type="button"
              onClick={() => onChange(imageUrl === photo.url ? "" : photo.url)}
              className={`relative h-14 rounded-lg overflow-hidden border-2 transition-all ${
                imageUrl === photo.url ? "border-orange-500 ring-2 ring-orange-300" : "border-transparent hover:border-gray-300"
              }`}
            >
              <Image src={photo.thumb} alt={photo.alt} fill sizes="80px" className="object-cover" />
              {imageUrl === photo.url && (
                <div className="absolute inset-0 bg-orange-500/30 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
          className="flex-shrink-0 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-gray-200 bg-white text-orange-700 hover:bg-white disabled:opacity-50 transition-colors">
          {uploading ? "…" : "📎 Fichier"}
        </button>
        <input type="text" value={imageUrl.startsWith("data:") ? "" : imageUrl}
          onChange={(e) => onChange(e.target.value)}
          onBlur={(e) => onChange(normalizeImageUrl(e.target.value))}
          placeholder="Coller une URL…"
          className="flex-1 min-w-0 px-2 py-1.5 text-xs rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="" className="w-9 h-9 rounded-lg object-cover flex-shrink-0 border border-gray-200"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            onLoad={(e) => { (e.target as HTMLImageElement).style.display = ""; }}
          />
        )}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
    </div>
  );
}

function SessionDishRow({
  dish, isEditing, editName, editImageUrl, editUnsplashPhotos, editUnsplashLoading,
  isPending, onToggleEdit, onChangeName, onChangeImage, onSave, onDelete,
}: {
  dish: ExistingDish; isEditing: boolean; editName: string; editImageUrl: string;
  editUnsplashPhotos: UnsplashPhoto[]; editUnsplashLoading: boolean; isPending: boolean;
  onToggleEdit: () => void; onChangeName: (v: string) => void; onChangeImage: (v: string) => void;
  onSave: () => void; onDelete: () => void;
}) {
  let authors: string[] = [];
  try { authors = JSON.parse(dish.authorsJson); } catch {}
  const thumb = isEditing ? editImageUrl : (dish.imageUrl ?? "");

  return (
    <div className={`rounded-xl border overflow-hidden transition-colors ${isEditing ? "border-gray-400" : "border-gray-200"}`}>
      <div className="flex items-center bg-white">
        <button onClick={onToggleEdit}
          className="flex-1 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left px-3 py-2 min-w-0">
          {thumb ? (
            <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
              {thumb.startsWith("data:") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={thumb} alt={dish.name} className="w-full h-full object-cover" />
              ) : (
                <Image src={thumb} alt={dish.name} fill sizes="48px" className="object-cover" />
              )}
            </div>
          ) : (
            <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0 text-orange-400 text-xl">🍽️</div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">{dish.name}</p>
            {authors.length > 0 && <p className="text-xs text-orange-500">par {authors.join(", ")}</p>}
          </div>
          <span className="text-gray-400 text-xs font-medium flex-shrink-0 mr-2">{isEditing ? "✕" : "Éditer"}</span>
        </button>
        <button onClick={onDelete} disabled={isPending}
          className="flex-shrink-0 px-3 self-stretch flex items-center text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50">
          🗑
        </button>
      </div>

      {isEditing && (
        <div className="px-4 py-3 bg-white border-t border-orange-100 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Nom</label>
            <input type="text" value={editName} onChange={(e) => onChangeName(e.target.value)}
              className="w-full px-2 py-1.5 text-sm rounded-lg border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Photo</label>
            <PhotoPicker imageUrl={editImageUrl} onChange={onChangeImage}
              unsplashPhotos={editUnsplashPhotos} unsplashLoading={editUnsplashLoading} />
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={onToggleEdit} className="flex-1 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">Annuler</button>
            <button onClick={onSave} disabled={isPending || !editName.trim()}
              className="flex-1 py-1.5 text-xs font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 disabled:opacity-50">Enregistrer</button>
          </div>
        </div>
      )}
    </div>
  );
}

export function GuestDishAdder({ existingDishes }: Props) {
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

  useEffect(() => {
    if (!isDrafting || !search.trim()) return;
    setDraftUnsplashPhotos([]); setDraftUnsplashLoading(true);
    fetch(`/api/unsplash?q=${encodeURIComponent(search.trim())}`)
      .then((r) => r.json()).then((d) => setDraftUnsplashPhotos(d.photos ?? []))
      .finally(() => setDraftUnsplashLoading(false));
  }, [isDrafting, search]);

  useEffect(() => {
    if (!editingDishId || !editName.trim()) return;
    setEditUnsplashPhotos([]); setEditUnsplashLoading(true);
    fetch(`/api/unsplash?q=${encodeURIComponent(editName.trim())}`)
      .then((r) => r.json()).then((d) => setEditUnsplashPhotos(d.photos ?? []))
      .finally(() => setEditUnsplashLoading(false));
  }, [editingDishId, editName]);

  const normalize = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const q = normalize(search);

  const existingNames = new Set(existingDishes.map((d) => d.name.toLowerCase()));

  const filtered = existingDishes.filter((d) => {
    if (!search.trim()) return true;
    return normalize(d.name).includes(q);
  });

  const isNewCustom = search.trim() !== "" && !existingNames.has(search.trim().toLowerCase());

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

  async function addDish(dish: { name: string; category: string; imageUrl: string }) {
    startTransition(async () => {
      const result = await addDishAsMemberAction(dish);
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
      {feedback && (
        <div className="mb-3 text-xs text-center py-2 px-3 rounded-lg bg-white text-orange-700 font-medium">
          {feedback}
        </div>
      )}

      <input
        type="text" value={search}
        onChange={(e) => { setSearch(e.target.value); setIsDrafting(false); setVisibleCount(20); }}
        placeholder="Filtrer ou ajouter un plat…"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white mb-3"
      />


      <div className="space-y-2">
        {/* Add custom dish */}
        {isNewCustom && (
          isDrafting ? (
            <div className="rounded-xl border border-gray-300 overflow-hidden mb-2">
              <div className="px-4 py-3 bg-white border-b border-gray-200">
                <p className="text-sm font-semibold text-orange-900">Nouveau plat : &quot;{search.trim()}&quot;</p>
              </div>
              <div className="px-4 py-3 bg-white space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Catégorie</label>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_CATEGORIES.map((cat) => (
                      <button key={cat} type="button" onClick={() => setDraftCategory(cat)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${draftCategory === cat ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                        {cat}
                      </button>
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
                    className="flex-1 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">Annuler</button>
                  <button onClick={() => addDish({ name: search.trim(), category: draftCategory, imageUrl: draftImageUrl })}
                    disabled={isPending}
                    className="flex-1 py-1.5 text-xs font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 disabled:opacity-50">
                    Confirmer l&apos;ajout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button onClick={() => setIsDrafting(true)} disabled={isPending}
              className="w-full flex items-center gap-3 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 transition-all text-left px-3 py-2">
              <div className="w-12 h-12 rounded-lg bg-orange-200 flex items-center justify-center flex-shrink-0 text-orange-600 font-bold text-xl">+</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-orange-900">Ajouter &quot;{search.trim()}&quot;</p>
                <p className="text-xs text-orange-600">Nouveau plat personnalisé</p>
              </div>
            </button>
          )
        )}

        {/* All session dishes — all orange */}
        {filtered.slice(0, visibleCount).map((dish) => (
          <SessionDishRow
            key={dish.id} dish={dish}
            isEditing={editingDishId === dish.id}
            editName={editName} editImageUrl={editImageUrl}
            editUnsplashPhotos={editUnsplashPhotos} editUnsplashLoading={editUnsplashLoading}
            isPending={isPending}
            onToggleEdit={() => toggleEdit(dish)}
            onChangeName={setEditName} onChangeImage={setEditImageUrl}
            onSave={saveEdit} onDelete={() => removeDish(dish.id)}
          />
        ))}

        {filtered.length > visibleCount && (
          <button
            onClick={() => setVisibleCount((n) => n + 20)}
            className="w-full py-2.5 text-sm font-medium text-orange-600 bg-white hover:bg-gray-50 rounded-xl border border-gray-200 transition-colors"
          >
            Voir plus ({filtered.length - visibleCount} restants)
          </button>
        )}
      </div>
    </div>
  );
}
