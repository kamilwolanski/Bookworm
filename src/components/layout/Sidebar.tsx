'use client';

import { Home, Book, User } from 'lucide-react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import NavLink from '../nav/NavLink';
import { Button } from '../ui/button';
import Image from 'next/image';
import logo from '@/app/assets/logo.png';

const menu = [
  { name: 'Dashboard', icon: <Home size={20} />, href: '/admin/dashboard' },
  { name: 'Books', icon: <Book size={20} />, href: '/admin/books' },
  { name: 'Users', icon: <User size={20} />, href: '/admin/users', },
];

export default function Sidebar() {
  const { data: session, status } = useSession();

  return (
    <aside className="bg-[#262632] text-white w-80 p-6 flex flex-col justify-between">
      <div>
        <Link href="/" className="text-md font-bold flex items-center">
          <Image
            src={logo}
            width={40}
            height={40}
            alt="logo"
            className="rounded"
          />
          <span className="ms-4">BookWorm</span>
        </Link>
        <nav className="space-y-4 mt-6">
          {menu.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <NavLink
                href={item.href}
                className="flex items-center space-x-2 text-sm cursor-pointer hover:text-purple-400"
                activeClassName="text-purple-400 font-semibold"
              >
                <>
                  {item.icon}
                  <span>{item.name}</span>
                </>
              </NavLink>
            </div>
          ))}
        </nav>
      </div>
      {status === 'loading' ? null : session ? (
        <div className="mb-20 mx-auto">
          <Button
            className="cursor-pointer"
            onClick={() => signOut({ callbackUrl: '/login' })}
          >
            Wyloguj się
          </Button>
        </div>
      ) : (
        <Link
          href="/login"
          className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 transition"
        >
          Login
        </Link>
      )}
    </aside>
  );
}
