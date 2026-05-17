import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { PageTransition } from "@/components/motion/PageTransition";

export default function HomePage() {
  return (
    <main className="hero-gradient min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated blobs */}
      <div className="pointer-events-none select-none absolute -top-20 -right-20 w-80 h-80 bg-orange-200/30 rounded-full blur-3xl animate-blob" />
      <div className="pointer-events-none select-none absolute -bottom-20 -left-16 w-64 h-64 bg-amber-200/20 rounded-full blur-2xl animate-blob animation-delay-2000" />
      <div className="pointer-events-none select-none absolute top-1/3 left-1/4 w-48 h-48 bg-orange-100/30 rounded-full blur-2xl animate-blob animation-delay-4000" />

      <PageTransition className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-3xl shadow-[0_8px_32px_rgba(232,93,4,0.25)] mb-4">
            🍽️
          </div>
          <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
            Bob
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
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
