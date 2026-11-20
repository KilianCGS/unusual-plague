import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 2026-11-20: the link preview (LinkedIn, social networks). Set NEXT_PUBLIC_SITE_URL to the real address when it is
// published, so the preview image gets an absolute URL; until then it points at localhost.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const DESCRIPTION =
  "Un juego narrativo de exploración y artesanía: eres un médico de la peste en un pueblo medieval. Investiga, prepara remedios y descubre qué pasa. / A narrative exploration and crafting game: you are a plague doctor in a medieval village. Investigate, brew remedies and find out what is happening.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Unusual Plague",
  description: DESCRIPTION,
  openGraph: {
    title: "Unusual Plague",
    description: DESCRIPTION,
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Unusual Plague" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Unusual Plague",
    description: DESCRIPTION,
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
