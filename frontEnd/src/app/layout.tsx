"use client";

import localFont from "next/font/local";
import "./globals.css";
import { Layout } from "antd";
import Sidebar from "@/common/components/SidebarComponent/Delivery/components/Sidebar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Layout style={{ minHeight: "100vh" }}>
          <Sidebar />
          <Layout className="p-4">
            <Layout.Content className="bg-white p-6 shadow rounded">
              {children}
            </Layout.Content>
          </Layout>
        </Layout>
      </body>
    </html>
  );
}
