import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { safeRedirectPath } from "@/lib/redirects";
import { NameForm } from "@/components/auth/NameForm";
import { PageTransition } from "@/components/motion/PageTransition";
import { BobLogo } from "@/components/brand/BobLogo";

interface Props {
  searchParams: Promise<{ redirectTo?: string }>;
}

export default async function NamePage({ searchParams }: Props) {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  const { redirectTo: rawRedirect } = await searchParams;
  const redirectTo = safeRedirectPath(rawRedirect ?? null, "/dashboard");

  if (user.name?.trim()) redirect(redirectTo);

  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="pointer-events-none select-none absolute -top-20 -right-20 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl animate-blob" />
      <div className="pointer-events-none select-none absolute -bottom-20 -left-16 w-64 h-64 bg-teal-200/20 rounded-full blur-2xl animate-blob animation-delay-2000" />

      <PageTransition className="w-full max-w-sm">
        <div className="text-center mb-8 flex flex-col items-center">
          <BobLogo size={72} compact />
          <h1 className="text-xl font-bold text-gray-900 mt-4">Comment vous appelez-vous ?</h1>
          <p className="text-gray-500 mt-1 text-sm">Votre prénom sera visible par les autres membres du groupe.</p>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <NameForm redirectTo={redirectTo} />
        </div>
      </PageTransition>
    </main>
  );
}
