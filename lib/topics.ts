import { TOPIC_CONFIG, type TopicKey } from "@/lib/presets";

const TOPIC_KEYS = Object.keys(TOPIC_CONFIG) as TopicKey[];

export function isValidTopic(s: unknown): s is TopicKey {
  return typeof s === "string" && (TOPIC_KEYS as readonly string[]).includes(s);
}

export function parseTopicsJson(json: string | null | undefined): TopicKey[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return [];
    const seen = new Set<TopicKey>();
    for (const t of parsed) {
      if (isValidTopic(t)) seen.add(t);
    }
    return TOPIC_KEYS.filter((t) => seen.has(t));
  } catch {
    return [];
  }
}

export function stringifyTopics(topics: TopicKey[]): string {
  const seen = new Set<TopicKey>();
  for (const t of topics) {
    if (isValidTopic(t)) seen.add(t);
  }
  return JSON.stringify(TOPIC_KEYS.filter((t) => seen.has(t)));
}
