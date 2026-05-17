"use client";

import { useActionState } from "react";
import { verifyOtpAction } from "@/actions/auth";
import { m, AnimatePresence } from "framer-motion";

type State = { error?: string } | null;

interface Props {
  email: string;
  redirectTo?: string;
}

export function OtpForm({ email, redirectTo }: Props) {
  const [state, action, pending] = useActionState<State, FormData>(
    verifyOtpAction,
    null
  );

  return (
    <m.form
      action={action}
      className="space-y-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <input type="hidden" name="email" value={email} />
      {redirectTo && <input type="hidden" name="redirectTo" value={redirectTo} />}

      <div>
        <label
          htmlFor="code"
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          Code à 6 chiffres
        </label>
        <input
          id="code"
          name="code"
          type="text"
          inputMode="numeric"
          maxLength={6}
          autoComplete="one-time-code"
          required
          autoFocus
          placeholder="123456"
          className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-center text-3xl font-bold tracking-[0.4em] focus:outline-none focus:ring-4 focus:ring-orange-400/20 focus:border-orange-400 transition-all placeholder:text-gray-200 placeholder:tracking-normal"
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
        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl text-sm transition-all shadow-[0_2px_8px_rgba(232,93,4,0.35)]"
      >
        {pending ? "Vérification…" : "Valider le code"}
      </m.button>
    </m.form>
  );
}
