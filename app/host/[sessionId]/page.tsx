import { redirect } from "next/navigation";
import Link from "next/link";
import { getPeopleResults, getDishResults, getVotingData } from "@/actions/votes";
import { PeopleView } from "@/components/host/PeopleView";
import { DishesView } from "@/components/host/DishesView";
import { VotingInterface } from "@/components/vote/VotingInterface";
import { GuestDishAdder } from "@/components/vote/GuestDishAdder";
import { CopyButton } from "@/components/host/CopyButton";
import { TabBar } from "@/components/host/TabBar";
import { logoutAction } from "@/actions/auth";
import { seedPresetDishesAction } from "@/actions/dishes";

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
                   : view === "proposer" ? "proposer"
                   : "vote"; // default to vote

  const [peopleData, dishData, votingData] = await Promise.all([
    getPeopleResults(sessionId),
    getDishResults(sessionId),
    getVotingData(sessionId),
  ]);

  if (!peopleData || !dishData || !votingData) redirect("/dashboard");

  if (activeView === "proposer") await seedPresetDishesAction(sessionId);

  const { session, currentUser } = peopleData;
  const isHost = session.hostId === currentUser.id;
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  const joinLink = `${origin}/join/${session.id}`;

  return (
    <main className="min-h-screen bg-[#fafaf9]">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Link href="/dashboard" className="text-gray-400 hover:text-gray-600 text-sm flex-shrink-0">
            ←
          </Link>
          <span className="text-gray-300">|</span>
          <span className="font-semibold text-gray-900 text-sm truncate">
            {session.name}
          </span>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <CopyButton text={joinLink} compact />
          <form action={logoutAction}>
            <button type="submit" className="text-sm text-gray-400 hover:text-gray-600">
              Déco.
            </button>
          </form>
        </div>
      </header>

      <TabBar sessionId={sessionId} isHost={isHost} />

      <div className="max-w-3xl mx-auto px-4">
        {activeView !== "vote" && (
          <div className="pt-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-500 flex items-start gap-2">
              <span className="flex-shrink-0 w-4 h-4 rounded-full border border-gray-400 text-gray-400 text-[10px] font-bold flex items-center justify-center mt-0.5">i</span>
              <span>
                {activeView === "mes-choix" && "Retrouve tous les plats et modifie tes votes à tout moment."}
                {activeView === "people" && "Voir qui a rejoint la session et combien de plats chacun a votés."}
                {activeView === "dishes" && "Classement des plats selon les votes de tous les participants."}
                {activeView === "proposer" && "Suggère un nouveau plat à ajouter à la session. Faire la recherche, et ajouter si l'aliment n'existe pas."}
              </span>
            </div>
          </div>
        )}

        {activeView === "vote" || activeView === "mes-choix" ? (
          votingData.totalDishes === 0 ? (
            <div className="text-center py-4">
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
          <div className="py-4"><PeopleView members={peopleData.members} dishes={peopleData.dishes} /></div>
        ) : activeView === "proposer" ? (
          <GuestDishAdder
            sessionId={sessionId}
            existingDishes={votingData.dishes.map(d => ({ id: d.id, name: d.name, imageUrl: d.imageUrl, authorsJson: d.authorsJson }))}
          />
        ) : (
          <div className="py-4"><DishesView dishStats={dishData.dishStats} /></div>
        )}
      </div>
    </main>
  );
}
