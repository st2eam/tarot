import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Serif_SC } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import MysticalBackground from "@/components/layout/MysticalBackground";
import ThemeProvider from "@/components/layout/ThemeProvider";
import GlobalChatPanel from "@/components/chat/GlobalChatPanel";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSerifSC = Noto_Serif_SC({
  variable: "--font-serif-zh",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mystic Tarot — AI 塔罗牌解读",
  description: "探索塔罗牌的奥秘，结合 AI 智能解读，深入了解过去、现在和未来",
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} ${notoSerifSC.variable} h-full antialiased`}
    >
      <body className="h-screen flex flex-col overflow-hidden">
        <ThemeProvider>
          <MysticalBackground />
          <div className="vignette-overlay" aria-hidden="true" />
          <Header />
          <main className="flex-1 overflow-y-auto flex flex-col">{children}</main>
          <GlobalChatPanel />
        </ThemeProvider>
      </body>
    </html>
  );
}
