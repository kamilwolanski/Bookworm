"use client";

import { Badge } from "@/components/ui/badge";
import { UserBookStatus } from "@/lib/user";
import { ReadingStatus } from "@prisma/client";
import {
  BookOpen,
  CheckCircle,
  Clock,
  LucideIcon,
  XCircle,
} from "lucide-react";
import React, { useMemo } from "react";
import useSWR from "swr";

export default function BookDetailsBadges({
  userBookStatusFromServer,
  bookSlug,
  editionId,
  isLogIn,
}: {
  userBookStatusFromServer: UserBookStatus | null;
  bookSlug: string;
  editionId: string;
  isLogIn: boolean;
}) {
  const shouldFetch = isLogIn;
  const key = useMemo(
    () =>
      shouldFetch
        ? `/api/books/${bookSlug}/editions/${editionId}/userBook/me`
        : null,
    [bookSlug, editionId, shouldFetch],
  );
  const { data: userBookStatus = userBookStatusFromServer } =
    useSWR<UserBookStatus | null>(key, {
      fallbackData: userBookStatusFromServer,
    });

  const isOnShelf = userBookStatus?.isOnShelf;
  const readingStatus = userBookStatus?.readingStatus;

  const statusConfig: Record<
    ReadingStatus,
    {
      label: string;
      color: string;
      icon: LucideIcon;
    }
  > = {
    WANT_TO_READ: {
      label: "Chcę przeczytać",
      color: "bg-blue-100 text-blue-700 border-blue-200",
      icon: Clock,
    },
    READING: {
      label: "Obecnie czytam",
      color: "bg-orange-100 text-orange-700 border-orange-200",
      icon: BookOpen,
    },
    READ: {
      label: "Przeczytane",
      color: "bg-green-100 text-green-700 border-green-200",
      icon: CheckCircle,
    },
    ABANDONED: {
      label: "Porzucone",
      color: "bg-gray-100 text-gray-700 border-gray-200",
      icon: XCircle,
    },
  };

  return (
    <div className="absolute top-0 right-0">
      <div className="flex gap-2 sm:gap-3">
        <Badge
          variant={isOnShelf ? "default" : "secondary"}
          className={`${
            isOnShelf
              ? "border border-badge-owned-border bg-badge-owned text-primary"
              : "bg-badge-not-on-shelf text-badge-not-on-shelf-foreground border-badge-not-on-shelf-border"
          } font-medium rounded-md`}
        >
          {isOnShelf ? "Na półce" : "Poza półką"}
        </Badge>
        {isOnShelf && readingStatus && (
          <Badge
            variant="secondary"
            className={`${statusConfig[readingStatus].color} rounded-md font-medium flex items-center gap-1`}
          >
            {React.createElement(statusConfig[readingStatus].icon, {
              className: "w-3 h-3",
            })}
            {statusConfig[readingStatus].label}
          </Badge>
        )}
      </div>
    </div>
  );
}
