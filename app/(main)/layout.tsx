import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import SWRConfigProvider from "../services/SWRConfigProvider";
import { ThemeProvider } from "next-themes";
import SessionProvider from "@/components/auth/SessionProvider";
import TopBar from "@/components/layout/topBar/TopBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'BookWorm',
  description:
    'BookWorm to platforma dla miłośników książek. Przeglądaj, oceniaj i recenzuj tytuły oraz dodawaj je do swojej wirtualnej półki.',
  openGraph: {
    title: 'BookWorm',
    description:
      'BookWorm to platforma dla miłośników książek. Przeglądaj, oceniaj i recenzuj tytuły oraz dodawaj je do swojej wirtualnej półki.',
    url: 'https://bookworm.today',
    siteName: 'BookWorm',
    images: [
      {
        url: '/ogimage.png',
        width: 1200,
        height: 630,
        alt: 'BookWorm OG Image',
      },
    ],
    locale: 'pl_PL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BookWorm',
    description:
      'BookWorm to platforma dla miłośników książek. Przeglądaj, oceniaj i recenzuj tytuły oraz dodawaj je do swojej wirtualnej półki.',
    images: ['/ogimage.png'],
  },
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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          themes={["light", "dark"]}
        >
          <SessionProvider>
            <SWRConfigProvider>
              <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1">{children}</main>
              </div>
            </SWRConfigProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
