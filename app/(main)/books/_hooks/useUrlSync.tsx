"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FiltersState } from "./useFiltersState";
import { useEffect, useRef } from "react";

export function useUrlSync(filters: FiltersState) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prevFiltersRef = useRef<FiltersState | null>(null);
  const isFirstRunRef = useRef(true);
  useEffect(() => {
    const current = searchParams.toString();
    const params = new URLSearchParams(current);
    const prevFilters = prevFiltersRef.current;

    const filtersChanged =
      !prevFilters || JSON.stringify(prevFilters) !== JSON.stringify(filters);
    if (filters.search) params.set("search", filters.search);
    else params.delete("search");

    if (filters.rating) params.set("rating", filters.rating);
    else params.delete("rating");

    if (filters.genres?.length) params.set("genre", filters.genres.join(","));
    else params.delete("genre");

    if (filters.userrating?.length)
      params.set("userrating", filters.userrating.join(","));
    else params.delete("userrating");

    if (filters.statuses?.length)
      params.set(
        "status",
        filters.statuses.map((s) => s.toLowerCase()).join(",")
      );
    else params.delete("status");

    if (filters.myShelf) params.set("myshelf", "true");
    else params.delete("myshelf");

    if (!isFirstRunRef.current && filtersChanged) {
      params.set("page", "1");
    }
    const next = params.toString();

    if (next !== current) {
      router.replace(`?${next}`, { scroll: false });
    }
    prevFiltersRef.current = filters;
    isFirstRunRef.current = false;
  }, [filters, router, searchParams]);
}
