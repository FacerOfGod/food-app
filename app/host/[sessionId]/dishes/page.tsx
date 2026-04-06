import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionDishes } from "@/actions/dishes";
import { DishManager } from "@/components/host/DishManager";
import { CopyButton } from "@/components/host/CopyButton";
import { logoutAction } from "@/actions/auth";

interface Props {
  params: Promise<{ sessionId: string }>;
}

export default async function DishesPage({ params }: Props) {
  const { sessionId } = await params;

  let data;
  try {
    data = await getSessionDishes(sessionId);
  } catch (e) {
    const msg = e instanceof Error ? `${e.message}\n${e.stack}` : String(e);
    return <pre style={{ padding: 24, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{msg}</pre>;
  }

  if (!data) redirect("/dashboard");

  const { session } = data;
  const origin =
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");
  const joinLink = `${origin}/join/${session.id}`;

  return (
    <main className="min-h-screen bg-[#fafaf9]">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <Link href="/dashboard" className="text-gray-400 hover:text-gray-600 text-sm flex-shrink-0">
          ← Retour
        </Link>
        <span className="text-gray-300">|</span>
        <span className="font-semibold text-gray-900 text-sm truncate flex-1">
          {session.name}
        </span>
        <form action={logoutAction}>
          <button type="submit" className="text-sm text-gray-400 hover:text-gray-600">
            Déco.
          </button>
        </form>
      </header>

      {/* Tab switcher */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 flex gap-1 pt-2 overflow-x-auto scrollbar-hide">
          <Link
            href={`/host/${session.id}`}
            className="px-4 py-2 text-sm font-medium rounded-t-lg transition-colors text-gray-500 hover:text-gray-700 whitespace-nowrap"
          >
            👤 Par personne
          </Link>
          <Link
            href={`/host/${session.id}?view=dishes`}
            className="px-4 py-2 text-sm font-medium rounded-t-lg transition-colors text-gray-500 hover:text-gray-700 whitespace-nowrap"
          >
            🍽️ Par plat
          </Link>
          <Link
            href={`/host/${session.id}/dishes`}
            className="px-4 py-2 text-sm font-medium rounded-t-lg transition-colors bg-orange-50 text-orange-600 border-b-2 border-orange-500 whitespace-nowrap"
          >
            ⚙️ Gestion des plats
          </Link>
          <Link
            href={`/vote/${session.id}`}
            className="px-4 py-2 text-sm font-medium rounded-t-lg transition-colors text-orange-600 hover:bg-orange-50 whitespace-nowrap flex items-center gap-1"
          >
            👉 Rejoindre
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Share link */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
          <p className="text-xs font-semibold text-orange-700 uppercase tracking-wide mb-2">
            Lien à partager
          </p>
          <p className="text-sm text-gray-700 font-mono break-all">{joinLink}</p>
          <CopyButton text={joinLink} />
        </div>

        <DishManager sessionId={session.id} dishes={session.dishes} />
      </div>
    </main>
  );
}
