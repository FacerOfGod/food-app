import { redirect } from "next/navigation";
import Link from "next/link";
import { getHostSessions } from "@/actions/sessions";
import { getVotingData } from "@/actions/votes";
import { getAllDishes, seedPresetDishesAction } from "@/actions/dishes";
import { CreateSessionForm } from "@/components/host/CreateSessionForm";
import { DeleteSessionButton } from "@/components/host/DeleteSessionButton";
import { DashboardTabBar } from "@/components/dashboard/DashboardTabBar";
import { VotingInterface } from "@/components/vote/VotingInterface";
import { GuestDishAdder } from "@/components/vote/GuestDishAdder";
import { logoutAction } from "@/actions/auth";
import { isAdminEmail } from "@/lib/admin";

interface Props {
  searchParams: Promise<{ view?: string }>;
}

export default async function DashboardPage({ searchParams }: Props) {
  const { view: rawView } = await searchParams;
  const view =
    rawView === "mes-choix" || rawView === "proposer" || rawView === "vote"
      ? rawView
      : "sessions";

  const data = await getHostSessions();
  if (!data) redirect("/");

  const { user, sessions, joinedSessions } = data;

  if (view === "proposer") {
    await seedPresetDishesAction();
  }

  const votingData =
    view === "mes-choix" || view === "vote" ? await getVotingData() : null;

  const allDishes = view === "proposer" ? await getAllDishes() : null;

  return (
    <main className="min-h-screen bg-[#fafaf9]">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🍽️</span>
          <span className="font-semibold text-gray-900">Bob</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{user.name}</span>
          {isAdminEmail(user.email) && (
            <Link href="/admin" className="text-sm text-orange-500 hover:text-orange-700 font-medium transition-colors">
              Admin
            </Link>
          )}
          <form action={logoutAction}>
            <button type="submit" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
              Déconnexion
            </button>
          </form>
        </div>
      </header>

      <DashboardTabBar />

      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* ── Mes sessions ── */}
        {view === "sessions" && (
          <>
            <div className="mb-6">
              <h1 className="text-xl font-bold text-gray-900 mb-1">Mes sessions</h1>
              <p className="text-sm text-gray-500">
                Créez une session et partagez le lien avec votre famille. 
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Nouvelle session</h2>
              <CreateSessionForm />
            </div>

            {sessions.length > 0 && (
              <div className="space-y-3 mb-8">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="relative flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4 hover:border-orange-300 transition-colors"
                  >
                    <Link href={`/host/${session.id}`} className="absolute inset-0 rounded-xl" />
                    <div className="pointer-events-none">
                      <p className="font-medium text-gray-900">{session.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {session._count.members} membre{session._count.members > 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="relative z-10 flex items-center gap-1">
                      <DeleteSessionButton sessionId={session.id} sessionName={session.name} />
                      <span className="text-gray-300 text-lg ml-1 pointer-events-none w-5 text-center">›</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {sessions.length === 0 && (
              <p className="text-center text-sm text-gray-400 mb-8 py-8">
                Aucune session pour l&apos;instant.
              </p>
            )}

            {joinedSessions.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Sessions rejointes</h2>
                <div className="space-y-3">
                  {joinedSessions.map((session) => (
                    <div
                      key={session.id}
                      className="relative flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4 hover:border-orange-300 transition-colors"
                    >
                      <Link href={`/host/${session.id}`} className="absolute inset-0 rounded-xl" />
                      <div className="pointer-events-none">
                        <p className="font-medium text-gray-900">{session.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {session._count.members} membre{session._count.members > 1 ? "s" : ""}
                        </p>
                      </div>
                      <div className="relative z-10 flex items-center gap-1">
                        <span className="text-gray-300 text-lg ml-1 pointer-events-none w-5 text-center">›</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* ── Mes choix ── */}
        {view === "mes-choix" && (
          <div className="mb-3">
            <h1 className="text-xl font-bold text-gray-900 mb-1">Mes choix</h1>
            <p className="text-sm text-gray-500">Retrouve tous les plats et modifie tes votes à tout moment.</p>
          </div>
        )}
        {view === "mes-choix" && votingData && (
          votingData.totalDishes === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🍽️</div>
              <p className="text-gray-500 text-sm">Aucun plat pour l&apos;instant.</p>
            </div>
          ) : (
            <VotingInterface
              nextDish={votingData.nextDish}
              dishes={votingData.dishes}
              userVotes={votingData.userVotes}
              votedCount={votingData.votedCount}
              totalDishes={votingData.totalDishes}
              userName={votingData.user.name ?? ""}
              viewMode="mes-choix"
            />
          )
        )}

        {/* ── Proposer ── */}
        {view === "proposer" && (
          <div className="mb-3">
            <h1 className="text-xl font-bold text-gray-900 mb-1">Proposer un plat</h1>
            <p className="text-sm text-gray-500">Suggère un nouveau plat à ajouter au catalogue partagé. Faites la recherche, si ca n'existe pas ajouter.</p>
          </div>
        )}
        {view === "proposer" && (
          <GuestDishAdder
            existingDishes={(allDishes ?? []).map((d) => ({
              id: d.id,
              name: d.name,
              imageUrl: d.imageUrl,
              authorsJson: d.authorsJson,
            }))}
          />
        )}

        {/* ── Voter ── */}
        {view === "vote" && (
          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-900 mb-1">Voter</h1>
            <p className="text-sm text-gray-500">Note chaque plat pour aider à choisir le repas idéal.</p>
          </div>
        )}
        {view === "vote" && votingData && (
          votingData.totalDishes === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🍽️</div>
              <p className="text-gray-500 text-sm">Aucun plat pour l&apos;instant.</p>
            </div>
          ) : (
            <VotingInterface
              nextDish={votingData.nextDish}
              dishes={votingData.dishes}
              userVotes={votingData.userVotes}
              votedCount={votingData.votedCount}
              totalDishes={votingData.totalDishes}
              userName={votingData.user.name ?? ""}
              viewMode="vote"
            />
          )
        )}

      </div>
    </main>
  );
}
