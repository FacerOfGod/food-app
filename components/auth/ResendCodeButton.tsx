"use client";

import { useState, useTransition, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { resendOtpAction } from "@/actions/auth";

interface Props {
  email: string;
  redirectTo?: string;
}

const COOLDOWN_SECONDS = 30;

export function ResendCodeButton({ email, redirectTo }: Props) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => {
      setCooldown((c) => (c <= 1 ? 0 : c - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  useEffect(() => {
    if (status === "idle") return;
    const id = setTimeout(() => setStatus("idle"), 3500);
    return () => clearTimeout(id);
  }, [status]);

  const handle = () => {
    if (isPending || cooldown > 0) return;
    startTransition(async () => {
      const res = await resendOtpAction(email, redirectTo);
      if (res?.success) {
        setStatus("sent");
        setCooldown(COOLDOWN_SECONDS);
      } else {
        setErrorMsg(res?.error ?? "Erreur lors de l'envoi.");
        setStatus("error");
      }
    });
  };

  const label = isPending
    ? "Envoi…"
    : cooldown > 0
      ? `Renvoyer le code (${cooldown}s)`
      : "Renvoyer le code";

  return (
    <div className="text-center mt-4">
      <p className="text-xs text-gray-500">
        Pas reçu ?{" "}
        <button
          type="button"
          onClick={handle}
          disabled={isPending || cooldown > 0}
          className="text-indigo-500 underline font-medium hover:text-indigo-600 transition-colors disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed"
        >
          {label}
        </button>
      </p>
      <AnimatePresence>
        {status === "sent" && (
          <m.p
            key="sent"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="mt-2 inline-flex items-center gap-1 text-xs text-green-600"
          >
            <Check size={12} />
            Email renvoyé !
          </m.p>
        )}
        {status === "error" && (
          <m.p
            key="error"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="mt-2 text-xs text-red-600"
          >
            {errorMsg ?? "Erreur lors de l'envoi."}
          </m.p>
        )}
      </AnimatePresence>
    </div>
  );
}
