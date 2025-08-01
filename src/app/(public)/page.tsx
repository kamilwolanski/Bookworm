import { getUserSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await getUserSession();

  if (session) redirect('/books');
  return (
    <>
      <div className="container mx-auto">
        <h1>Strona Główna</h1>
      </div>
    </>
  );
}
