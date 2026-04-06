import { redirect } from "next/navigation";
import Link from "next/link";
import { getHostSessions } from "@/actions/sessions";
import { CreateSessionForm } from "@/components/host/CreateSessionForm";
import { DeleteSessionButton } from "@/components/host/DeleteSessionButton";
import { logoutAction } from "@/actions/auth";

export default async function DashboardPage() {
  const data = await getHostSessions();
  if (!data) redirect("/");

  const { user, sessions, joinedSessions } = data;

  return (
    <main className="min-h-screen bg-[#fafaf9]">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🍽️</span>
          <span className="font-semibold text-gray-900">Bob</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{user.name}</span>
          <form action={logoutAction}>
            <button type="submit" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
              Déconnexion
            </button>
          </form>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-gray-900 mb-1">Mes sessions</h1>
          <p className="text-sm text-gray-500">
            Créez une session et partagez le lien avec votre famille.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">
            Nouvelle session
          </h2>
          <CreateSessionForm />
        </div>

        {sessions.length > 0 && (
          <div className="space-y-3 mb-8">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="relative flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4 hover:border-orange-300 transition-colors"
              >
                <Link
                  href={`/host/${session.id}`}
                  className="absolute inset-0 rounded-xl"
                />
                <div className="pointer-events-none">
                  <p className="font-medium text-gray-900">{session.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {session._count.members} membre{session._count.members > 1 ? "s" : ""} ·{" "}
                    {session._count.dishes} plat{session._count.dishes > 1 ? "s" : ""}
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
                  <Link
                    href={`/host/${session.id}?view=vote`}
                    className="absolute inset-0 rounded-xl"
                  />
                  <div className="pointer-events-none">
                    <p className="font-medium text-gray-900">{session.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {session._count.members} membre{session._count.members > 1 ? "s" : ""} ·{" "}
                      {session._count.dishes} plat{session._count.dishes > 1 ? "s" : ""}
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
      </div>
    </main>
  );
}
