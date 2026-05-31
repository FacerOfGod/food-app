"use client";

import { useActionState, useRef, useState, useEffect } from "react";
import { verifyOtpAction } from "@/actions/auth";
import { m, AnimatePresence } from "framer-motion";

type State = { error?: string } | null;

interface Props {
  email: string;
  redirectTo?: string;
  initialCode?: string;
}

export function OtpForm({ email, redirectTo, initialCode }: Props) {
  const [state, action, pending] = useActionState<State, FormData>(
    verifyOtpAction,
    null
  );
  const formRef = useRef<HTMLFormElement>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const lastSubmittedCode = useRef("");

  const [digits, setDigits] = useState<string[]>(() =>
    initialCode && /^\d{6}$/.test(initialCode)
      ? initialCode.split("")
      : Array(6).fill("")
  );

  const code = digits.join("");
  const isFull = code.length === 6 && !digits.includes("");
  const hasError = !!state?.error;
  const isSuccess = isFull && !hasError;

  useEffect(() => {
    if (isFull && code !== lastSubmittedCode.current && !pending) {
      lastSubmittedCode.current = code;
      const timer = setTimeout(() => formRef.current?.requestSubmit(), 800);
      return () => clearTimeout(timer);
    }
  }, [code, isFull, pending]);

  const update = (index: number, digit: string) => {
    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);
    if (digit && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    update(index, raw.slice(-1));
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        update(index, "");
      } else if (index > 0) {
        const newDigits = [...digits];
        newDigits[index - 1] = "";
        setDigits(newDigits);
        inputRefs.current[index - 1]?.focus();
      }
      e.preventDefault();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const newDigits = Array(6).fill("");
    pasted.split("").forEach((d, i) => { newDigits[i] = d; });
    setDigits(newDigits);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const boxClass = (index: number) => {
    const base =
      "w-11 h-14 text-center text-2xl font-bold border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300/40 bg-white transition-colors duration-300";
    if (isSuccess)
      return `${base} border-emerald-400 bg-emerald-50 text-emerald-700 shadow-[0_0_0_3px_rgba(52,211,153,0.18)]`;
    if (hasError && digits[index])
      return `${base} border-red-400 bg-red-50 text-red-700`;
    if (digits[index])
      return `${base} border-indigo-400 text-gray-900`;
    return `${base} border-gray-200 text-gray-900 focus:border-indigo-400`;
  };

  return (
    <m.form
      ref={formRef}
      action={action}
      className="space-y-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <input type="hidden" name="email" value={email} />
      <input type="hidden" name="code" value={code} />
      {redirectTo && <input type="hidden" name="redirectTo" value={redirectTo} />}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
          Code à 6 chiffres
        </label>
        <div className="flex gap-2 justify-center" onPaste={handlePaste}>
          {digits.map((digit, i) => (
            <m.input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={2}
              value={digit}
              autoFocus={i === 0}
              autoComplete={i === 0 ? "one-time-code" : "off"}
              onFocus={(e) => e.target.select()}
              onChange={(e) => handleChange(i, e)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={boxClass(i)}
              animate={isSuccess ? { scale: [1, 1.14, 0.94, 1] } : { scale: 1 }}
              transition={{
                delay: isSuccess ? i * 0.07 : 0,
                duration: 0.4,
                ease: [0.34, 1.56, 0.64, 1],
              }}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {hasError && (
          <m.p
            key="error"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2 text-center"
          >
            {state!.error}
          </m.p>
        )}
      </AnimatePresence>

      <m.button
        type="submit"
        disabled={pending}
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.01 }}
        animate={{
          backgroundColor: isSuccess ? "#10b981" : "#6366f1",
          boxShadow: isSuccess
            ? "0 2px 12px rgba(16,185,129,0.45)"
            : "0 2px 8px rgba(99,102,241,0.35)",
        }}
        transition={{ duration: 0.4 }}
        className="w-full disabled:opacity-60 text-white font-semibold py-3 rounded-xl text-sm"
      >
        {isSuccess ? "✓ Code validé !" : pending ? "Vérification…" : "Valider le code"}
      </m.button>
    </m.form>
  );
}
