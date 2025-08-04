import { Geist, Geist_Mono } from 'next/font/google';
import '../../globals.css';
import Link from 'next/link';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <header className="gap-6 p-6 text-black">
          <Link href="/" className="text-xl font-bold block mb-6">
            📚 BookWorm
          </Link>
        </header>
        {children}
      </body>
    </html>
  );
}
