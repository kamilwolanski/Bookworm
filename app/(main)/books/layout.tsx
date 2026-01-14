import '../../globals.css';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex-1 flex flex-col h-full">
      <main className="flex-1 p-5 sm:p-8 lg:p-16 pt-4 sm:pt-8">{children}</main>
    </div>
  );
}
