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
import { Skeleton } from "@/components/ui/skeleton";
import { LogIn, Menu } from "lucide-react";

async function UserLoginInfo() {
  const session = await getUserSession();

  return (
    <>
      {session ? (
        <DropdownMenuClient session={session} />
      ) : (
        <>
          <div className="lg:hidden">
            <LoginDialog
              dialogTriggerBtn={
                <Button variant="ghost" size="icon" aria-label="Zaloguj się">
                  <LogIn className="w-5 h-5" />
                </Button>
              }
            />
          </div>

          <div className="hidden lg:block">
            <LoginDialog dialogTriggerBtn={<Button className="cursor-pointer">Zaloguj się</Button>} />
          </div>
        </>
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

      <div className="hidden lg:flex items-center gap-4">
        <DesktopNav />

        <Suspense fallback={<Skeleton className="rounded-full w-10 h-10" />}>
          <UserLoginInfo />
        </Suspense>
        <ModeToggle />
      </div>

      <div className="lg:hidden flex items-center gap-2 justify-end">
        <ModeToggle />

        <div className="w-10 flex justify-center">
          <Suspense fallback={<Skeleton className="w-10 h-10 rounded-full" />}>
            <UserLoginInfo />
          </Suspense>
        </div>

        <Suspense
          fallback={
            <Button variant="ghost" size="icon" disabled>
              <Menu className="w-6" />
            </Button>
          }
        >
          <MobileSheetSessionWrapper />
        </Suspense>
      </div>
    </header>
  );
}
