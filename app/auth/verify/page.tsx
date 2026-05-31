import { Mail } from "lucide-react";
import { OtpForm } from "@/components/auth/OtpForm";
import { ResendCodeButton } from "@/components/auth/ResendCodeButton";
import { PageTransition } from "@/components/motion/PageTransition";

interface Props {
  searchParams: Promise<{ email?: string; code?: string; redirectTo?: string }>;
}

export default async function VerifyPage({ searchParams }: Props) {
  const { email, code, redirectTo } = await searchParams;

  if (!email) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <p className="text-gray-500">
          Lien invalide.{" "}
          <a href="/" className="text-indigo-500 underline">
            Recommencer
          </a>
        </p>
      </main>
    );
  }

  return (
    <main className="h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated blobs */}
      <div className="pointer-events-none select-none absolute -top-20 -right-20 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl animate-blob" />
      <div className="pointer-events-none select-none absolute -bottom-20 -left-16 w-64 h-64 bg-sky-200/20 rounded-full blur-2xl animate-blob animation-delay-2000" />

      <PageTransition className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Mail size={48} strokeWidth={1.75} className="mx-auto text-indigo-600 mb-4" />
          <h1 className="text-xl font-bold text-gray-900">Vérifiez vos emails</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Nous avons envoyé un code à{" "}
            <span className="font-semibold text-gray-700">{email}</span>
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <OtpForm email={email} redirectTo={redirectTo} initialCode={code} />
        </div>

        <ResendCodeButton email={email} redirectTo={redirectTo} />
      </PageTransition>
    </main>
  );
}
