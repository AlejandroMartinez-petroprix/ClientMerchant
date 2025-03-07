"use client";

import { useState } from "react";
import localFont from "next/font/local";
import "./globals.css";
import { Layout, ConfigProvider, theme as antdTheme } from "antd";
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
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        <ConfigProvider
          theme={{
            algorithm: theme === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
          }}
        >
          <Layout style={{ minHeight: "100vh" }}>
            <Sidebar theme={theme} toggleTheme={toggleTheme} />
            <Layout className="p-4">
              <Layout.Content
                className={`p-6 shadow rounded ${
                  theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-black"
                }`}
              >
                {children}
              </Layout.Content>
            </Layout>
          </Layout>
        </ConfigProvider>
      </body>
    </html>
  );
}
