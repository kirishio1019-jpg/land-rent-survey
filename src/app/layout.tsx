import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI賃料調査 - LAND事業収支",
  description: "AIが検索エンジンを活用して賃料相場を自動調査するシステム",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-surface min-h-screen">{children}</body>
    </html>
  );
}
