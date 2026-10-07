import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 1. ปรับเปลี่ยน Title และ Description ให้ตรงกับระบบของเรา
export const metadata: Metadata = {
  title: "Smart Factory Helpdesk",
  description: "ระบบติดตามสถานะการแจ้งซ่อมและเบิกใช้อะไหล่ในโรงงาน",
};

// 2. ปรับ Type ของ props เป็น { children: React.ReactNode } ตามมาตรฐาน Next.js
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-gray-50">
        {children}
      </body>
    </html>
  );
}