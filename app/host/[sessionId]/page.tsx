import { redirect } from "next/navigation";
import Link from "next/link";
import { getPeopleResults, getDishResults } from "@/actions/votes";
import { PeopleView } from "@/components/host/PeopleView";
import { DishesView } from "@/components/host/DishesView";
import { CopyButton } from "@/components/host/CopyButton";
import { TabBar } from "@/components/host/TabBar";
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

  const { session } = peopleData;
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

      <TabBar sessionId={sessionId} />

      <div className="max-w-3xl mx-auto px-4">
        <div className="pt-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-500 flex items-start gap-2">
            <span className="flex-shrink-0 w-4 h-4 rounded-full border border-gray-400 text-gray-400 text-[10px] font-bold flex items-center justify-center mt-0.5">i</span>
            <span>
              {activeView === "people" && "Voir qui a rejoint la session et combien de plats chacun a votés."}
              {activeView === "dishes" && "Classement des plats selon les votes de tous les participants."}
            </span>
          </div>
        </div>

        {activeView === "people" ? (
          <div className="py-4">
            <PeopleView members={peopleData.members} dishes={peopleData.dishes} />
          </div>
        ) : (
          <div className="py-4">
            <DishesView dishStats={dishData.dishStats} />
          </div>
        )}
      </div>
    </main>
  );
}
