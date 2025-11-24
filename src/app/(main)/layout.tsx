import { Analytics } from '@vercel/analytics/next';
export const runtime = 'nodejs';
export const preferredRegion = 'fra1';

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';
import SessionProvider from '@/components/auth/SessionProvider';
import Topbar from '@/components/layout/TopBar';
import { ThemeProvider } from '@/components/layout/ThemeProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const session = await getUserSession();

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
          themes={['light', 'dark']}
        >
          <SessionProvider>
            <div className="flex-1 flex flex-col">
              <Topbar />
              <main className="flex-1">
                {children}
                <Analytics />
              </main>
            </div>
          </SessionProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
