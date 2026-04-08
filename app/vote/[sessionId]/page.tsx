import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ sessionId: string }>;
}

export default async function VotePage({ params }: Props) {
  const { sessionId } = await params;
  redirect(`/dashboard?view=vote&session=${sessionId}`);
}
