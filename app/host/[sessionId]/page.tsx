export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import Link from "next/link";
import { getPeopleResults, getDishResults } from "@/actions/votes";
import { getSessionPartageData } from "@/actions/sessions";
import { PeopleView } from "@/components/host/PeopleView";
import { DishesView } from "@/components/host/DishesView";
import { PartageView } from "@/components/host/PartageView";
import { CopyButton } from "@/components/host/CopyButton";
import { TabBar } from "@/components/host/TabBar";
import { TopicTabBar } from "@/components/ui/TopicTabBar";
import { logoutAction } from "@/actions/auth";
import { type TopicKey } from "@/lib/presets";

interface Props {
  params: Promise<{ sessionId: string }>;
  searchParams: Promise<{ view?: string; topic?: string }>;
}

const VALID_TOPICS: TopicKey[] = ["ingredients", "movies", "activities"];

export default async function HostDashboardPage({ params, searchParams }: Props) {
  const { sessionId } = await params;
  const { view, topic: rawTopic } = await searchParams;
  const activeView =
    view === "dishes" ? "dishes" : view === "partage" ? "partage" : "people";
  const topic: TopicKey = VALID_TOPICS.includes(rawTopic as TopicKey)
    ? (rawTopic as TopicKey)
    : "ingredients";

  const [peopleData, dishData, partageData] = await Promise.all([
    activeView === "people" ? getPeopleResults(sessionId, topic) : null,
    activeView === "dishes" ? getDishResults(sessionId, topic) : null,
    activeView === "partage" ? getSessionPartageData(sessionId) : null,
  ]);

  const session =
    peopleData?.session ?? dishData?.session ?? (partageData ? { id: partageData.id, name: partageData.name } : null);

  if (!session) redirect("/dashboard");

  const origin =
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ??
    (process.env.NODE_ENV === "production" ? "" : "http://localhost:3000");
  const joinLink = `${origin}/join/${session.id}`;

  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-[0_1px_0_#e4e4e7] px-4 py-3 flex items-center">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Link href="/dashboard" className="text-gray-500 hover:text-gray-600 text-sm flex-shrink-0">
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
            <button type="submit" className="text-sm text-gray-500 hover:text-gray-600">
              Déco.
            </button>
          </form>
        </div>
      </header>

      <TabBar sessionId={sessionId} />

      <div className="max-w-3xl mx-auto px-4">
        <div className="pt-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-500 flex items-start gap-2 mb-4">
            <span className="flex-shrink-0 w-4 h-4 rounded-full border border-gray-400 text-gray-500 text-[10px] font-bold flex items-center justify-center mt-0.5">i</span>
            <span>
              {activeView === "people" && "Voir qui a rejoint le groupe et combien d'éléments chacun a votés."}
              {activeView === "dishes" && "Classement par thème selon les votes de tous les participants."}
              {activeView === "partage" && "Choisis les thèmes du groupe et ce que tu partages personnellement."}
            </span>
          </div>

          {activeView !== "partage" && <TopicTabBar currentTopic={topic} />}
        </div>

        {activeView === "people" && peopleData && (
          <div className="py-4">
            <PeopleView members={peopleData.members} dishes={peopleData.dishes} />
          </div>
        )}
        {activeView === "dishes" && dishData && (
          <div className="py-4">
            <DishesView dishStats={dishData.dishStats} />
          </div>
        )}
        {activeView === "partage" && partageData && (
          <div className="py-4">
            <PartageView session={partageData} />
          </div>
        )}
      </div>
    </main>
  );
}
