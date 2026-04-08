import { Suspense } from "react";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { joinSessionAction } from "@/actions/votes";
import { LoginForm } from "@/components/auth/LoginForm";
import Link from "next/link";

interface Props {
  params: Promise<{ sessionId: string }>;
}

export default async function JoinPage({ params }: Props) {
  const { sessionId } = await params;

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { host: { select: { name: true } } },
  });

  if (!session) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-500">Session introuvable.</p>
          <Link href="/" className="text-orange-500 underline text-sm mt-2 block">
            Retour à l&apos;accueil
          </Link>
        </div>
      </main>
    );
  }

  // If user is already logged in, add them to session and redirect to vote
  const user = await getCurrentUser();
  if (user) {
    await joinSessionAction(sessionId);
    redirect(`/dashboard?view=vote&session=${sessionId}`);
  }

  const redirectTo = `/join/${sessionId}`;

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#fafaf9] p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🍽️</div>
          <h1 className="text-xl font-bold text-gray-900">
            Rejoindre la session
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            <span className="font-medium text-gray-700">{session.host.name ?? "L'hôte"}</span>
            {" "}vous invite à noter des plats pour{" "}
            <span className="font-medium text-orange-600">{session.name}</span>
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500 mb-4">
            Entrez votre prénom et email pour commencer.
          </p>
          <Suspense>
            <LoginForm redirectTo={redirectTo} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
