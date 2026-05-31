import nodemailer from "nodemailer";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
});

export async function sendOtpEmail(
  email: string,
  name: string,
  code: string,
  redirectTo?: string
): Promise<void> {
  // In development, always log the code to the console
  if (process.env.NODE_ENV === "development") {
    console.log(`\n🔑 OTP pour ${name} (${email}): ${code}\n`);
  }

  // Skip real email send if no SMTP host configured
  if (!process.env.SMTP_HOST) {
    console.warn("⚠️  SMTP_HOST non configuré — email non envoyé.");
    return;
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const params = new URLSearchParams({ email, code });
  if (redirectTo) params.set("redirectTo", redirectTo);
  const magicLink = `${appUrl}/auth/verify?${params.toString()}`;
  // Escape user-controlled string before interpolating into the HTML body.
  const safeName = escapeHtml(name);

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM ?? "Bob <noreply@bob.com>",
      to: email,
      subject: "Votre code de connexion",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
          <h2 style="color: #1a1a1a; margin-bottom: 8px;">Bonjour ${safeName} !</h2>
          <p style="color: #444; margin-bottom: 24px;">
            Voici votre code de connexion pour Bob :
          </p>
          <div style="background: #f5f5f5; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 16px;">
            <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #1a1a1a;">
              ${code}
            </span>
          </div>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 0 auto 16px auto;">
            <tr>
              <td align="center" bgcolor="#6366f1" style="background-color: #6366f1; border-radius: 8px;">
                <a href="${magicLink}" target="_blank" style="display: inline-block; padding: 14px 32px; color: #ffffff !important; text-decoration: none; font-family: Arial, sans-serif; font-size: 14px; font-weight: 700; line-height: 1; white-space: nowrap; border-radius: 8px; border: 1px solid #6366f1;">
                  Se connecter en un clic
                </a>
              </td>
            </tr>
          </table>
          <p style="text-align: center; color: #888; font-size: 12px; margin: 0 0 24px;">
            ou collez ce lien&nbsp;:<br />
            <a href="${magicLink}" style="color: #6366f1; word-break: break-all;">${magicLink}</a>
          </p>
          <p style="color: #888; font-size: 14px;">
            Ce code expire dans 10 minutes. Si vous n'avez pas demandé ce code, ignorez cet email.
          </p>
        </div>
      `,
    });
  } catch (error) {
    // Log the full error server-side, but throw a generic message so we
    // don't surface SMTP server detail (credentials, host, etc.) to callers.
    console.error("Nodemailer error:", error);
    throw new Error("Erreur d'envoi d'email");
  }
}
