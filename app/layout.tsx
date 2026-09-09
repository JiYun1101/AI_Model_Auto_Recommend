import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/src/shared/components/providers";
import { AiTypeTest } from "@/src/features/ai-profile/ui/ai-type-test";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ModelFit - AI 모델 추천 서비스",
  description:
    "프롬프트를 분석해 가장 적합한 AI 모델을 추천해드립니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50">
        <Providers>
          <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
              <a
                href="/"
                className="text-xl font-bold text-indigo-600 tracking-tight"
              >
                ModelFit
              </a>
              <nav className="flex items-center gap-4 text-sm text-gray-600">
                <a
                  href="/"
                  className="hover:text-indigo-600 transition-colors"
                >
                  추천받기
                </a>
                <a
                  href="/models"
                  className="hover:text-indigo-600 transition-colors"
                >
                  모델 목록
                </a>
              </nav>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <AiTypeTest />
          <footer className="py-6 text-center text-xs text-gray-400 border-t border-gray-200 bg-white">
            ModelFit Phase 1 MVP · 외부 API 없이 로컬 실행 가능
          </footer>
        </Providers>
      </body>
    </html>
  );
}
