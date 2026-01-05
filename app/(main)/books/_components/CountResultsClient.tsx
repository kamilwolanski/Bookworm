'use client';

import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';


export default function CountResults() {
  const searchParams = useSearchParams();
  const query = searchParams.toString();

  const { data, isLoading } = useSWR(
    `/api/books?${query}`,
  );

  if (isLoading) return <>…</>;

  return <>{data?.totalCount ?? 0}</>;
}
