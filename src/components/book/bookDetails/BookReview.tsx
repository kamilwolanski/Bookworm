'use client';

import { useCallback, useMemo } from 'react';
import { ReviewItem } from '@/lib/userbooks';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StarRating } from '../StarRating';
import { Button } from '@/components/ui/button';
import { useOptimisticVoteReview } from '@/lib/optimistics/useOptimisticVoteReview';
import { setReviewVoteAction } from '@/app/(main)/books/actions/bookActions';

const BookReview = ({
  review,
  bookSlug,
}: {
  review: ReviewItem;
  bookSlug: string;
}) => {
  const {
    myVoteOptimistic,
    likesOptimistic,
    dislikesOptimistic,
    vote,
    isPending,
  } = useOptimisticVoteReview(review.votes);

  const createdAtIso = useMemo(
    () =>
      typeof review.createdAt === 'string'
        ? review.createdAt
        : new Date(review.createdAt).toISOString(),
    [review.createdAt]
  );

  const likeActive = myVoteOptimistic === 'LIKE';
  const dislikeActive = myVoteOptimistic === 'DISLIKE';
  const disabled = isPending || review.isOwner;

  const handleLike = useCallback(() => {
    if (disabled) return;
    return vote('LIKE', () =>
      setReviewVoteAction({
        reviewId: review.id,
        bookSlug,
        editionId: review.editionId,
        type: 'LIKE',
      })
    );
  }, [disabled, vote, review.id, bookSlug, review.editionId]);

  const handleDislike = useCallback(() => {
    if (disabled) return;
    return vote('DISLIKE', () =>
      setReviewVoteAction({
        reviewId: review.id,
        bookSlug,
        editionId: review.editionId,
        type: 'DISLIKE',
      })
    );
  }, [disabled, vote, review.id, bookSlug, review.editionId]);

  return (
    <div
      className={`border rounded-lg p-6 bg-sidebar shadow-sm mt-5 ${
        review.isOwner ? 'border-green-200 bg-green-50/30' : 'border-border'
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
          <div className="flex items-center gap-3 mb-2">
            <h4 className="font-medium">{review.user.name}</h4>
            {review.isOwner && (
              <Badge className="bg-green-100 text-green-700 border-green-200 font-medium">
                Twoja recenzja
              </Badge>
            )}
            <StarRating rating={review.rating ?? 0} size="sm" />
          </div>
          <p className="text-sm text-muted-foreground">
            <time dateTime={createdAtIso}>
              {new Date(createdAtIso).toLocaleDateString('pl-PL', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </p>
        </div>
      </div>

      <p className="mb-4 leading-relaxed">{review.body}</p>

      <div className="flex items-center gap-4 pt-4 border-t border-border">
        <span className="text-sm text-muted-foreground">
          {review.isOwner
            ? 'Twoja recenzja otrzymała:'
            : 'Czy ta opinia była pomocna?'}
        </span>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            disabled={disabled}
            size="sm"
            aria-pressed={likeActive}
            aria-label={likeActive ? 'Cofnij lajka' : 'Daj lajka'}
            title={likeActive ? 'Cofnij lajka' : 'Daj lajka'}
            className={`flex items-center gap-1 ${
              likeActive ? 'bg-green-50 text-green-600' : 'text-gray-500'
            }`}
            onClick={handleLike}
          >
            <ThumbsUp className="w-4 h-4" aria-hidden="true" />
            {likesOptimistic}
          </Button>

          <Button
            type="button"
            variant="ghost"
            disabled={disabled}
            size="sm"
            aria-pressed={dislikeActive}
            aria-label={dislikeActive ? 'Cofnij dislajka' : 'Daj dislajka'}
            title={dislikeActive ? 'Cofnij dislajka' : 'Daj dislajka'}
            className={`flex items-center gap-1 ${
              dislikeActive ? 'bg-red-50 text-red-600' : 'text-gray-500'
            }`}
            onClick={handleDislike}
          >
            <ThumbsDown className="w-4 h-4" aria-hidden="true" />
            {dislikesOptimistic}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookReview;
