'use client';

import {
  Dispatch,
  SetStateAction,
  startTransition,
  useActionState,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  MoreVertical,
  Pencil,
  ThumbsDown,
  ThumbsUp,
  Trash2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StarRating } from '@/components/book/StarRating';
import { Button } from '@/components/ui/button';
// import { useOptimisticVoteReview } from '@/lib/optimistics/useOptimisticVoteReview';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import RateBookDialog from '@/components/book/ratebook/RateBookDialog';
import DeleteReviewDialog from '@/components/book/bookDetails/DeleteReviewDialog';
import {
  setReviewVoteAction,
  VoteActionPayload,
  VoteActionResult,
} from '@/app/(main)/books/actions/reviewActions';
import { useSession } from 'next-auth/react';
import LoginDialog from '@/components/auth/LoginDialog';
import { ReviewItem, ReviewVotesCount } from '@/lib/reviews';
import { UserBookReviewVote } from '@/lib/user';
import { ReviewVoteType } from '@prisma/client';
import { ActionResult } from '@/types/actions';
import { mutate as swrMutate } from 'swr';

const BookReview = ({
  review,
  isOwner = false,
  setOpenDeleteDialog,
  setOpenReviewDialog,
  userVoteType,
  votes,
  swrVotesKey,
  swrUserVotesKey,
}: {
  bookId: string;
  editionTitle: string;
  review: ReviewItem;
  isOwner?: boolean;
  setOpenDeleteDialog?: Dispatch<SetStateAction<boolean>>;
  setOpenReviewDialog?: Dispatch<SetStateAction<boolean>>;
  userVoteType?: ReviewVoteType | null;
  votes?: ReviewVotesCount;
  swrVotesKey?: (string | string[])[];
  swrUserVotesKey?: (string | string[])[] | null;
}) => {
  const { status } = useSession();
  const [state, doAction, isPending] = useActionState<
    ActionResult<VoteActionResult>,
    VoteActionPayload
  >(setReviewVoteAction, {
    isError: false,
  });
  const createdAtIso = useMemo(
    () =>
      typeof review.createdAt === 'string'
        ? review.createdAt
        : new Date(review.createdAt).toISOString(),
    [review.createdAt]
  );
  console.log('review', review);
  console.log('userVote for comment', userVoteType);

  const likeActive = userVoteType === 'LIKE';
  const dislikeActive = userVoteType === 'DISLIKE';
  const disabled = isOwner;

  const handleLike = useCallback(() => {
    if (disabled) return;

    startTransition(() => {
      doAction({
        reviewId: review.id,
        type: 'LIKE',
      });
    });
  }, [disabled, doAction, review.id]);

  const handleDislike = useCallback(() => {
    if (disabled) return;

    startTransition(() => {
      doAction({
        reviewId: review.id,
        type: 'DISLIKE',
      });
    });
  }, [disabled, doAction, review.id]);

  useEffect(() => {
    if (!isPending && state.status === 'success') {
      swrMutate(swrVotesKey);
      swrMutate(swrUserVotesKey);
    }
  }, [isPending, state, swrUserVotesKey, swrVotesKey]);

  return (
    <div
      className={`border rounded-lg p-4 md:p-6 bg-sidebar shadow-sm mt-5 ${
        isOwner ? 'border-accent-2/50' : 'border-border'
      }`}
      data-pending={'false'}
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
                    {new Date(createdAtIso).toLocaleDateString('pl-PL', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
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
                      if (setOpenReviewDialog) {
                        setOpenReviewDialog(true);
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
                      if (setOpenDeleteDialog) {
                        setOpenDeleteDialog(true);
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
            ? 'Twoja recenzja otrzymała:'
            : 'Czy ta opinia była pomocna?'}
        </span>

        <div className="flex items-center gap-2">
          {status === 'authenticated' ? (
            <Button
              type="button"
              variant="noStyle"
              disabled={disabled}
              size="sm"
              aria-pressed={likeActive}
              aria-label={likeActive ? 'Cofnij lajka' : 'Daj lajka'}
              title={likeActive ? 'Cofnij lajka' : 'Daj lajka'}
              className={`flex items-center gap-1 ${
                likeActive ? 'bg-accent-2 text-accent-foreground-2' : ''
              }`}
              onClick={handleLike}
            >
              <ThumbsUp className="w-4 h-4" aria-hidden="true" />
              <span className="w-1 text-center">{votes?.likes}</span>{' '}
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
                  className="flex items-center gap-1"
                >
                  <ThumbsUp className="w-4 h-4" aria-hidden="true" />
                  <span className="w-1 text-center">0</span>{' '}
                </Button>
              }
            />
          )}

          {status === 'authenticated' ? (
            <Button
              type="button"
              variant="noStyle"
              disabled={disabled}
              size="sm"
              aria-pressed={dislikeActive}
              aria-label={dislikeActive ? 'Cofnij dislajka' : 'Daj dislajka'}
              title={dislikeActive ? 'Cofnij dislajka' : 'Daj dislajka'}
              className={`flex items-center gap-1 ${
                dislikeActive ? 'bg-destructive text-accent-foreground-2' : ''
              }`}
              onClick={handleDislike}
            >
              <ThumbsDown className="w-4 h-4" aria-hidden="true" />
              <span className="w-1 text-center">{votes?.dislikes}</span>
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
                  className="flex items-center gap-1"
                >
                  <ThumbsDown className="w-4 h-4" aria-hidden="true" />
                  <span className="w-1 text-center">0</span>
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
