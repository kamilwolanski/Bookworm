"use client";

import { Badge } from "@/components/ui/badge";
import { XCircle } from "lucide-react";
import { FiltersState } from "../../_hooks/useFiltersState";
import { polishGenres } from "@/app/(admin)/admin/data";

type Props = {
  filters: FiltersState;
  onChange: (next: FiltersState) => void;
  onClearAll: () => void;
};

export default function ActiveFilters({
  filters,
  onChange,
  onClearAll,
}: Props) {
  const hasAny =
    filters.genres?.length ||
    filters.statuses?.length ||
    filters.userrating?.length ||
    filters.rating;

  if (!hasAny) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mt-3">
      {/* GENRES */}
      {filters.genres?.map((id) => (
        <Badge
          key={`genre-${id}`}
          className="mx-1 py-1 pointer-events-auto "
          onClick={(e) => {
            e.stopPropagation();
            onChange({
              ...filters,
              genres: filters.genres?.filter((g) => g !== id),
            });
          }}
        >
          Gatunek: {polishGenres[id] ?? id}
          <XCircle className="ml-2 h-4 w-4 cursor-pointer pointer-events-auto" />
        </Badge>
      ))}

      {/* STATUS */}
      {filters.statuses?.map((status) => (
        <Badge
          key={`status-${status}`}
          className="mx-1 py-1"
          onClick={(e) => {
            e.stopPropagation();
            onChange({
              ...filters,
              statuses: filters.statuses?.filter((s) => s !== status),
            });
          }}
        >
          Status: {status}
          <XCircle className="ml-2 h-4 w-4 cursor-pointer" />
        </Badge>
      ))}

      {/* USER RATING */}
      {filters.userrating?.map((ur) => (
        <Badge
          key={`ur-${ur}`}
          className="mx-1 py-1"
          onClick={(e) => {
            e.stopPropagation();
            onChange({
              ...filters,
              userrating: filters.userrating?.filter((r) => r !== ur),
            });
          }}
        >
          Moja ocena: {ur}
          <XCircle className="ml-2 h-4 w-4 cursor-pointer" />
        </Badge>
      ))}

      {/* RATING */}
      {filters.rating && (
        <Badge
          className="mx-1 py-1"
          onClick={(e) => {
            e.stopPropagation();
            onChange({
              ...filters,
              rating: undefined,
            });
          }}
        >
          Ocena: {filters.rating}
          <XCircle className="ml-2 h-4 w-4 cursor-pointer" />
        </Badge>
      )}

      {/* CLEAR ALL */}
      <Badge
        variant="secondary"
        className="mx-1 py-1 cursor-pointer"
        onClick={onClearAll}
      >
        Wyczyść filtry
        <XCircle className="ml-2 h-4 w-4" />
      </Badge>
    </div>
  );
}
