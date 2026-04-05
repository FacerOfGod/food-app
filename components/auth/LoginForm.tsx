"use client";

import { useActionState } from "react";
import { sendOtpAction } from "@/actions/auth";
import { useSearchParams } from "next/navigation";

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

      {state?.needsName && (
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
          />
        </div>
      )}

      {state?.needsName ? (
        <input type="hidden" name="email" value={state.email || ""} />
      ) : (
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
          />
        </div>
      )}

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
        {pending ? "Envoi en cours…" : "Recevoir le code par email"}
      </button>
    </form>
  );
}
