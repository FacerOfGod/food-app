"use client";

import { useActionState } from "react";
import { createSessionAction } from "@/actions/sessions";
import { m, AnimatePresence } from "framer-motion";

type State = { error?: string } | null;

export function CreateSessionForm() {
  const [state, action, pending] = useActionState<State, FormData>(
    createSessionAction,
    null
  );

  return (
    <form action={action} className="space-y-3">
      <div className="flex gap-2">
        <input
          name="name"
          type="text"
          required
          placeholder="Ex: Famille, Amis de Lausanne, Collègues…"
          className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-400 transition-all"
        />
        <m.button
          type="submit"
          disabled={pending}
          whileTap={{ scale: 0.97 }}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-60 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-all whitespace-nowrap shadow-[0_2px_8px_rgba(232,93,4,0.25)]"
        >
          {pending ? "…" : "Créer"}
        </m.button>
      </div>
      <AnimatePresence>
        {state?.error && (
          <m.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2"
          >
            {state.error}
          </m.p>
        )}
      </AnimatePresence>
    </form>
  );
}
