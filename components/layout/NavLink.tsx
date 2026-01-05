'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface NavLinkProps {
  children: ReactNode;
  href: string;
  prefetch?: boolean;
  className?: string;
  activeClassName?: string;
}

export default function NavLink({
  children,
  href,
  prefetch,
  className = '',
  activeClassName = 'text-purple-400',
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname.includes(href);

  const combinedClassName = isActive
    ? `${className} ${activeClassName}`
    : className;

  return (
    <Link href={href} prefetch={prefetch} className={combinedClassName}>
      {children}
    </Link>
  );
}
