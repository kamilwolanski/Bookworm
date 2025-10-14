'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  MoreVertical,
  Pencil,
  Share2,
  ThumbsDown,
  ThumbsUp,
  Trash2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StarRating } from '@/components/book/StarRating';
import { Button } from '@/components/ui/button';
import { useOptimisticVoteReview } from '@/lib/optimistics/useOptimisticVoteReview';
import { ReviewItem } from '@/lib/reviews';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import RateBookDialog from '@/components/book/ratebook/RateBookDialog';
import { Dialog } from '@/components/ui/dialog';
import DeleteReviewDialog from '@/components/book/bookDetails/DeleteReviewDialog';
import { setReviewVoteAction } from '@/app/(main)/books/actions/reviewActions';

const BookReview = ({
  bookId,
  editionTitle,
  review,
}: {
  bookId: string;
  editionTitle: string;
  review: ReviewItem;
}) => {
  const {
    myVoteOptimistic,
    likesOptimistic,
    dislikesOptimistic,
    vote,
    isPending,
  } = useOptimisticVoteReview(review.votes);
  const [dialogType, setDialogType] = useState<null | 'delete' | 'edit'>(null);
  const openDialog = dialogType !== null;
  const createdAtIso = useMemo(
    () =>
      typeof review.createdAt === 'string'
        ? review.createdAt
        : new Date(review.createdAt).toISOString(),
    [review.createdAt]
  );

  const likeActive = myVoteOptimistic === 'LIKE';
  const dislikeActive = myVoteOptimistic === 'DISLIKE';
  const disabled = review.isOwner;

  const handleLike = useCallback(() => {
    if (disabled) return;
    return vote('LIKE', () =>
      setReviewVoteAction({
        reviewId: review.id,
        type: 'LIKE',
      })
    );
  }, [disabled, review.id, vote]);

  const handleDislike = useCallback(() => {
    if (disabled) return;
    return vote('DISLIKE', () =>
      setReviewVoteAction({
        reviewId: review.id,
        type: 'DISLIKE',
      })
    );
  }, [disabled, review.id, vote]);

  return (
    <div
      className={`border rounded-lg p-4 md:p-6 bg-sidebar shadow-sm mt-5 ${
        review.isOwner ? 'border-accent-2/50' : 'border-border'
      }`}
      data-pending={isPending ? 'true' : 'false'}
    >
      <div className="flex items-start gap-4 mb-4">
        <Avatar className="w-10 h-10">
          {review.user.avatarUrl ? (
            <AvatarImage
              src={review.user.avatarUrl}
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
              {review.isOwner && (
                <Badge className="border border-badge-owned-border bg-badge-owned text-primary font-medium hidden sm:block">
                  Twoja recenzja
                </Badge>
              )}
              <div className="flex flex-col">
                <StarRating rating={review.rating ?? 0} size="sm" />

                {review.isOwner && (
                  <Badge className="border border-badge-owned-border bg-badge-owned text-primary font-medium sm:hidden align-bottom mt-2">
                    Twoja recenzja
                  </Badge>
                )}
              </div>
            </div>

            {review.isOwner && (
              <Dialog
                open={openDialog}
                onOpenChange={(o) => !o && setDialogType(null)}
              >
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 -mr-2"
                    >
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Otwórz menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem
                      onClick={() => {
                        setDialogType('edit');
                      }}
                      className="cursor-pointer"
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edytuj
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share2 className="mr-2 h-4 w-4" />
                      Udostępnij
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive cursor-pointer"
                      onClick={() => {
                        setDialogType('delete');
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Usuń
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                {dialogType === 'delete' && (
                  <DeleteReviewDialog
                    reviewId={review.id}
                    bookId={bookId}
                    onlyContent={true}
                    dialogTitle={<>Czy na pewno chcesz usunąć tę opinię?</>}
                    afterSuccess={() => setDialogType(null)}
                  />
                )}
                {dialogType === 'edit' && (
                  <RateBookDialog
                    bookId={bookId}
                    editionId={review.editionId}
                    dialogTitle={`Edytuj opinie o : ${editionTitle}`}
                    userReview={review}
                    onlyContent={true}
                    afterSuccess={() => setDialogType(null)}
                  />
                )}
              </Dialog>
            )}
          </div>
        </div>
      </div>

      <p className="mb-4 leading-relaxed">{review.body}</p>

      <div className="flex items-center gap-4 pt-2 md:pt-4 border-t border-border">
        <span className="text-sm text-muted-foreground">
          {review.isOwner
            ? 'Twoja recenzja otrzymała:'
            : 'Czy ta opinia była pomocna?'}
        </span>

        <div className="flex items-center gap-2">
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
            <span className="w-1 text-center">{likesOptimistic}</span>{' '}
          </Button>

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
            <span className="w-1 text-center">{dislikesOptimistic}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookReview;
