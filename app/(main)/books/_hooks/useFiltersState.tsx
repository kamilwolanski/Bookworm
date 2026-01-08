'use client';

import { ReadingStatus } from '@prisma/client';
import { useState } from 'react';

export type FiltersState = {
  search?: string;
  rating?: string;
  genres?: string[];
  userrating?: string[];
  statuses?: ReadingStatus[];
  myShelf?: boolean;
};

export function useFiltersState(initial: FiltersState) {
  const [uiFilters, setUiFilters] = useState<FiltersState>(initial);
  const [queryFilters, setQueryFilters] = useState<FiltersState>(initial);

  return {
    uiFilters,
    setUiFilters,
    queryFilters,
    setQueryFilters,
  };
}
