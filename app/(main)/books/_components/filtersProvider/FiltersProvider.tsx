"use client";

import { createContext, useContext } from "react";
import { useSearchParams } from "next/navigation";
import { useFiltersState } from "../../_hooks/useFiltersState";
import { useUrlSync } from "../../_hooks/useUrlSync";
import { ReadingStatus } from "@prisma/client";

const FiltersContext = createContext<ReturnType<typeof useFiltersState> | null>(
  null
);

import { useEffect } from "react";

export function FiltersProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();

  const state = useFiltersState({
    search: "",
    rating: undefined,
    genres: [],
    userrating: [],
    statuses: undefined,
    myShelf: false,
  });

  useEffect(() => {
    state.setFilters({
      search: searchParams.get("search") ?? "",
      rating: searchParams.get("rating") ?? undefined,
      genres: searchParams.get("genre")?.split(",") ?? [],
      userrating: searchParams.get("userrating")?.split(",") ?? [],
      statuses: searchParams.get("status")?.toUpperCase().split(",") as
        | ReadingStatus[]
        | undefined,
      myShelf: searchParams.get("myshelf") === "true",
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useUrlSync(state.filters);

  return (
    <FiltersContext.Provider value={state}>{children}</FiltersContext.Provider>
  );
}

export function useFilters() {
  const ctx = useContext(FiltersContext);
  if (!ctx) throw new Error("useFilters must be used inside FiltersProvider");
  return ctx;
}
