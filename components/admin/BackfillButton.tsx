"use client";

import { useActionState } from "react";
import { backfillMoviePostersAction } from "@/actions/admin";

type Result = { updated: number; total: number; failed?: number; error?: string } | null;

export function BackfillButton() {
  const [result, formAction, isPending] = useActionState(
    async (_prev: Result, _fd: FormData) => backfillMoviePostersAction(),
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
              Mise à jour en cours…
            </>
          ) : (
            "🎬 Affiches films"
          )}
        </button>
      </form>
      {result !== null && !isPending && (
        <p className={`text-xs font-medium ${result.error ? "text-red-600" : result.updated === 0 ? "text-gray-500" : "text-green-600"}`}>
          {result.error
            ? result.error
            : result.total === 0
            ? "Aucun film à mettre à jour."
            : `✓ ${result.updated} / ${result.total} mises à jour.`}
        </p>
      )}
    </div>
  );
}
