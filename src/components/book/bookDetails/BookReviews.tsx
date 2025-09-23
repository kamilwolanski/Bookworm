'use client';

import { MediaFormat, Review } from '@prisma/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StarRating } from '../StarRating';
import { Button } from '@/components/ui/button';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { useState } from 'react';

const BookReviews = ({
  reviews,
  totalReviews,
}: {
  reviews: Array<
    Review & {
      user: { id: string; name: string | null; avatarUrl: string | null };
      edition: {
        id: string;
        language: string | null;
        format: MediaFormat | null;
      };
    }
  >;
  totalReviews: number;
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
      <h3 className="font-semibold">Opinie ({totalReviews})</h3>
      {reviews.map((review) => (
        <div
          key={review.id}
          className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm mt-5"
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
                <h4 className="font-medium text-gray-900">
                  {review.user.name}
                </h4>
                <StarRating rating={review.rating ?? 0} size="sm" />
              </div>
              <p className="text-sm text-gray-500">
                {new Date(review.createdAt).toLocaleDateString('pl-PL', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          <p className="text-gray-700 mb-4 leading-relaxed">{review.body}</p>

          <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
            <span className="text-sm text-gray-600">
              Was this review helpful?
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
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
      ))}
    </div>
  );
};

export default BookReviews;
