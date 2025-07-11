'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Topbar() {
  const { data: session, status } = useSession();

  return (
    <header className="flex justify-end items-center gap-6 p-6 text-white">
      {status === 'loading' ? null : session ? (
        <div className="flex items-center gap-4">
          {session.user?.image && (
            <DropdownMenu>
              <button className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center cursor-pointer hover:bg-[#ffffff1a] transition ">
                <DropdownMenuTrigger asChild>
                  <Image
                    src={session.user.image}
                    alt={session.user.name ?? 'User'}
                    width={32}
                    height={32}
                    className="rounded-full"
                    priority
                  />
                </DropdownMenuTrigger>
              </button>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>{session.user.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => signOut({ callbackUrl: '/login' })}
                >
                  Log out
                  <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      ) : (
        <Link
          href="/login"
          className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 transition"
        >
          Login
        </Link>
      )}
    </header>
  );
}
