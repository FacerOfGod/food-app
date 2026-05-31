export type { DishPreset } from './food';
export { MOVIES_PRESET, MOVIE_CATEGORIES } from './movies';
export { ACTIVITIES_PRESET, ACTIVITY_CATEGORIES } from './activities';
export { INGREDIENTS_PRESET, INGREDIENT_CATEGORIES } from './ingredients';

export const TOPIC_CONFIG = {
  ingredients: {
    key: "ingredients",
    label: "Ingrédients",
    emoji: "🍽️",
    itemLabel: "ingrédient",
    itemLabelFem: false,
    itemLabelPlural: "ingrédients",
    searchPlaceholder: "Rechercher un ingrédient…",
    addPlaceholder: "Filtrer ou ajouter un ingrédient…",
    voteTitle: "Voter",
    voteDesc: "Note chaque ingrédient pour composer le menu idéal.",
    choixTitle: "Mes choix",
    choixDesc: "Retrouve tous les ingrédients et modifie tes votes à tout moment.",
    proposerTitle: "Proposer un ingrédient",
    proposerDesc: "Suggère un ingrédient à ajouter au catalogue partagé.",
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

import { MOVIES_PRESET, MOVIE_CATEGORIES } from './movies';
import { ACTIVITIES_PRESET, ACTIVITY_CATEGORIES } from './activities';
import { INGREDIENTS_PRESET, INGREDIENT_CATEGORIES } from './ingredients';
import type { DishPreset } from './food';

const PRESET_BY_TOPIC: Record<TopicKey, DishPreset[]> = {
  ingredients: INGREDIENTS_PRESET,
  movies: MOVIES_PRESET,
  activities: ACTIVITIES_PRESET,
};

const CATEGORIES_BY_TOPIC: Record<TopicKey, string[]> = {
  ingredients: INGREDIENT_CATEGORIES,
  movies: MOVIE_CATEGORIES,
  activities: ACTIVITY_CATEGORIES,
};

function isTopicKey(topic: string): topic is TopicKey {
  return topic in PRESET_BY_TOPIC;
}

export function getPresetForTopic(topic: string): DishPreset[] {
  return isTopicKey(topic) ? PRESET_BY_TOPIC[topic] : [];
}

export function getCategoriesForTopic(topic: string): string[] {
  return isTopicKey(topic) ? CATEGORIES_BY_TOPIC[topic] : [];
}
