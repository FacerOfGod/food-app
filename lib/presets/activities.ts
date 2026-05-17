import type { DishPreset } from './food';

const u = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=600&h=400&fit=crop&q=80&auto=format`;

export const ACTIVITIES_PRESET: DishPreset[] = [
  // ── Sport & Plein air ────────────────────────────────────
  { name: "Randonnée", category: "Sport", imageUrl: u("1551632811-561732d1e306") },
  { name: "Vélo", category: "Sport", imageUrl: u("1519978778100-cb258ba4aa98") },
  { name: "Natation", category: "Sport", imageUrl: u("1530549387789-4c1017266635") },
  { name: "Escalade", category: "Sport", imageUrl: u("1522163723043-478ef79a5bb4") },
  { name: "Yoga", category: "Sport", imageUrl: u("1506126613408-eca07ce68773") },
  { name: "Football", category: "Sport", imageUrl: u("1553778263-73a83bab9b0c") },
  { name: "Tennis", category: "Sport", imageUrl: u("1554068865-4ce65f0277a1") },
  { name: "Ski", category: "Sport", imageUrl: u("1548438294-1ad5d5f4f063") },
  { name: "Running", category: "Sport", imageUrl: u("1571008887538-b36bb32f4571") },
  // ── Culture ──────────────────────────────────────────────
  { name: "Musée", category: "Culture", imageUrl: u("1554907984-15263bfd63bd") },
  { name: "Concert", category: "Culture", imageUrl: u("1493225457124-a3eb161ffa5f") },
  { name: "Théâtre", category: "Culture", imageUrl: u("1507676184212-d03ab07a01bf") },
  { name: "Cinéma", category: "Culture", imageUrl: u("1489599849927-2ee91cede3ba") },
  { name: "Exposition", category: "Culture", imageUrl: u("1545987796-200677ee1011") },
  { name: "Visite guidée", category: "Culture", imageUrl: u("1499856871958-5b9627545d1a") },
  // ── Loisirs ──────────────────────────────────────────────
  { name: "Jeux de société", category: "Loisirs", imageUrl: u("1530982011816-0d3d0b9e7a0e") },
  { name: "Bowling", category: "Loisirs", imageUrl: u("1601975855085-76da8f11ec18") },
  { name: "Karting", category: "Loisirs", imageUrl: u("1547428329-10e74e62fee0") },
  { name: "Escape Game", category: "Loisirs", imageUrl: u("1571168814280-e875fc2b97b4") },
  { name: "Laser Game", category: "Loisirs", imageUrl: u("1614680376739-414d95ff43df") },
  { name: "Karaoké", category: "Loisirs", imageUrl: u("1514525253161-7a46d19cd819") },
  { name: "Jeux vidéo", category: "Loisirs", imageUrl: u("1611996575749-79a3a250f948") },
  { name: "Paintball", category: "Loisirs", imageUrl: u("1614680376739-414d95ff43df") },
  // ── Gastronomie ──────────────────────────────────────────
  { name: "Restaurant", category: "Gastronomie", imageUrl: u("1414235077428-338989a2e8c0") },
  { name: "Brunch", category: "Gastronomie", imageUrl: u("1504754524776-8f4f37790ca0") },
  { name: "Cours de cuisine", category: "Gastronomie", imageUrl: u("1556909114-f6e7ad7d3136") },
  { name: "Dégstation de vins", category: "Gastronomie", imageUrl: u("1510812431401-41d2bd2722f3") },
  { name: "Marché", category: "Gastronomie", imageUrl: u("1488459716781-9e7a9f6b3f26") },
  // ── Nature & Détente ────────────────────────────────────
  { name: "Pique-nique", category: "Nature", imageUrl: u("1467189386127-c4e5e31ee213") },
  { name: "Plage", category: "Nature", imageUrl: u("1507525428034-b723cf961d3e") },
  { name: "Camping", category: "Nature", imageUrl: u("1504280390367-361c6d9f38f4") },
  { name: "Jardinage", category: "Nature", imageUrl: u("1416879595882-3373a0480b5b") },
  { name: "Spa / Bien-être", category: "Détente", imageUrl: u("1544161515-4cd6c730399c") },
  { name: "Sieste & Lecture", category: "Détente", imageUrl: u("1522202176988-66273c2fd55f") },
];

export const ACTIVITY_CATEGORIES = [
  "Autre",
  ...new Set(ACTIVITIES_PRESET.map((d) => d.category)),
];
