import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🍽️</div>
          <h1 className="text-2xl font-bold text-gray-900">Bob</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Partagez vos préférences alimentaires
          </p>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
