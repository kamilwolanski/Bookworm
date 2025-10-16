import type { Metadata } from 'next';
import '../../globals.css';

export const metadata: Metadata = {
  title: 'BookWorm',
  description:
    'BookWorm to aplikacja dla miłośników książek. Przeglądaj, oceniaj i recenzuj tytuły oraz dodawaj je do swojej wirtualnej półki.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 p-5 sm:p-8 lg:p-16 pt-4 sm:pt-8">{children}</main>
    </div>
  );
}
