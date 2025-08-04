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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import logo from '@/app/assets/logo.png';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { usePathname } from 'next/navigation';

export default function Topbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const isActive = (path: string) =>
    pathname === path ? 'text-green-300! focus:text-green-300!' : '';

  return (
    <header className="flex justify-between items-center gap-6 px-16 py-6  border-b-[1px] border-[#757575]">
      <Link href="/" className="text-xl font-bold flex items-center">
        <Image
          src={logo}
          width={70}
          height={70}
          alt="logo"
          className="rounded"
        />
        <span className="ms-5">BookWorm</span>
      </Link>
      <div className="flex items-center">
        <NavigationMenu viewport={false} className="me-10">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/books"
                  className={`font-bold focus:text-white focus:bg-transparent focus-visible:bg-transparent  ${isActive('/books')}`}
                >
                  Książki
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/shelf"
                  className={`font-bold focus:text-white focus:bg-transparent focus-visible:bg-transparent ${isActive('/shelf')}`}
                >
                  Moja Półka
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
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
                    Wyloguj się
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
      </div>
    </header>
  );
}
