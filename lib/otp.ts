import { timingSafeEqual } from "crypto";
import { prisma } from "./prisma";

const MAX_ATTEMPTS = 5;
// Dummy value used to keep the no-OTP-found branch's timing similar to the
// real one (still does a timing-safe compare against the right length).
const DUMMY_CODE = "000000";

export function generateOtpCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
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
  // Fetch the most recent unused, unexpired OTP for this email
  const otp = await prisma.otpCode.findFirst({
    where: {
      email,
      used: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!otp) {
    // Perform a same-shape comparison so the no-row branch isn't measurably
    // faster than the row-found branch.
    safeEqual(DUMMY_CODE, code.length === DUMMY_CODE.length ? code : DUMMY_CODE);
    return { valid: false };
  }

  // Over the attempt budget — burn the code.
  if (otp.attempts >= MAX_ATTEMPTS) {
    await prisma.otpCode.update({
      where: { id: otp.id },
      data: { used: true },
    });
    return { valid: false };
  }

  if (!safeEqual(otp.code, code)) {
    const nextAttempts = otp.attempts + 1;
    await prisma.otpCode.update({
      where: { id: otp.id },
      data: {
        attempts: nextAttempts,
        // Auto-invalidate once we hit the cap.
        ...(nextAttempts >= MAX_ATTEMPTS ? { used: true } : {}),
      },
    });
    return { valid: false };
  }

  await prisma.otpCode.update({
    where: { id: otp.id },
    data: { used: true },
  });

  return { valid: true, name: otp.name };
}
