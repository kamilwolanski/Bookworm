"use client";

import { createContext, useContext, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ReadingStatus } from "@prisma/client";

import { FiltersState, useFiltersState } from "../../_hooks/useFiltersState";
import { useDebouncedValue } from "../../_hooks/useDebouncedValue";
import { useUrlSync } from "../../_hooks/useUrlSync";

const FiltersContext = createContext<ReturnType<typeof useFiltersState> | null>(
  null
);

export function FiltersProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();

  const state = useFiltersState({
      search: searchParams.get("search") ?? "",
      rating: searchParams.get("rating") ?? undefined,
      genres: searchParams.get("genre")?.split(",") ?? [],
      userrating: searchParams.get("userrating")?.split(",") ?? [],
      statuses: searchParams.get("status")?.toUpperCase().split(",") as
        | ReadingStatus[]
        | undefined,
      myShelf: searchParams.get("myshelf") === "true",
  });

  useEffect(() => {
    const initial: FiltersState = {
      search: searchParams.get("search") ?? "",
      rating: searchParams.get("rating") ?? undefined,
      genres: searchParams.get("genre")?.split(",") ?? [],
      userrating: searchParams.get("userrating")?.split(",") ?? [],
      statuses: searchParams.get("status")?.toUpperCase().split(",") as
        | ReadingStatus[]
        | undefined,
      myShelf: searchParams.get("myshelf") === "true",
    };

    state.setUiFilters(initial);
    state.setQueryFilters(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const debouncedSearch = useDebouncedValue(state.uiFilters.search, 300);

useEffect(() => {
  state.setQueryFilters((prev) => ({
    ...prev,
    search: debouncedSearch,
    rating: state.uiFilters.rating,
    genres: state.uiFilters.genres,
    userrating: state.uiFilters.userrating,
    statuses: state.uiFilters.statuses,
    myShelf: state.uiFilters.myShelf,
  }));
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [
  debouncedSearch,
  state.uiFilters.rating,
  state.uiFilters.genres,
  state.uiFilters.userrating,
  state.uiFilters.statuses,
  state.uiFilters.myShelf,
]);

  useUrlSync(state.queryFilters);

  return (
    <FiltersContext.Provider value={state}>{children}</FiltersContext.Provider>
  );
}

export function useFilters() {
  const ctx = useContext(FiltersContext);
  if (!ctx) {
    throw new Error("useFilters must be used inside FiltersProvider");
  }
  return ctx;
}
