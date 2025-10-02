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
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import ModeToggle from '@/components/layout/ModeToggle';
import logo from '@/app/assets/logo.png';
import { Separator } from '../ui/separator';
import { Book } from 'lucide-react';

export default function Topbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const isActive = (path: string) =>
    pathname.includes(path) ? 'text-link! focus:text-link' : '';

  return (
    <header className="flex items-center justify-between gap-4 px-4 py-3 lg:px-8 lg:py-4 border-b border-border bg-card backdrop-blur">
      {/* Left: logo */}
      <Link href="/" className="flex items-center gap-3 shrink-0">
        <Image
          src={logo}
          width={40}
          height={40}
          alt="logo"
          className="rounded"
        />
        <span className="text-lg lg:text-xl font-bold text-primary">
          BookWorm
        </span>
      </Link>

      {/* Desktop nav */}
      <div className="hidden lg:flex items-center gap-4">
        <NavigationMenu viewport={false}>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/books"
                  className={`font-bold focus:bg-transparent  ${isActive('/books')}`}
                >
                  Książki
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {status === 'loading' ? null : session ? (
          <div className="flex items-center gap-2">
            {session.user?.image ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center cursor-pointer hover:bg-accent transition"
                    aria-label="Menu użytkownika"
                  >
                    <Image
                      src={session.user.image}
                      alt={session.user.name ?? 'User'}
                      width={32}
                      height={32}
                      className="rounded-full"
                      priority
                    />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>{session.user.name}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => signOut({ callbackUrl: '/login' })}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Wyloguj się
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </div>
        ) : (
          <Link href="/login">
            <Button className="w-full">Zaloguj się</Button>
          </Link>
        )}
        <ModeToggle />
      </div>

      {/* Mobile: ModeToggle + avatar/logout/login + hamburger */}
      <div className="lg:hidden flex items-center gap-2">
        <ModeToggle />

        {status === 'loading' ? null : session ? (
          <>
            {session.user?.image && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center cursor-pointer hover:bg-accent transition"
                    aria-label="Menu użytkownika"
                  >
                    <Image
                      src={session.user.image}
                      alt={session.user.name ?? 'User'}
                      width={32}
                      height={32}
                      className="rounded-full"
                      priority
                    />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>{session.user.name}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => signOut({ callbackUrl: '/login' })}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Wyloguj się
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </>
        ) : (
          <Link href="/login">
            <Button size="sm">Zaloguj się</Button>
          </Link>
        )}

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Otwórz menu">
              <Menu className=" w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[85vw] sm:w-96 p-5">
            <SheetHeader className="p-0">
              <SheetTitle className="flex items-center gap-3">Menu</SheetTitle>
            </SheetHeader>
            <Separator />
            <nav className="my-2 flex flex-col justify-between gap-2 h-full">
              <div>
                <Link
                  href="/books"
                  className={`font-bold mb-2 focus:text-white focus:bg-transparent focus-visible:bg-transparent ${isActive('/books')}`}
                >
                  <div className="flex items-center">
                    <Book className="me-2" /> Książki
                  </div>
                </Link>
              </div>
              <div>
                {status === 'loading' ? null : session ? (
                  <div className="flex items-center gap-3">
                    {session.user?.image && (
                      <Image
                        src={session.user.image}
                        alt={session.user.name ?? 'User'}
                        width={36}
                        height={36}
                        className="rounded-full"
                      />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium leading-none">
                        {session.user?.name ?? 'Użytkownik'}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => signOut({ callbackUrl: '/login' })}
                    >
                      Wyloguj
                    </Button>
                  </div>
                ) : (
                  <Link href="/login" className="w-full">
                    <Button className="w-full">Zaloguj się</Button>
                  </Link>
                )}
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
