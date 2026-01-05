import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ModeToggle from "@/components/layout/topBar/ModeToggle";
import logo from "@/app/assets/logo.png";
import LoginDialog from "@/components/auth/LoginDialog";
import { getUserSession } from "@/lib/session";
import { Suspense } from "react";
import DropdownMenuClient from "./DropdownMenuClient";
import DesktopNav from "./DesktopNav";
import MobileSheet from "./MobileSheet";

async function UserLoginInfo() {
  const session = await getUserSession();

  return (
    <>
      {session ? (
        <DropdownMenuClient session={session} />
      ) : (
        <LoginDialog dialogTriggerBtn={<Button>Zaloguj się</Button>} />
      )}
    </>
  );
}

async function MobileSheetSessionWrapper() {
  const session = await getUserSession();

  return <MobileSheet session={session} />;
}

export default function Topbar() {
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
        <DesktopNav />

        <Suspense>
          <UserLoginInfo />
        </Suspense>
        <ModeToggle />
      </div>

      {/* Mobile: ModeToggle + avatar/logout/login + hamburger */}
      <div className="lg:hidden flex items-center gap-2">
        <ModeToggle />
        <Suspense>
          <UserLoginInfo />
        </Suspense>
        <Suspense>
          <MobileSheetSessionWrapper />
        </Suspense>
      </div>
    </header>
  );
}
