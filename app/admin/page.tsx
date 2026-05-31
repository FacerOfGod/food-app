import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { isAdminEmail } from "@/lib/admin";
import { getUsers, deleteUserAction, banUserAction, unbanUserAction } from "@/actions/admin";
import { BackfillButton } from "@/components/admin/BackfillButton";
import { ResetFoodButton } from "@/components/admin/ResetFoodButton";
import { SyncActivitiesButton } from "@/components/admin/SyncActivitiesButton";
import { logoutAction } from "@/actions/auth";
import Link from "next/link";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user || !isAdminEmail(user.email)) redirect("/dashboard");

  const users = await getUsers();

  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-[0_1px_0_#e4e4e7] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-lg shadow-sm">
            🍽️
          </div>
          <span className="font-black text-gray-900 text-xl">Bob</span>
          <span className="text-gray-300 text-sm">—</span>
          <span className="text-sm font-semibold text-gray-500">Admin</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
            Dashboard
          </Link>
          <form action={logoutAction}>
            <button type="submit" className="text-sm text-gray-500 hover:text-gray-600 transition-colors">
              Déconnexion
            </button>
          </form>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Mise à jour des catalogues</h2>
          <p className="text-sm text-gray-500 mb-3">Remplace les images placeholder par les vraies photos.</p>
          <div className="flex flex-wrap gap-3">
            <ResetFoodButton />
            <BackfillButton />
            <SyncActivitiesButton />
          </div>
        </div>

        <h1 className="text-2xl font-black text-gray-900 mb-1">Gestion des utilisateurs</h1>
        <p className="text-sm text-gray-500 mb-6">{users.length} utilisateur{users.length > 1 ? "s" : ""}</p>

        <div className="space-y-2">
          {users.map((u) => (
            <div
              key={u.id}
              className={`flex items-center justify-between rounded-2xl border px-4 py-3 transition-all ${
                u.isBanned
                  ? "border-red-200 bg-red-50/70 backdrop-blur-sm"
                  : "bg-white border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)]"
              }`}
            >
              <div>
                <p className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                  {u.name ?? <span className="text-gray-500 italic font-normal">Sans nom</span>}
                  {u.id === user.id && (
                    <span className="text-xs text-indigo-500 font-normal">(vous)</span>
                  )}
                  {u.isBanned && (
                    <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-medium">Banni</span>
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{u.email}</p>
              </div>

              {u.id !== user.id && (
                <div className="flex items-center gap-2">
                  {u.isBanned ? (
                    <form action={async () => { "use server"; await unbanUserAction(u.id); }}>
                      <button type="submit" className="text-xs px-3 py-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors font-medium">
                        Débannir
                      </button>
                    </form>
                  ) : (
                    <form action={async () => { "use server"; await banUserAction(u.id); }}>
                      <button type="submit" className="text-xs px-3 py-1.5 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition-colors font-medium">
                        Bannir
                      </button>
                    </form>
                  )}
                  <form action={async () => { "use server"; await deleteUserAction(u.id); }}>
                    <button type="submit" className="text-xs px-3 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors font-medium">
                      Supprimer
                    </button>
                  </form>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
