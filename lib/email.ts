import nodemailer from "nodemailer";

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
  code: string
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

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM ?? "Bob <noreply@bob.com>",
      to: email,
      subject: "Votre code de connexion",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
          <h2 style="color: #1a1a1a; margin-bottom: 8px;">Bonjour ${name} !</h2>
          <p style="color: #444; margin-bottom: 24px;">
            Voici votre code de connexion pour Bob :
          </p>
          <div style="background: #f5f5f5; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #1a1a1a;">
              ${code}
            </span>
          </div>
          <p style="color: #888; font-size: 14px;">
            Ce code expire dans 10 minutes. Si vous n'avez pas demandé ce code, ignorez cet email.
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Nodemailer error:", error);
    throw new Error(error instanceof Error ? error.message : "Erreur d'envoi d'email");
  }
}
