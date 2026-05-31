"use client";

import { useActionState } from "react";
import { resetIngredientsDbAction } from "@/actions/admin";

type Result = { deleted?: number; seeded?: number; error?: string } | null;

export function ResetFoodButton() {
  const [result, formAction, isPending] = useActionState(
    async (_prev: Result, _fd: FormData) => resetIngredientsDbAction(),
    null
  );

  return (
    <div className="flex flex-col gap-1.5">
      <form action={formAction}>
        <button
          type="submit"
          disabled={isPending}
          className="text-sm px-4 py-2 rounded-xl bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
        >
          {isPending ? (
            <>
              <span className="inline-block w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
              Reset en cours…
            </>
          ) : (
            "🗑️ Reset DB ingrédients"
          )}
        </button>
      </form>
      {result !== null && !isPending && (
        result.error ? (
          <p className="text-xs font-medium text-red-600">{result.error}</p>
        ) : (
          <p className="text-xs font-medium text-green-600">
            ✓ {result.deleted} supprimés, {result.seeded} rechargés.
          </p>
        )
      )}
    </div>
  );
}
