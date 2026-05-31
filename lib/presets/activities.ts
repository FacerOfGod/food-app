import type { DishPreset } from './food';

// Free Unsplash photos (images.unsplash.com)
const u = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=800&fit=clip&q=80&auto=format`;

// Premium Unsplash photos (plus.unsplash.com)
const p = (id: string) =>
  `https://plus.unsplash.com/premium_photo-${id}?w=800&fit=clip&q=80&auto=format`;

export const ACTIVITIES_PRESET: DishPreset[] = [
  // ── Sport & Plein air ────────────────────────────────────
  { name: "Randonnée", category: "Sport", imageUrl: p("1677002240252-af3f88114efc") },
  { name: "Vélo",      category: "Sport", imageUrl: p("1713184149461-69b0abeb3daa") },
  { name: "Natation",  category: "Sport", imageUrl: p("1676638836435-8c03501bb959") },
  { name: "Escalade",  category: "Sport", imageUrl: p("1683380297110-a8d0ab72f79e") },
  { name: "Yoga",      category: "Sport", imageUrl: p("1664299350663-9a5648f66c2c") },
  { name: "Football",  category: "Sport", imageUrl: p("1661868926397-0083f0503c07") },
  { name: "Tennis",    category: "Sport", imageUrl: p("1666913667082-c1fecc45275d") },
  { name: "Ski",       category: "Sport", imageUrl: p("1661868371660-eac62d15361f") },
  { name: "Running",   category: "Sport", imageUrl: p("1674605365723-15e6749630f4") },
  { name: "Surf",      category: "Sport", imageUrl: p("1672510000383-8f46f7b157b0") },
  { name: "Boxe",      category: "Sport", imageUrl: p("1681400614910-2e80fa375521") },
  { name: "Paddle",    category: "Sport", imageUrl: p("1681883760386-62d77639384e") },
  { name: "Golf",      category: "Sport", imageUrl: p("1679710943658-1565004c00ac") },
  { name: "Badminton", category: "Sport", imageUrl: u("1626224583764-f87db24ac4ea") },
  { name: "Pilates",   category: "Sport", imageUrl: u("1579454566790-f9e5697ddf36") },
  // ── Culture ──────────────────────────────────────────────
  { name: "Musée",         category: "Culture", imageUrl: p("1661893375334-e2603ce341d7") },
  { name: "Concert",       category: "Culture", imageUrl: p("1661286678499-211423a9ff5e") },
  { name: "Théâtre",       category: "Culture", imageUrl: p("1664302637848-6ae0d5821944") },
  { name: "Cinéma",        category: "Culture", imageUrl: u("1489599849927-2ee91cede3ba") },
  { name: "Exposition",    category: "Culture", imageUrl: p("1677609991615-0657859f0a8a") },
  { name: "Visite guidée", category: "Culture", imageUrl: p("1716937389119-37d11a6c8a92") },
  { name: "Opéra",         category: "Culture", imageUrl: p("1664303098722-7e5287a4693b") },
  { name: "Lecture",       category: "Culture", imageUrl: p("1669652639337-c513cc42ead6") },
  { name: "Conférence",    category: "Culture", imageUrl: p("1679547202671-f9dbbf466db4") },
  // ── Loisirs ──────────────────────────────────────────────
  { name: "Jeux de société", category: "Loisirs", imageUrl: p("1718879381673-32a65784d27c") },
  { name: "Bowling",         category: "Loisirs", imageUrl: p("1679321795564-f73ec1c21fcd") },
  { name: "Karting",         category: "Loisirs", imageUrl: u("1640084347692-e8f6b84caa7c") },
  { name: "Escape Game",     category: "Loisirs", imageUrl: u("1569002925653-ed18f55d7292") },
  { name: "Laser Game",      category: "Loisirs", imageUrl: u("1750548546292-0f9f1db12d50") },
  { name: "Karaoké",         category: "Loisirs", imageUrl: p("1670884128477-a34439142795") },
  { name: "Jeux vidéo",      category: "Loisirs", imageUrl: p("1731951687007-2910df0a8f73") },
  { name: "Paintball",       category: "Loisirs", imageUrl: u("1759872138838-45bd5c07ddc6") },
  { name: "Billard",         category: "Loisirs", imageUrl: p("1664391962463-890e9d1bca47") },
  { name: "Mini-Golf",       category: "Loisirs", imageUrl: p("1661897744682-39f3fc0f204b") },
  { name: "Soirée quiz",     category: "Loisirs", imageUrl: p("1678216286021-e81f66761751") },
  // ── Gastronomie ──────────────────────────────────────────
  { name: "Restaurant",          category: "Gastronomie", imageUrl: p("1661883237884-263e8de8869b") },
  { name: "Brunch",              category: "Gastronomie", imageUrl: p("1672363353897-ae5a81a1ab57") },
  { name: "Cours de cuisine",    category: "Gastronomie", imageUrl: p("1683707120391-6c0da3cac6be") },
  { name: "Dégustation de vins", category: "Gastronomie", imageUrl: p("1719997502353-88e25b8f266c") },
  { name: "Marché",              category: "Gastronomie", imageUrl: p("1686529896385-8a8d581d0225") },
  { name: "Bar à cocktails",     category: "Gastronomie", imageUrl: p("1670270203164-aa65468a9c67") },
  { name: "Atelier pâtisserie",  category: "Gastronomie", imageUrl: p("1661288486308-6d434fa1a232") },
  { name: "Fondue",              category: "Gastronomie", imageUrl: p("1664391800354-0959d811c2b0") },
  // ── Nature ──────────────────────────────────────────────
  { name: "Pique-nique",             category: "Nature", imageUrl: p("1686593546445-e9655e1eaea5") },
  { name: "Plage",                   category: "Nature", imageUrl: p("1677691961682-490fc5c593bf") },
  { name: "Camping",                 category: "Nature", imageUrl: p("1680788452823-49bb63651490") },
  { name: "Jardinage",               category: "Nature", imageUrl: p("1680286739871-01142bc609df") },
  { name: "Kayak / Canoë",           category: "Nature", imageUrl: p("1667930297756-5ed38a5be108") },
  { name: "Observation des étoiles", category: "Nature", imageUrl: p("1686050878751-89499d28d153") },
  { name: "Cueillette",              category: "Nature", imageUrl: p("1677781688795-29962178a72c") },
  // ── Détente ──────────────────────────────────────────────
  { name: "Spa / Bien-être",  category: "Détente", imageUrl: p("1683134294916-473fc738750b") },
  { name: "Sieste & Lecture", category: "Détente", imageUrl: p("1711391559274-7fa38a89e54f") },
  // ── Aventure ─────────────────────────────────────────────
  { name: "Accrobranche",      category: "Aventure", imageUrl: p("1677636665401-6d1b629bd720") },
  { name: "Saut en parachute", category: "Aventure", imageUrl: p("1664391674385-1deb77c63cc7") },
  { name: "Tyrolienne",        category: "Aventure", imageUrl: p("1664302954288-b3a858d59961") },
  { name: "Quad / Moto",       category: "Aventure", imageUrl: p("1661962324880-d13ab211a6e2") },
  { name: "Rafting",           category: "Aventure", imageUrl: p("1661891887710-0528c1d76b92") },
  // ── Créativité ───────────────────────────────────────────
  { name: "Peinture",        category: "Créativité", imageUrl: u("1541753866388-0b3c701627d3") },
  { name: "Poterie",         category: "Créativité", imageUrl: p("1661380954234-13d98a83577c") },
  { name: "Photographie",    category: "Créativité", imageUrl: p("1674389991678-0836ca77c7f7") },
  { name: "Dessin",          category: "Créativité", imageUrl: p("1664197369883-a16e8ca7e503") },
  { name: "Atelier couture", category: "Créativité", imageUrl: p("1664372599702-2e7f65dcba39") },
];

export const ACTIVITY_CATEGORIES = [
  "Autre",
  ...new Set(ACTIVITIES_PRESET.map((d) => d.category)),
];
