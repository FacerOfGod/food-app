import { OtpForm } from "@/components/auth/OtpForm";

interface Props {
  searchParams: Promise<{ email?: string; redirectTo?: string }>;
}

export default async function VerifyPage({ searchParams }: Props) {
  const { email, redirectTo } = await searchParams;

  if (!email) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <p className="text-gray-500">Lien invalide. <a href="/" className="text-orange-500 underline">Recommencer</a></p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">📧</div>
          <h1 className="text-xl font-bold text-gray-900">Vérifiez vos emails</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Nous avons envoyé un code à{" "}
            <span className="font-medium text-gray-700">{email}</span>
          </p>
        </div>
        <OtpForm email={email} redirectTo={redirectTo} />
        <p className="text-center mt-4 text-xs text-gray-400">
          Pas reçu ?{" "}
          <a href={`/?${redirectTo ? `redirectTo=${redirectTo}` : ""}`} className="text-orange-500 underline">
            Renvoyer le code
          </a>
        </p>
      </div>
    </main>
  );
}
