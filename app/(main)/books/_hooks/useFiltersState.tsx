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
  const [filters, setFilters] = useState<FiltersState>(initial);

  return { filters, setFilters };
}
