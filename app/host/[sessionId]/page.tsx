import { redirect } from "next/navigation";
import Link from "next/link";
import { getPeopleResults, getDishResults } from "@/actions/votes";
import { PeopleView } from "@/components/host/PeopleView";
import { DishesView } from "@/components/host/DishesView";
import { logoutAction } from "@/actions/auth";

interface Props {
  params: Promise<{ sessionId: string }>;
  searchParams: Promise<{ view?: string }>;
}

export default async function HostDashboardPage({ params, searchParams }: Props) {
  const { sessionId } = await params;
  const { view } = await searchParams;
  const activeView = view === "dishes" ? "dishes" : "people";

  const [peopleData, dishData] = await Promise.all([
    getPeopleResults(sessionId),
    getDishResults(sessionId),
  ]);

  if (!peopleData || !dishData) redirect("/dashboard");

  const { session, currentUser } = peopleData;
  const isHost = session.hostId === currentUser.id;

  return (
    <main className="min-h-screen bg-[#fafaf9]">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <Link href="/dashboard" className="text-gray-400 hover:text-gray-600 text-sm">
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
              href={`/host/${sessionId}`}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeView === "people"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Par personne
            </Link>
            <Link
              href={`/host/${sessionId}?view=dishes`}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeView === "dishes"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Par plat
            </Link>
            {isHost && (
              <Link
                href={`/host/${sessionId}/dishes`}
                className="px-3 py-1.5 text-xs font-medium rounded-md transition-colors text-gray-500 hover:text-gray-700"
              >
                Gestion des plats
              </Link>
            )}
            <Link
              href={`/vote/${sessionId}`}
              className="px-3 py-1.5 text-xs font-medium rounded-md transition-colors text-gray-500 hover:text-gray-700"
            >
              Voter
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {activeView === "people" ? (
          <PeopleView members={peopleData.members} dishes={peopleData.dishes} />
        ) : (
          <DishesView dishStats={dishData.dishStats} />
        )}
      </div>
    </main>
  );
}
