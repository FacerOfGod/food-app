import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { isAdminEmail } from "@/lib/admin";
import { getUsers, deleteUserAction, banUserAction, unbanUserAction } from "@/actions/admin";
import { logoutAction } from "@/actions/auth";
import Link from "next/link";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user || !isAdminEmail(user.email)) redirect("/dashboard");

  const users = await getUsers();

  return (
    <main className="min-h-screen bg-[#fafaf9]">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🍽️</span>
          <span className="font-semibold text-gray-900">Bob — Admin</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
            Tableau de bord
          </Link>
          <form action={logoutAction}>
            <button type="submit" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
              Déconnexion
            </button>
          </form>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Gestion des utilisateurs</h1>
        <p className="text-sm text-gray-500 mb-6">{users.length} utilisateur{users.length > 1 ? "s" : ""}</p>

        <div className="space-y-2">
          {users.map((u) => (
            <div
              key={u.id}
              className={`flex items-center justify-between bg-white rounded-xl border px-4 py-3 ${
                u.isBanned ? "border-red-200 bg-red-50" : "border-gray-200"
              }`}
            >
              <div>
                <p className="font-medium text-gray-900 text-sm">
                  {u.name ?? <span className="text-gray-400 italic">Sans nom</span>}
                  {u.id === user.id && (
                    <span className="ml-2 text-xs text-orange-500 font-normal">(vous)</span>
                  )}
                  {u.isBanned && (
                    <span className="ml-2 text-xs text-red-500 font-normal">Banni</span>
                  )}
                </p>
                <p className="text-xs text-gray-400">{u.email}</p>
              </div>

              {u.id !== user.id && (
                <div className="flex items-center gap-2">
                  {u.isBanned ? (
                    <form
                      action={async () => {
                        "use server";
                        await unbanUserAction(u.id);
                      }}
                    >
                      <button
                        type="submit"
                        className="text-xs px-3 py-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                      >
                        Débannir
                      </button>
                    </form>
                  ) : (
                    <form
                      action={async () => {
                        "use server";
                        await banUserAction(u.id);
                      }}
                    >
                      <button
                        type="submit"
                        className="text-xs px-3 py-1.5 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition-colors"
                      >
                        Bannir
                      </button>
                    </form>
                  )}
                  <form
                    action={async () => {
                      "use server";
                      await deleteUserAction(u.id);
                    }}
                  >
                    <button
                      type="submit"
                      className="text-xs px-3 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                    >
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
