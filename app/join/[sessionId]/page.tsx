import { Suspense } from "react";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { joinSessionAction } from "@/actions/votes";
import { LoginForm } from "@/components/auth/LoginForm";
import { PageTransition } from "@/components/motion/PageTransition";
import { isValidTopic } from "@/lib/topics";
import Link from "next/link";

interface Props {
  params: Promise<{ sessionId: string }>;
  searchParams: Promise<{ topic?: string }>;
}

export default async function JoinPage({ params, searchParams }: Props) {
  const { sessionId } = await params;
  const { topic: rawTopic } = await searchParams;
  const topic = isValidTopic(rawTopic) ? rawTopic : undefined;

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { host: { select: { name: true } } },
  });

  if (!session) {
    return (
      <main className="hero-gradient min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-14 h-14 mx-auto rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-2xl mb-4">
            🔍
          </div>
          <p className="text-gray-500 font-medium">Session introuvable.</p>
          <Link href="/" className="text-emerald-500 text-sm mt-3 block font-medium hover:text-emerald-600 transition-colors">
            Retour à l&apos;accueil
          </Link>
        </div>
      </main>
    );
  }

  const user = await getCurrentUser();
  if (user) {
    await joinSessionAction(sessionId, topic);
    const topicQS = topic ? `&topic=${topic}` : "";
    redirect(`/dashboard?view=vote&session=${sessionId}${topicQS}`);
  }

  const redirectTo = `/join/${sessionId}${topic ? `?topic=${topic}` : ""}`;

  return (
    <main className="hero-gradient min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated blobs */}
      <div className="pointer-events-none select-none absolute -top-20 -right-20 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl animate-blob" />
      <div className="pointer-events-none select-none absolute -bottom-20 -left-16 w-64 h-64 bg-teal-200/20 rounded-full blur-2xl animate-blob animation-delay-2000" />

      <PageTransition className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-3xl shadow-[0_8px_32px_rgba(16, 185, 129,0.25)] mb-4">
            🍽️
          </div>
          <h1 className="text-2xl font-black text-gray-900">
            Rejoindre le groupe
          </h1>
          <p className="text-gray-500 mt-2 text-sm leading-relaxed">
            <span className="font-semibold text-gray-700">{session.host.name ?? "L'hôte"}</span>
            {" "}vous invite à noter des plats pour{" "}
            <span className="font-semibold text-emerald-600">{session.name}</span>
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <p className="text-sm text-gray-500 mb-4">
            Entrez votre prénom et email pour commencer.
          </p>
          <Suspense>
            <LoginForm redirectTo={redirectTo} />
          </Suspense>
        </div>
      </PageTransition>
    </main>
  );
}
