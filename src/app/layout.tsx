import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "상호이해도 게임",
  description: "친구 간의 상호 이해도를 퀴즈로 풀고 랭킹으로 확인하는 소셜 게임",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
