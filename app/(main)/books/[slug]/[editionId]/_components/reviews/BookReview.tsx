"use client";

import {
  Dispatch,
  SetStateAction,
  startTransition,
  useActionState,
  useCallback,
  useMemo,
} from "react";
import {
  MoreVertical,
  Pencil,
  ThumbsDown,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StarRating } from "@/components/book/starRating/StarRating";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  setReviewVoteAction,
  VoteActionPayload,
  VoteActionResult,
} from "@/app/(main)/books/actions/reviewActions";
import LoginDialog from "@/components/auth/LoginDialog";
import { GetBookReviewsResult, ReviewItem } from "@/lib/reviews";
import { UserBookReviewVote } from "@/lib/user";
import { ReviewVoteType } from "@prisma/client";
import { ActionResult } from "@/types/actions";
import { useSWRConfig } from "swr";
import { getReviewsKey } from "@/app/hooks/books/reviews/useReviews";

const BookReview = ({
  review,
  isOwner = false,
  setDeleteReviewId,
  setEditReviewId,
  userVoteType,
  swrUserVotesKey,
  isLogIn,
  bookSlug,
  currentPage,
  loadingUserVotes,
}: {
  review: ReviewItem;
  isOwner?: boolean;
  setDeleteReviewId?: Dispatch<SetStateAction<string | null>>;
  setEditReviewId?: Dispatch<SetStateAction<string | null>>;
  userVoteType?: ReviewVoteType | null;
  swrUserVotesKey?: (string | string[])[] | null;
  isLogIn: boolean;
  bookSlug: string;
  currentPage: number;
  loadingUserVotes?: boolean;
}) => {
  const { mutate: globalMutate } = useSWRConfig();
  const [, doAction, isPending] = useActionState<
    ActionResult<VoteActionResult>,
    VoteActionPayload
  >(setReviewVoteAction, {
    isError: false,
  });
  const createdAtIso = useMemo(
    () =>
      typeof review.createdAt === "string"
        ? review.createdAt
        : new Date(review.createdAt).toISOString(),
    [review.createdAt]
  );
  const likeActive = userVoteType === "LIKE";
  const dislikeActive = userVoteType === "DISLIKE";
  const disabled = isOwner;

  const handleLike = useCallback(async () => {
    const key = getReviewsKey(bookSlug, currentPage);
    if (!key) return;
    if (disabled || isPending) return;
    globalMutate(
      key,
      (current: GetBookReviewsResult | undefined) => {
        if (!current) return current;

        return {
          ...current,
          items: current?.items.map((currentReview) => {
            if (currentReview.id === review.id) {
              return {
                ...currentReview,
                votes: {
                  likes:
                    userVoteType !== "LIKE"
                      ? currentReview.votes.likes + 1
                      : currentReview.votes.likes - 1,
                  dislikes:
                    userVoteType === "DISLIKE"
                      ? currentReview.votes.dislikes - 1
                      : currentReview.votes.dislikes,
                },
              };
            }

            return currentReview;
          }),
        };
      },
      false
    );

    globalMutate(
      swrUserVotesKey,
      (current?: UserBookReviewVote[]) => {
        return current?.map((userVotes) => {
          if (userVotes.reviewId === review.id) {
            return {
              ...userVotes,
              type: userVoteType !== "LIKE" ? ReviewVoteType.LIKE : null,
            };
          }
          return userVotes;
        });
      },
      false
    );
    startTransition(() => {
      doAction({
        reviewId: review.id,
        type: "LIKE",
      });
    });
  }, [
    bookSlug,
    currentPage,
    disabled,
    doAction,
    globalMutate,
    isPending,
    review.id,
    swrUserVotesKey,
    userVoteType,
  ]);

  const handleDislike = useCallback(() => {
    const key = getReviewsKey(bookSlug, currentPage);
    if (!key) return;
    if (disabled || isPending) return;
    globalMutate(
      key,
      (current: GetBookReviewsResult | undefined) => {
        if (!current) return current;

        return {
          ...current,
          items: current?.items.map((currentReview) => {
            if (currentReview.id === review.id) {
              return {
                ...currentReview,
                votes: {
                  dislikes:
                    userVoteType !== "DISLIKE"
                      ? currentReview.votes.dislikes + 1
                      : currentReview.votes.dislikes - 1,
                  likes:
                    userVoteType === "LIKE"
                      ? currentReview.votes.likes - 1
                      : currentReview.votes.likes,
                },
              };
            }

            return currentReview;
          }),
        };
      },
      false
    );

    globalMutate(
      swrUserVotesKey,
      (current?: UserBookReviewVote[]) => {
        return current?.map((userVotes) => {
          if (userVotes.reviewId === review.id) {
            return {
              ...userVotes,
              type: userVoteType !== "DISLIKE" ? ReviewVoteType.DISLIKE : null,
            };
          }
          return userVotes;
        });
      },
      false
    );
    startTransition(() => {
      doAction({
        reviewId: review.id,
        type: "DISLIKE",
      });
    });
  }, [
    bookSlug,
    currentPage,
    disabled,
    doAction,
    globalMutate,
    isPending,
    review.id,
    swrUserVotesKey,
    userVoteType,
  ]);

  return (
    <div
      className={`border rounded-lg p-4 md:p-6 bg-sidebar shadow-sm mt-5 ${
        isOwner ? "border-accent-2/50" : "border-border"
      }`}
      data-pending={"false"}
    >
      <div className="flex items-start gap-4 mb-4">
        <Avatar className="w-10 h-10">
          {review.user.image ? (
            <AvatarImage
              src={review.user.image}
              alt={`Avatar użytkownika ${review.user.name}`}
            />
          ) : (
            <AvatarFallback>{review.user.name}</AvatarFallback>
          )}
        </Avatar>

        <div className="flex-1">
          <div className="flex justify-between">
            <div className="flex items-start gap-3 mb-2">
              <div>
                <h4 className="font-medium">{review.user.name}</h4>
                <p className="text-sm text-muted-foreground">
                  <time dateTime={createdAtIso}>
                    {new Date(createdAtIso).toLocaleDateString("pl-PL", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </time>
                </p>
              </div>
              {isOwner && (
                <Badge className="border border-badge-owned-border bg-badge-owned text-primary font-medium hidden sm:block">
                  Twoja recenzja
                </Badge>
              )}
              <div className="flex flex-col">
                <StarRating rating={review.rating ?? 0} size="sm" />

                {isOwner && (
                  <Badge className="border border-badge-owned-border bg-badge-owned text-primary font-medium sm:hidden align-bottom mt-2">
                    Twoja recenzja
                  </Badge>
                )}
              </div>
            </div>

            {isOwner && (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-5 w-5 -mr-2">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Otwórz menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem
                    onClick={() => {
                      if (setEditReviewId) {
                        setEditReviewId(review.id);
                      }
                    }}
                    className="cursor-pointer"
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edytuj
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive cursor-pointer"
                    onClick={() => {
                      if (setDeleteReviewId) {
                        setDeleteReviewId(review.id);
                      }
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Usuń
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>

      <p className="mb-4 leading-relaxed">{review.body}</p>

      <div className="flex items-center gap-4 pt-2 md:pt-4 border-t border-border">
        <span className="text-sm text-muted-foreground">
          {isOwner
            ? "Twoja recenzja otrzymała:"
            : "Czy ta opinia była pomocna?"}
        </span>

        <div className="flex items-center gap-2">
          {isLogIn ? (
            <Button
              type="button"
              variant="noStyle"
              disabled={disabled || isPending || loadingUserVotes}
              size="sm"
              aria-pressed={likeActive}
              aria-label={likeActive ? "Cofnij lajka" : "Daj lajka"}
              title={likeActive ? "Cofnij lajka" : "Daj lajka"}
              className={`flex items-center gap-1 cursor-pointer ${
                likeActive ? "bg-accent-2 text-accent-foreground-2" : ""
              }`}
              onClick={handleLike}
            >
              <ThumbsUp className="w-4 h-4" aria-hidden="true" />
              <span className="w-1 text-center">{review.votes.likes}</span>{" "}
            </Button>
          ) : (
            <LoginDialog
              dialogTriggerBtn={
                <Button
                  type="button"
                  variant="noStyle"
                  size="sm"
                  aria-label="Daj lajka"
                  title="Daj lajka"
                  className="flex items-center gap-1 cursor-pointer"
                >
                  <ThumbsUp className="w-4 h-4" aria-hidden="true" />
                  <span className="w-1 text-center">
                    {review.votes.likes}
                  </span>{" "}
                </Button>
              }
            />
          )}

          {isLogIn ? (
            <Button
              type="button"
              variant="noStyle"
              disabled={disabled || isPending || loadingUserVotes}
              size="sm"
              aria-pressed={dislikeActive}
              aria-label={dislikeActive ? "Cofnij dislajka" : "Daj dislajka"}
              title={dislikeActive ? "Cofnij dislajka" : "Daj dislajka"}
              className={`flex items-center gap-1 cursor-pointer ${
                dislikeActive ? "bg-destructive text-accent-foreground-2" : ""
              }`}
              onClick={handleDislike}
            >
              <ThumbsDown className="w-4 h-4" aria-hidden="true" />
              <span className="w-1 text-center">{review.votes.dislikes}</span>
            </Button>
          ) : (
            <LoginDialog
              dialogTriggerBtn={
                <Button
                  type="button"
                  variant="noStyle"
                  size="sm"
                  aria-label="Daj dislajka"
                  title="Daj dislajka"
                  className="flex items-center gap-1 cursor-pointer"
                >
                  <ThumbsDown className="w-4 h-4" aria-hidden="true" />
                  <span className="w-1 text-center">
                    {review.votes.dislikes}
                  </span>
                </Button>
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BookReview;
