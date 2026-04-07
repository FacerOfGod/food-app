import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionDishes } from "@/actions/dishes";
import { DishManager } from "@/components/host/DishManager";
import { CopyButton } from "@/components/host/CopyButton";
import { GuestDishAdder } from "@/components/vote/GuestDishAdder";
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
      <div className="bg-white border-b border-gray-200 py-3">
        <div className="max-w-3xl mx-auto px-4 overflow-x-auto scrollbar-hide">
          <div className="flex bg-gray-100 rounded-lg p-1 flex-shrink-0 min-w-max">

            <Link
              href={`/host/${session.id}?view=mes-choix`}
              className="px-3 py-1.5 text-xs font-medium rounded-md transition-colors text-gray-500 hover:text-gray-700"
            >
              Mes choix
            </Link>
            <Link
              href={`/host/${session.id}?view=people`}
              className="px-3 py-1.5 text-xs font-medium rounded-md transition-colors text-gray-500 hover:text-gray-700"
            >
              Par personne
            </Link>
            <Link
              href={`/host/${session.id}?view=dishes`}
              className="px-3 py-1.5 text-xs font-medium rounded-md transition-colors text-gray-500 hover:text-gray-700"
            >
              Par plat
            </Link>
            <Link
              href={`/host/${session.id}/dishes`}
              className="px-3 py-1.5 text-xs font-medium rounded-md transition-colors bg-white text-gray-900 shadow-sm"
            >
              Gestion des plats
            </Link>
            <Link
              href={`/host/${session.id}?view=vote`}
              className="px-4 py-1.5 text-xs font-medium rounded-md transition-colors bg-orange-500 text-white shadow-sm ml-2 hover:bg-orange-600"
            >
              Voter
            </Link>
            <GuestDishAdder sessionId={session.id} existingDishNames={session.dishes.map(d=>d.name)} />
          </div>
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
