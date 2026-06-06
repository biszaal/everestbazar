import type { Metadata, Viewport } from "next";
import {
  Bricolage_Grotesque,
  Hanken_Grotesk,
  IBM_Plex_Mono,
  Noto_Sans_Devanagari,
} from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { AuthHydrator } from "@/components/providers/AuthHydrator";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-bricolage",
  display: "swap",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hanken",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-noto-devanagari",
  display: "swap",
});

const SITE_URL = "https://everestbazar.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "EverestBazar — Nepal's trusted secondhand marketplace",
    template: "%s | EverestBazar",
  },
  description:
    "Buy and sell secondhand in Nepal without the scams. Every seller is verified against their national ID and every payment is held in escrow until you confirm delivery.",
  keywords: [
    "Nepal secondhand marketplace",
    "buy sell Nepal",
    "verified marketplace Nepal",
    "escrow Nepal",
    "Hamrobazar alternative",
    "EverestBazar",
  ],
  applicationName: "EverestBazar",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_NP",
    url: SITE_URL,
    siteName: "EverestBazar",
    title: "EverestBazar — Nepal's trusted secondhand marketplace",
    description:
      "Verified sellers. Escrow-protected payments. Real dispute resolution. Nepal's highest standard in commerce.",
  },
  twitter: {
    card: "summary_large_image",
    title: "EverestBazar — Nepal's trusted secondhand marketplace",
    description:
      "Verified sellers. Escrow-protected payments. Real dispute resolution.",
  },
};

export const viewport: Viewport = {
  themeColor: "#be3a2b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${bricolage.variable} ${hanken.variable} ${plexMono.variable} ${notoDevanagari.variable}`}
      >
        <LanguageProvider>
          <AuthHydrator />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
