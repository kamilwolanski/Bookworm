"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Session } from "next-auth";

function DropdownMenuClient({ session }: { session: Session }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center cursor-pointer hover:bg-accent transition"
          aria-label="Menu użytkownika"
        >
          <Image
            src={session.user.image}
            alt={session.user.name ?? "User"}
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
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Wyloguj się
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default DropdownMenuClient;
