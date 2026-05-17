import type { DishPreset } from './food';

const u = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=600&h=400&fit=crop&q=80&auto=format`;

export const MOVIES_PRESET: DishPreset[] = [
  // ── Classiques ────────────────────────────────────────────────
  { name: "Le Fabuleux Destin d'Amélie Poulain", category: "Classique", imageUrl: u("1489599849927-2ee91cede3ba") },
  { name: "Intouchables", category: "Classique", imageUrl: u("1489599849927-2ee91cede3ba") },
  { name: "Le Grand Bleu", category: "Classique", imageUrl: u("1489599849927-2ee91cede3ba") },
  { name: "La Haine", category: "Classique", imageUrl: u("1489599849927-2ee91cede3ba") },
  { name: "Bienvenue chez les Ch'tis", category: "Comédie", imageUrl: u("1489599849927-2ee91cede3ba") },
  // ── Action ──────────────────────────────────────────────────
  { name: "Inception", category: "Action", imageUrl: u("1489599849927-2ee91cede3ba") },
  { name: "The Dark Knight", category: "Action", imageUrl: u("1489599849927-2ee91cede3ba") },
  { name: "Mad Max: Fury Road", category: "Action", imageUrl: u("1489599849927-2ee91cede3ba") },
  { name: "John Wick", category: "Action", imageUrl: u("1489599849927-2ee91cede3ba") },
  { name: "Mission: Impossible", category: "Action", imageUrl: u("1489599849927-2ee91cede3ba") },
  // ── Drame ──────────────────────────────────────────────────
  { name: "Forrest Gump", category: "Drame", imageUrl: u("1489599849927-2ee91cede3ba") },
  { name: "Parasite", category: "Drame", imageUrl: u("1489599849927-2ee91cede3ba") },
  { name: "The Shawshank Redemption", category: "Drame", imageUrl: u("1489599849927-2ee91cede3ba") },
  { name: "Schindler's List", category: "Drame", imageUrl: u("1489599849927-2ee91cede3ba") },
  { name: "Green Book", category: "Drame", imageUrl: u("1489599849927-2ee91cede3ba") },
  // ── Comédie ────────────────────────────────────────────────
  { name: "La Vérité si je mens !", category: "Comédie", imageUrl: u("1489599849927-2ee91cede3ba") },
  { name: "Qu'est-ce qu'on a fait au Bon Dieu ?", category: "Comédie", imageUrl: u("1489599849927-2ee91cede3ba") },
  { name: "Le Prénom", category: "Comédie", imageUrl: u("1489599849927-2ee91cede3ba") },
  { name: "Superbad", category: "Comédie", imageUrl: u("1489599849927-2ee91cede3ba") },
  // ── Animation ──────────────────────────────────────────────
  { name: "Le Roi Lion", category: "Animation", imageUrl: u("1489599849927-2ee91cede3ba") },
  { name: "Toy Story", category: "Animation", imageUrl: u("1489599849927-2ee91cede3ba") },
  { name: "Spirited Away", category: "Animation", imageUrl: u("1489599849927-2ee91cede3ba") },
  { name: "Coco", category: "Animation", imageUrl: u("1489599849927-2ee91cede3ba") },
  { name: "Vice-Versa", category: "Animation", imageUrl: u("1489599849927-2ee91cede3ba") },
  // ── Thriller / SF ──────────────────────────────────────────
  { name: "Interstellar", category: "Science-Fiction", imageUrl: u("1489599849927-2ee91cede3ba") },
  { name: "Matrix", category: "Science-Fiction", imageUrl: u("1489599849927-2ee91cede3ba") },
  { name: "Avengers: Endgame", category: "Science-Fiction", imageUrl: u("1489599849927-2ee91cede3ba") },
  { name: "Avatar", category: "Science-Fiction", imageUrl: u("1489599849927-2ee91cede3ba") },
  { name: "Dune", category: "Science-Fiction", imageUrl: u("1489599849927-2ee91cede3ba") },
  // ── Romance ────────────────────────────────────────────────
  { name: "La La Land", category: "Romance", imageUrl: u("1489599849927-2ee91cede3ba") },
  { name: "Before Sunrise", category: "Romance", imageUrl: u("1489599849927-2ee91cede3ba") },
  { name: "Harry Potter", category: "Fantaisie", imageUrl: u("1489599849927-2ee91cede3ba") },
];

export const MOVIE_CATEGORIES = [
  "Autre",
  ...new Set(MOVIES_PRESET.map((d) => d.category)),
];
