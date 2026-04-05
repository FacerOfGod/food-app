"use client";

import { useActionState } from "react";
import { createSessionAction } from "@/actions/sessions";

type State = { error?: string } | null;

export function CreateSessionForm() {
  const [state, action, pending] = useActionState<State, FormData>(
    createSessionAction,
    null
  );

  return (
    <form action={action} className="flex gap-2">
      <input
        name="name"
        type="text"
        required
        placeholder="Ex: Dîner de Noël"
        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
      />
      <button
        type="submit"
        disabled={pending}
        className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors whitespace-nowrap"
      >
        {pending ? "…" : "Créer"}
      </button>
      {state?.error && (
        <p className="text-sm text-red-600">{state.error}</p>
      )}
    </form>
  );
}
