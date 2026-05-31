import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { PageTransition } from "@/components/motion/PageTransition";
import { BobLogo } from "@/components/brand/BobLogo";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated blobs */}
      <div className="pointer-events-none select-none absolute -top-20 -right-20 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl animate-blob" />
      <div className="pointer-events-none select-none absolute -bottom-20 -left-16 w-64 h-64 bg-teal-200/20 rounded-full blur-2xl animate-blob animation-delay-2000" />
      <div className="pointer-events-none select-none absolute top-1/3 left-1/4 w-48 h-48 bg-emerald-100/30 rounded-full blur-2xl animate-blob animation-delay-4000" />

      <PageTransition className="w-full max-w-sm">
        <div className="text-center mb-8 flex flex-col items-center">
          <BobLogo size={104} />
          <p className="text-gray-500 mt-2 text-sm">
            Partagez vos préférences alimentaires
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </PageTransition>
    </main>
  );
}
