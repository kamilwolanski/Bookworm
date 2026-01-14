"use client";

import { Suspense, ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function BooksTableSuspense({
  children,
}: {
  children: ReactNode;
}) {
  const sp = useSearchParams();

  const key = JSON.stringify({
    search: sp.get("search"),
    genre: sp.get("genre"),
    rating: sp.get("rating"),
    userrating: sp.get("userrating"),
    status: sp.get("status"),
    myshelf: sp.get("myshelf"),
    page: sp.get("page"),
  });

  return (
    <Suspense
      key={key}
      fallback={
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-6 gap-2 3xl:gap-10">
          {Array.from({ length: 18 }).map((_, i) => (
            <Skeleton
              className="relative border-none h-full shadow-md p-1 rounded-xl"
              key={i}
            >
              <div className="relative aspect-230/320 w-full"/>
            </Skeleton>
          ))}
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
