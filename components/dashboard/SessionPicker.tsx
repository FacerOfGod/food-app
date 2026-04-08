"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface Session {
  id: string;
  name: string;
}

interface Props {
  sessions: Session[];
  joinedSessions: Session[];
  currentSessionId: string | null;
}

export function SessionPicker({ sessions, joinedSessions, currentSessionId }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get("view") ?? "sessions";

  const allSessions = [
    ...sessions.map((s) => ({ ...s, role: "host" as const })),
    ...joinedSessions.map((s) => ({ ...s, role: "member" as const })),
  ];

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const sessionId = e.target.value;
    if (!sessionId) return;
    router.push(`/dashboard?view=${view}&session=${sessionId}`);
  }

  return (
    <div className="mb-4">
      <label className="block text-xs font-medium text-gray-500 mb-1.5">
        Session
      </label>
      <select
        value={currentSessionId ?? ""}
        onChange={handleChange}
        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400"
      >
        <option value="" disabled>
          Sélectionne une session…
        </option>
        {allSessions.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}{s.role === "host" ? " (hôte)" : ""}
          </option>
        ))}
      </select>
    </div>
  );
}
