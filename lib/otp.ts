import { prisma } from "./prisma";

export function generateOtpCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function createOtp(email: string, name: string): Promise<string> {
  // Invalidate any existing unused codes for this email
  await prisma.otpCode.updateMany({
    where: { email, used: false },
    data: { used: true },
  });

  const code = generateOtpCode();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await prisma.otpCode.create({
    data: { email, name, code, expiresAt },
  });

  return code;
}

export async function verifyOtp(
  email: string,
  code: string
): Promise<{ valid: boolean; name?: string }> {
  const otp = await prisma.otpCode.findFirst({
    where: {
      email,
      code,
      used: false,
      expiresAt: { gt: new Date() },
    },
  });

  if (!otp) return { valid: false };

  await prisma.otpCode.update({
    where: { id: otp.id },
    data: { used: true },
  });

  return { valid: true, name: otp.name };
}
