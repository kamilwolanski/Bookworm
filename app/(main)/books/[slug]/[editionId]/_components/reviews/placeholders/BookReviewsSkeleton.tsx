import { Skeleton } from "@/components/ui/skeleton";
import BookReviewSkeleton from "./BookReviewSkeleton";

const BookReviewsSkeleton = () => {
  return (
    <div className="bg-sidebar shadow-lg rounded-xl p-4 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-9 w-36 rounded-md" />
      </div>

      {Array.from({ length: 2 }).map((_, i) => (
        <BookReviewSkeleton key={i} />
      ))}

      <div className="mt-8 flex justify-center gap-2">
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
    </div>
  );
};

export default BookReviewsSkeleton;
