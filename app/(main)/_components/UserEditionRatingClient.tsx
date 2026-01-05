"use client";
import Image from "next/image";
import userIcon from "@/app/assets/icons/user.svg";
import { Star } from "lucide-react";
import useSWR from "swr";
import { UserBookReview } from "@/lib/user";

export default function UserEditionRatingClient({
  editionId,
  userEditionRatingFromServer,
}: {
  editionId: string;
  userEditionRatingFromServer: UserBookReview | null;
}) {
  const { data: userEditionRating = userEditionRatingFromServer } =
    useSWR<UserBookReview | null>(`/api/editions/${editionId}/reviews/me`, {
      fallbackData: userEditionRatingFromServer,
      revalidateOnMount: false,
    });

  if (!userEditionRating?.rating) {
    return null;
  }

  return (
    <div className="flex gap-1 items-center">
      <div className="relative w-4 h-4 sm:w-5 sm:h-5">
        <Image src={userIcon} alt="icon" fill className="object-contain" />
      </div>
      <span className="flex items-center gap-1 text-xs sm:text-sm">
        {`${userEditionRating.rating}/5`}
        <Star className="w-3 h-3 fill-current text-yellow-400" />
      </span>
    </div>
  );
}
