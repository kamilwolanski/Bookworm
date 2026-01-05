import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../../globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import Sidebar from "@/components/layout/Sidebar";
import { Suspense } from "react";
import LayoutServerWrapper from "./_components/LayoutServerWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BookWorm | Admin",
  description:
    "BookWorm to aplikacja dla miłośników książek. Przeglądaj, oceniaj i recenzuj tytuły oraz dodawaj je do swojej wirtualnej półki.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex min-h-screen`}
      >
        <Suspense fallback="loading...">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            themes={["light", "dark"]}
          >
            <LayoutServerWrapper>
              <Sidebar />
              <div className="w-full">
                <main className="p-16 pt-8">{children}</main>
              </div>
            </LayoutServerWrapper>
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  );
}
