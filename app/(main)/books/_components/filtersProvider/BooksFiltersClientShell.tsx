"use client";

import { FiltersProvider } from "./FiltersProvider";

export default function BooksFiltersClientShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FiltersProvider>{children}</FiltersProvider>;
}
