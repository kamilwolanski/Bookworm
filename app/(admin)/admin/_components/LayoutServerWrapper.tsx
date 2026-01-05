import { getUserSession } from "@/lib/session";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import SessionProvider from "@/components/auth/SessionProvider";
export default async function LayoutServerWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getUserSession();

  if (session?.user.role !== Role.ADMIN) {
    redirect("/login");
  }

  return <SessionProvider session={session}>{children}</SessionProvider>;
}
