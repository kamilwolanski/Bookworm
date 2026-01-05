"use client";

import { Suspense, ReactNode } from "react";
import { useSearchParams } from "next/navigation";

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
        <div className="flex items-center justify-center min-h-[calc(100vh-300px)]">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-foreground" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
