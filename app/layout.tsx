import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { FallingFood } from "@/components/background/FallingFood";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bob – Préférences alimentaires",
  description: "Partagez vos préférences alimentaires avec votre famille",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${geist.variable} h-full`}>
      <body className="min-h-full hero-gradient antialiased">
        <FallingFood />
        <div className="relative z-[1]">
          <MotionProvider>{children}</MotionProvider>
        </div>
      </body>
    </html>
  );
}
