'use client';

import { MediaFormat, Review } from '@prisma/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StarRating } from '../StarRating';
import { Button } from '@/components/ui/button';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { useState } from 'react';
import RateBookDialog from '../ratebook/RateBookDialog';
import { Badge } from '@/components/ui/badge';
import { PaginationWithLinks } from '@/components/shared/PaginationWithLinks';

const BookReviews = ({
  bookId,
  editionId,
  editionTitle,
  reviews,
  userReview,
  paginationData
}: {
  bookId: string;
  editionId: string;
  editionTitle: string;
  userReview?: {
    editionId: string;
    rating: number | null;
    body: string | null;
  };
  reviews: Array<
    Review & {
      user: { id: string; name: string | null; avatarUrl: string | null };
      edition: {
        id: string;
        language: string | null;
        format: MediaFormat | null;
      };
      isOwner: boolean;
    }
  >;
  paginationData: {
    page: number;
    pageSize: number;
    total: number;
  };
}) => {
  const [helpfulVotes, setHelpfulVotes] = useState(3);
  const [notHelpfulVotes, setNotHelpfulVotes] = useState(1);
  const [userVote, setUserVote] = useState<'helpful' | 'not-helpful' | null>(
    null
  );

  const handleVote = (voteType: 'helpful' | 'not-helpful') => {
    if (userVote === voteType) {
      // Remove vote
      if (voteType === 'helpful') {
        setHelpfulVotes((prev) => prev - 1);
      } else {
        setNotHelpfulVotes((prev) => prev - 1);
      }
      setUserVote(null);
    } else {
      // Add new vote or change vote
      if (userVote) {
        // Change vote
        if (userVote === 'helpful') {
          setHelpfulVotes((prev) => prev - 1);
          setNotHelpfulVotes((prev) => prev + 1);
        } else {
          setNotHelpfulVotes((prev) => prev - 1);
          setHelpfulVotes((prev) => prev + 1);
        }
      } else {
        // New vote
        if (voteType === 'helpful') {
          setHelpfulVotes((prev) => prev + 1);
        } else {
          setNotHelpfulVotes((prev) => prev + 1);
        }
      }
      setUserVote(voteType);
    }
  };
  return (
    <div className="bg-sidebar shadow-lg rounded-xl p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold">Opinie ({paginationData.total})</h3>

        <RateBookDialog
          bookId={bookId}
          editionId={editionId}
          dialogTitle={`Napisz opinie o : ${editionTitle}`}
          userReview={userReview}
        >
          <Button variant="outline" className="bg-sidebar cursor-pointer">
            {userReview ? 'Edytuj swoją opinię' : 'Napisz opinię'}
          </Button>
        </RateBookDialog>
      </div>
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div
            key={review.id}
            className={`border rounded-lg p-6 bg-sidebar shadow-sm mt-5
              ${review.isOwner ? 'border-green-200 bg-green-50/30' : 'border-border'}
              `}
          >
            <div className="flex items-start gap-4 mb-4">
              <Avatar className="w-10 h-10">
                {review.user.avatarUrl ? (
                  <AvatarImage src={review.user.avatarUrl} />
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
                  {new Date(review.createdAt).toLocaleDateString('pl-PL', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
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
                  variant="ghost"
                  disabled={review.isOwner}
                  size="sm"
                  className={`flex items-center gap-1 ${
                    userVote === 'helpful'
                      ? 'bg-green-50 text-green-600'
                      : 'text-gray-500'
                  }`}
                  onClick={() => handleVote('helpful')}
                >
                  <ThumbsUp className="w-4 h-4" />
                  {helpfulVotes}
                </Button>
                <Button
                  variant="ghost"
                  disabled={review.isOwner}
                  size="sm"
                  className={`flex items-center gap-1 ${
                    userVote === 'not-helpful'
                      ? 'bg-red-50 text-red-600'
                      : 'text-gray-500'
                  }`}
                  onClick={() => handleVote('not-helpful')}
                >
                  <ThumbsDown className="w-4 h-4" />
                  {notHelpfulVotes}
                </Button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center py-8 text-muted-foreground">
          Brak opinii. Bądź pierwszy i napisz swoją opinię!
        </p>
      )}

      <PaginationWithLinks
        page={paginationData.page}
        pageSize={paginationData.pageSize}
        totalCount={paginationData.total}
        scrollOnPageChange={false}
      />
    </div>
  );
};

export default BookReviews;
