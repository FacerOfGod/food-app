"use client";

import { useActionState } from "react";
import { sendOtpAction } from "@/actions/auth";
import { useSearchParams } from "next/navigation";
import { m, AnimatePresence } from "framer-motion";
import { scaleInVariants } from "@/components/motion/variants";

type State = { error?: string; needsName?: boolean; email?: string } | null;

interface Props {
  redirectTo?: string;
}

export function LoginForm({ redirectTo: redirectToProp }: Props) {
  const searchParams = useSearchParams();
  const redirectTo = redirectToProp ?? searchParams.get("redirectTo");

  const [state, action, pending] = useActionState<State, FormData>(
    sendOtpAction,
    null
  );

  return (
    <form action={action} className="space-y-4">
      {redirectTo && (
        <input type="hidden" name="redirectTo" value={redirectTo} />
      )}

      <AnimatePresence mode="popLayout">
        {state?.needsName ? (
          <m.div
            key="name-field"
            variants={scaleInVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Comment devons-nous vous appeler ?
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="given-name"
              required={state.needsName}
              autoFocus
              placeholder="Ex: Marie"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-400 placeholder:text-gray-300 transition-all"
            />
          </m.div>
        ) : (
          <m.div
            key="email-field"
            variants={scaleInVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Adresse email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="marie@exemple.com"
              defaultValue={state?.email || ""}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-400 placeholder:text-gray-300 transition-all"
            />
          </m.div>
        )}
      </AnimatePresence>

      {state?.needsName && (
        <input type="hidden" name="email" value={state.email || ""} />
      )}

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
        {pending ? "Envoi en cours…" : "Recevoir le code par email"}
      </m.button>
    </form>
  );
}
