"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { m } from "framer-motion";
import { deleteSessionAction } from "@/actions/sessions";

export function DeleteSessionButton({ sessionId, sessionName }: { sessionId: string; sessionName: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le groupe "${sessionName}" et toutes ses données ?`)) {
      startTransition(async () => {
        const result = await deleteSessionAction(sessionId);
        if (result?.error) {
          alert(result.error);
        } else {
          router.refresh();
        }
      });
    }
  }

  return (
    <m.button
      onClick={handleDelete}
      disabled={isPending}
      whileTap={{ scale: 0.88 }}
      className={`p-2 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors ${
        isPending ? "opacity-50 cursor-not-allowed" : ""
      }`}
      aria-label="Supprimer le groupe"
      title="Supprimer"
    >
      <Trash2 size={16} />
    </m.button>
  );
}
