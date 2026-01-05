"use client";
import Image from "next/image";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { usePathname } from "next/navigation";

function DesktopNav() {
  "use client";
  const pathname = usePathname();
  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  const activeClassNames = "text-link! focus:text-link";

  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              href="/"
              className={`font-bold focus:bg-transparent ${
                isActive("/") ? activeClassNames : ""
              }`}
            >
              Strona główna
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              href="/books"
              className={`font-bold focus:bg-transparent ${
                isActive("/books") ? activeClassNames : ""
              }`}
            >
              Książki
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default DesktopNav;