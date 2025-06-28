import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "../components/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MQL5 GOLD EA 榜单 - 专业黄金EA交易系统排行榜",
  description: "专业的MQL5黄金EA交易系统排行榜，提供实时数据分析，包括胜率榜、回撤榜、盈亏比榜等多维度排名",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {/* SVG渐变定义 */}
        <svg width="0" height="0" style={{ position: 'absolute' }}>
          <defs>
            <linearGradient id="icon-gradient-def" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4027EF" />
              <stop offset="100%" stopColor="#7700FF" />
            </linearGradient>
          </defs>
        </svg>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
