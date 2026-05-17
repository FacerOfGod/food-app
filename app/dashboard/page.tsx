import { redirect } from "next/navigation";
import Link from "next/link";
import { getHostSessions } from "@/actions/sessions";
import { getVotingData } from "@/actions/votes";
import { getAllDishes, seedPresetDishesAction } from "@/actions/dishes";
import { DashboardTabBar } from "@/components/dashboard/DashboardTabBar";
import { SessionList } from "@/components/dashboard/SessionList";
import { VotingInterface } from "@/components/vote/VotingInterface";
import { GuestDishAdder } from "@/components/vote/GuestDishAdder";
import { TopicTabBar } from "@/components/ui/TopicTabBar";
import { logoutAction } from "@/actions/auth";
import { isAdminEmail } from "@/lib/admin";
import { TOPIC_CONFIG, type TopicKey } from "@/lib/presets";

interface Props {
  searchParams: Promise<{ view?: string; topic?: string }>;
}

const VALID_TOPICS: TopicKey[] = ["food", "movies", "activities"];

export default async function DashboardPage({ searchParams }: Props) {
  const { view: rawView, topic: rawTopic } = await searchParams;
  const view =
    rawView === "mes-choix" || rawView === "proposer" || rawView === "vote"
      ? rawView
      : "sessions";
  const topic: TopicKey = VALID_TOPICS.includes(rawTopic as TopicKey)
    ? (rawTopic as TopicKey)
    : "food";

  const data = await getHostSessions();
  if (!data) redirect("/");

  const { user, sessions, joinedSessions } = data;

  if (view === "proposer") {
    await seedPresetDishesAction(topic);
  }

  const votingData =
    view === "mes-choix" || view === "vote" ? await getVotingData(topic) : null;

  const allDishes = view === "proposer" ? await getAllDishes(topic) : null;

  const topicCfg = TOPIC_CONFIG[topic];

  return (
    <main className="min-h-screen bg-[#fafaf9]">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-[0_1px_0_#e4e4e7] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-lg shadow-sm">
            🍽️
          </div>
          <span className="font-black text-gray-900 text-xl">Bob</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{user.name}</span>
          {isAdminEmail(user.email) && (
            <Link
              href="/admin"
              className="text-sm text-orange-500 hover:text-orange-700 font-medium transition-colors"
            >
              Admin
            </Link>
          )}
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Déconnexion
            </button>
          </form>
        </div>
      </header>

      <DashboardTabBar />

      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* ── Mes groupes ── */}
        {view === "sessions" && (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-black text-gray-900 mb-1">Mes groupes</h1>
              <p className="text-sm text-gray-500">
                Créez un groupe et partagez le lien avec votre famille.
              </p>
            </div>
            <SessionList sessions={sessions} joinedSessions={joinedSessions} />
          </>
        )}

        {/* ── Mes choix ── */}
        {view === "mes-choix" && (
          <>
            <div className="mb-4">
              <h1 className="text-2xl font-black text-gray-900 mb-1">{topicCfg.choixTitle}</h1>
              <p className="text-sm text-gray-500">{topicCfg.choixDesc}</p>
            </div>
            <TopicTabBar currentTopic={topic} />
          </>
        )}
        {view === "mes-choix" && votingData && (
          votingData.totalDishes === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-3xl mb-4">
                {topicCfg.emoji}
              </div>
              <p className="text-gray-500 text-sm">
                Aucun{topicCfg.itemLabelFem ? "e" : ""} {topicCfg.itemLabel} pour l&apos;instant.
              </p>
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
              topic={topic}
            />
          )
        )}

        {/* ── Proposer ── */}
        {view === "proposer" && (
          <>
            <div className="mb-4">
              <h1 className="text-2xl font-black text-gray-900 mb-1">{topicCfg.proposerTitle}</h1>
              <p className="text-sm text-gray-500">{topicCfg.proposerDesc}</p>
            </div>
            <TopicTabBar currentTopic={topic} />
          </>
        )}
        {view === "proposer" && (
          <GuestDishAdder
            topic={topic}
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
          <>
            <div className="mb-4">
              <h1 className="text-2xl font-black text-gray-900 mb-1">{topicCfg.voteTitle}</h1>
              <p className="text-sm text-gray-500">{topicCfg.voteDesc}</p>
            </div>
            <TopicTabBar currentTopic={topic} />
          </>
        )}
        {view === "vote" && votingData && (
          votingData.totalDishes === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-3xl mb-4">
                {topicCfg.emoji}
              </div>
              <p className="text-gray-500 text-sm">
                Aucun{topicCfg.itemLabelFem ? "e" : ""} {topicCfg.itemLabel} pour l&apos;instant.
              </p>
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
              topic={topic}
            />
          )
        )}

      </div>
    </main>
  );
}
