import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "公众号文章摘要",
  description: "AI 驱动的公众号文章摘要系统",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <h1 className="text-2xl font-bold text-gray-900">📚 公众号文章摘要</h1>
            </div>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}