import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MC Server Status | mcix.jp",
  description: "Minecraft Java Edition サーバーステータス確認ツール",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
