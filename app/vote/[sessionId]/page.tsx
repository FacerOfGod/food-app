import { redirect } from "next/navigation";
import { getVotingData } from "@/actions/votes";
import { VotingInterface } from "@/components/vote/VotingInterface";

interface Props {
  params: Promise<{ sessionId: string }>;
}

export default async function VotePage({ params }: Props) {
  const { sessionId } = await params;
  const data = await getVotingData(sessionId);

  if (!data) redirect(`/join/${sessionId}`);
  if (data.totalDishes === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#fafaf9] p-4">
        <div className="text-center">
          <div className="text-5xl mb-4">🍽️</div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Aucun plat pour l&apos;instant
          </h1>
          <p className="text-gray-500 text-sm">
            L&apos;hôte n&apos;a pas encore ajouté de plats. Revenez plus tard !
          </p>
        </div>
      </main>
    );
  }

  return (
    <VotingInterface
      sessionId={sessionId}
      nextDish={data.nextDish}
      dishes={data.dishes}
      userVotes={data.userVotes}
      votedCount={data.votedCount}
      totalDishes={data.totalDishes}
      userName={data.user.name ?? ""}
    />
  );
}
