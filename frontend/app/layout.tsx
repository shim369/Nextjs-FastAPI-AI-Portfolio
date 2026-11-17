import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Shippori_Mincho_B1, Zen_Kaku_Gothic_New } from "next/font/google";
import type { ReactNode } from "react";
import { I18nProvider } from "@/lib/i18n";
import "./globals.scss";

// Google Fonts は、ビルド時に取得してこのサイト自身のドメインから配信する（実行時に Google へは接続しない）。
// 日本語の書体は文字の範囲ごとに細かく分かれた数百のファイルでできており、先読みすると全部を取りに行ってしまうため、
// 先読みするのは小さい等幅フォントだけにする
const mincho = Shippori_Mincho_B1({
  weight: ["500", "700", "800"],
  subsets: ["latin"],
  variable: "--font-min",
  display: "swap",
  preload: false,
});
const gothic = Zen_Kaku_Gothic_New({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-go",
  display: "swap",
  preload: false,
});
const mono = IBM_Plex_Mono({ weight: ["400", "500"], subsets: ["latin"], variable: "--font-mono", display: "swap" });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://nextjs-fastapi-ai-portfolio.vercel.app";
const TITLE = "Shinpei Ohtani | ポートフォリオ";
const DESCRIPTION = "Shinpei Ohtani のポートフォリオ。経歴・スキル・制作物について AI チャットで質問できます。";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Shinpei Ohtani",
    title: TITLE,
    description: DESCRIPTION,
    locale: "ja_JP",
    alternateLocale: ["en_US"],
  },
  twitter: { card: "summary", title: TITLE, description: DESCRIPTION },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
  themeColor: "#eeeeea",
};

const PERSON_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Shinpei Ohtani",
  jobTitle: "Web Engineer / System Engineer",
  url: SITE_URL,
  sameAs: ["https://github.com/shim369"],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // data-scroll-behavior: Next.js がページ遷移のときだけ smooth スクロールを一時的に外せるようにする
    <html lang="ja" data-scroll-behavior="smooth" className={`${mincho.variable} ${gothic.variable} ${mono.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_JSON_LD) }} />
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
