import { OtpForm } from "@/components/auth/OtpForm";
import { PageTransition } from "@/components/motion/PageTransition";

interface Props {
  searchParams: Promise<{ email?: string; redirectTo?: string }>;
}

export default async function VerifyPage({ searchParams }: Props) {
  const { email, redirectTo } = await searchParams;

  if (!email) {
    return (
      <main className="hero-gradient min-h-screen flex items-center justify-center p-4">
        <p className="text-gray-500">
          Lien invalide.{" "}
          <a href="/" className="text-orange-500 underline">
            Recommencer
          </a>
        </p>
      </main>
    );
  }

  return (
    <main className="hero-gradient min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated blobs */}
      <div className="pointer-events-none select-none absolute -top-20 -right-20 w-80 h-80 bg-orange-200/30 rounded-full blur-3xl animate-blob" />
      <div className="pointer-events-none select-none absolute -bottom-20 -left-16 w-64 h-64 bg-amber-200/20 rounded-full blur-2xl animate-blob animation-delay-2000" />

      <PageTransition className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="mx-auto w-14 h-14 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-2xl mb-4">
            📧
          </div>
          <h1 className="text-xl font-bold text-gray-900">Vérifiez vos emails</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Nous avons envoyé un code à{" "}
            <span className="font-semibold text-gray-700">{email}</span>
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <OtpForm email={email} redirectTo={redirectTo} />
        </div>

        <p className="text-center mt-4 text-xs text-gray-400">
          Pas reçu ?{" "}
          <a
            href={`/?${redirectTo ? `redirectTo=${redirectTo}` : ""}`}
            className="text-orange-500 underline font-medium hover:text-orange-600 transition-colors"
          >
            Renvoyer le code
          </a>
        </p>
      </PageTransition>
    </main>
  );
}
