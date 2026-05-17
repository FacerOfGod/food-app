export type { DishPreset } from './food';
export { DISHES_PRESET, PRESET_CATEGORIES } from './food';
export { MOVIES_PRESET, MOVIE_CATEGORIES } from './movies';
export { ACTIVITIES_PRESET, ACTIVITY_CATEGORIES } from './activities';

export const TOPIC_CONFIG = {
  food: {
    key: "food",
    label: "Nourriture",
    emoji: "🍽️",
    itemLabel: "plat",
    itemLabelFem: false,
    itemLabelPlural: "plats",
    searchPlaceholder: "Rechercher un plat…",
    addPlaceholder: "Filtrer ou ajouter un plat…",
    voteTitle: "Voter",
    voteDesc: "Note chaque plat pour aider à choisir le repas idéal.",
    choixTitle: "Mes choix",
    choixDesc: "Retrouve tous les plats et modifie tes votes à tout moment.",
    proposerTitle: "Proposer un plat",
    proposerDesc: "Suggère un nouveau plat à ajouter au catalogue partagé.",
  },
  movies: {
    key: "movies",
    label: "Films",
    emoji: "🎬",
    itemLabel: "film",
    itemLabelFem: false,
    itemLabelPlural: "films",
    searchPlaceholder: "Rechercher un film…",
    addPlaceholder: "Filtrer ou ajouter un film…",
    voteTitle: "Voter",
    voteDesc: "Note chaque film pour choisir ce que vous regarderez ensemble.",
    choixTitle: "Mes choix",
    choixDesc: "Retrouve tous les films et modifie tes votes à tout moment.",
    proposerTitle: "Proposer un film",
    proposerDesc: "Suggère un film à regarder ensemble.",
  },
  activities: {
    key: "activities",
    label: "Activités",
    emoji: "🎭",
    itemLabel: "activité",
    itemLabelFem: true,
    itemLabelPlural: "activités",
    searchPlaceholder: "Rechercher une activité…",
    addPlaceholder: "Filtrer ou ajouter une activité…",
    voteTitle: "Voter",
    voteDesc: "Note chaque activité pour choisir ce que vous ferez ensemble.",
    choixTitle: "Mes choix",
    choixDesc: "Retrouve toutes les activités et modifie tes votes à tout moment.",
    proposerTitle: "Proposer une activité",
    proposerDesc: "Suggère une activité à faire ensemble.",
  },
} as const;

export type TopicKey = keyof typeof TOPIC_CONFIG;

export const TOPICS = Object.values(TOPIC_CONFIG);

import { DISHES_PRESET, PRESET_CATEGORIES } from './food';
import { MOVIES_PRESET, MOVIE_CATEGORIES } from './movies';
import { ACTIVITIES_PRESET, ACTIVITY_CATEGORIES } from './activities';
import type { DishPreset } from './food';

export function getPresetForTopic(topic: string): DishPreset[] {
  if (topic === "movies") return MOVIES_PRESET;
  if (topic === "activities") return ACTIVITIES_PRESET;
  return DISHES_PRESET;
}

export function getCategoriesForTopic(topic: string): string[] {
  if (topic === "movies") return MOVIE_CATEGORIES;
  if (topic === "activities") return ACTIVITY_CATEGORIES;
  return PRESET_CATEGORIES;
}
