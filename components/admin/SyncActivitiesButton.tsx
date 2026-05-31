"use client";

import { useActionState } from "react";
import { syncActivitiesAction } from "@/actions/admin";

type Result = { inserted?: number; updated?: number; error?: string } | null;

export function SyncActivitiesButton() {
  const [result, formAction, isPending] = useActionState(
    async (_prev: Result, _fd: FormData) => syncActivitiesAction(),
    null
  );

  return (
    <div className="flex flex-col gap-1.5">
      <form action={formAction}>
        <button
          type="submit"
          disabled={isPending}
          className="text-sm px-4 py-2 rounded-xl bg-indigo-100 text-indigo-700 hover:bg-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
        >
          {isPending ? (
            <>
              <span className="inline-block w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
              Sync en cours…
            </>
          ) : (
            "🏃 Sync activités"
          )}
        </button>
      </form>
      {result !== null && !isPending && (
        "error" in result && result.error ? (
          <p className="text-xs font-medium text-red-600">{result.error}</p>
        ) : (
          <p className="text-xs font-medium text-green-600">
            ✓ {result.inserted} ajoutées, {result.updated} images mises à jour.
          </p>
        )
      )}
    </div>
  );
}
