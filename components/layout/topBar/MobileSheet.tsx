"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Menu, Book, Home } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import LoginDialog from "@/components/auth/LoginDialog";
function MobileSheet({ session }: { session: Session | null }) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };
  const activeClassNames = "text-link! focus:text-link";

  return (
    <Sheet key={pathname}>
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
            <SheetClose asChild>
              <Link
                href="/"
                className={`font-bold focus:bg-transparent focus-visible:bg-transparent ${
                  isActive("/") ? activeClassNames : ""
                }`}
              >
                <div className="flex items-center text-sm mb-3">
                  <Home className="me-2" width={16} /> Strona główna
                </div>
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link
                href="/books"
                className={`font-bold mb-2 focus:bg-transparent focus-visible:bg-transparent ${
                  isActive("/books") ? activeClassNames : ""
                }`}
              >
                <div className="flex items-center text-sm">
                  <Book className="me-2" width={16} /> Książki
                </div>
              </Link>
            </SheetClose>
          </div>
          <div>
            {session ? (
              <div className="flex items-center gap-3">
                {session.user?.image && (
                  <Image
                    src={session.user.image}
                    alt={session.user.name ?? "User"}
                    width={36}
                    height={36}
                    className="rounded-full"
                  />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium leading-none">
                    {session.user?.name ?? "Użytkownik"}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    signOut({ callbackUrl: "/" });
                  }}
                >
                  Wyloguj
                </Button>
              </div>
            ) : (
              <SheetClose asChild>
                <LoginDialog dialogTriggerBtn={<Button className="w-full">Zaloguj się</Button>} />
              </SheetClose>
            )}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export default MobileSheet;
