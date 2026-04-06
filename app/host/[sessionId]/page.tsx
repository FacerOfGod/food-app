import { redirect } from "next/navigation";
import Link from "next/link";
import { getPeopleResults, getDishResults, getVotingData } from "@/actions/votes";
import { PeopleView } from "@/components/host/PeopleView";
import { DishesView } from "@/components/host/DishesView";
import { VotingInterface } from "@/components/vote/VotingInterface";
import { logoutAction } from "@/actions/auth";

interface Props {
  params: Promise<{ sessionId: string }>;
  searchParams: Promise<{ view?: string }>;
}

export default async function HostDashboardPage({ params, searchParams }: Props) {
  const { sessionId } = await params;
  const { view } = await searchParams;
  const activeView = view === "dishes" ? "dishes"
                   : view === "people" ? "people"
                   : view === "mes-choix" ? "mes-choix"
                   : "vote"; // default to vote

  const [peopleData, dishData, votingData] = await Promise.all([
    getPeopleResults(sessionId),
    getDishResults(sessionId),
    getVotingData(sessionId),
  ]);

  if (!peopleData || !dishData || !votingData) redirect("/dashboard");

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
              href={`/host/${sessionId}?view=vote`}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeView === "vote"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Voter
            </Link>
            <Link
              href={`/host/${sessionId}?view=mes-choix`}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeView === "mes-choix"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Mes choix
            </Link>
            <Link
              href={`/host/${sessionId}?view=people`}
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
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto py-6">
        {activeView === "vote" || activeView === "mes-choix" ? (
          votingData.totalDishes === 0 ? (
            <div className="text-center px-4">
              <div className="text-5xl mb-4">🍽️</div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">
                Aucun plat pour l&apos;instant
              </h1>
              <p className="text-gray-500 text-sm">
                L&apos;hôte n&apos;a pas encore ajouté de plats. Revenez plus tard !
              </p>
            </div>
          ) : (
            <VotingInterface
              sessionId={sessionId}
              nextDish={votingData.nextDish}
              dishes={votingData.dishes}
              userVotes={votingData.userVotes}
              votedCount={votingData.votedCount}
              totalDishes={votingData.totalDishes}
              userName={votingData.user.name ?? ""}
              viewMode={activeView}
            />
          )
        ) : activeView === "people" ? (
          <div className="px-4">
            <PeopleView members={peopleData.members} dishes={peopleData.dishes} />
          </div>
        ) : (
          <div className="px-4">
            <DishesView dishStats={dishData.dishStats} />
          </div>
        )}
      </div>
    </main>
  );
}
