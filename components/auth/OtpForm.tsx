"use client";

import { useActionState } from "react";
import { verifyOtpAction } from "@/actions/auth";

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
    <form action={action} className="space-y-4">
      <input type="hidden" name="email" value={email} />
      {redirectTo && <input type="hidden" name="redirectTo" value={redirectTo} />}

      <div>
        <label
          htmlFor="code"
          className="block text-sm font-medium text-gray-700 mb-1"
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
          placeholder="123456"
          className="w-full px-3 py-3 border border-gray-300 rounded-lg text-center text-2xl font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
      >
        {pending ? "Vérification…" : "Valider le code"}
      </button>
    </form>
  );
}
