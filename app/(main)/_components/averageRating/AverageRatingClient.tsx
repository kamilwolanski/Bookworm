"use client";

import { BookRatingResponse } from "@/lib/books/rating";
import { Star } from "lucide-react";
import useSWR from "swr";
import Image from "next/image";
import multipleUsersIcon from "@/app/assets/icons/multiple_users.svg";


export default function AverageRatingClient({
  bookSlug,
  bookRatingFromServer,
}: {
  bookSlug: string;
  bookRatingFromServer: BookRatingResponse;
}) {
  const { data: bookRating = bookRatingFromServer } =
    useSWR<BookRatingResponse>(`/api/books/${bookSlug}/rating`, {
      fallbackData: bookRatingFromServer,
      revalidateOnMount: false,
    });
  return (
    <div className="flex gap-1 items-center">
      <div className="relative w-4 h-4 sm:w-5 sm:h-5">
        <Image
          src={multipleUsersIcon}
          alt="icon"
          fill
          className="object-contain"
        />
      </div>
      <span className="flex items-center gap-1 text-xs sm:text-sm">
        {bookRating.averageRating ?? 0}/5{" "}
        <Star className="w-3 h-3 fill-current text-yellow-400" />
      </span>
    </div>
  );
}
