// Single source of truth for the 1-5 vote scale and the visual treatments
// applied to it. Each surface picks the field it needs:
//   - PeopleView (badge pill)             → emoji + badge
//   - VotingInterface (dot indicator)     → dot + ring
// New visual treatments should add a field rather than redefining the scale.
export interface RatingMeta {
  value: 1 | 2 | 3 | 4 | 5;
  label: string;
  emoji: string;
  badge: string; // tailwind classes for a pill
  dot: string;   // tailwind bg-* for a circular indicator
  ring: string;  // tailwind ring-* matching `dot`
}

export const RATINGS: readonly RatingMeta[] = [
  {
    value: 1,
    label: "Éviter",
    emoji: "🙅",
    badge: "bg-red-100 text-red-800",
    dot: "bg-red-800",
    ring: "ring-red-800",
  },
  {
    value: 2,
    label: "N'aime pas",
    emoji: "😕",
    badge: "bg-emerald-100 text-emerald-800",
    dot: "bg-red-400",
    ring: "ring-red-400",
  },
  {
    value: 3,
    label: "Neutre",
    emoji: "😐",
    badge: "bg-gray-100 text-gray-700",
    dot: "bg-gray-400",
    ring: "ring-gray-400",
  },
  {
    value: 4,
    label: "J'aime",
    emoji: "😋",
    badge: "bg-green-100 text-green-800",
    dot: "bg-indigo-600",
    ring: "ring-indigo-600",
  },
  {
    value: 5,
    label: "J'adore",
    emoji: "😍",
    badge: "bg-green-200 text-green-900",
    dot: "bg-indigo-900",
    ring: "ring-indigo-900",
  },
];
