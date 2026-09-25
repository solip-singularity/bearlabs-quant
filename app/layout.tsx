import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "贝尔实验室｜量化研究学习站",
  description: "由 Solips-Singularitat 创作的交互式概率统计、社会科学量化与博士研究方法学习站。",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/favicon.svg`,
    shortcut: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/favicon.svg`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
