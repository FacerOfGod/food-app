"use client";

import { useActionState } from "react";
import { setNameAction } from "@/actions/auth";
import { m, AnimatePresence } from "framer-motion";

type State = { error?: string } | null;

interface Props {
  redirectTo?: string;
}

export function NameForm({ redirectTo }: Props) {
  const [state, action, pending] = useActionState<State, FormData>(
    setNameAction,
    null
  );

  return (
    <form action={action} className="space-y-4">
      {redirectTo && <input type="hidden" name="redirectTo" value={redirectTo} />}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
          Votre prénom
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="given-name"
          required
          autoFocus
          placeholder="Ex: Marie"
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-400 placeholder:text-gray-300 transition-all"
        />
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

      <m.button
        type="submit"
        disabled={pending}
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.01 }}
        className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl text-sm transition-all shadow-[0_2px_8px_rgba(99,102,241,0.35)]"
      >
        {pending ? "Enregistrement…" : "Continuer"}
      </m.button>
    </form>
  );
}
