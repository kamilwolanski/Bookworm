import { Skeleton } from '@/components/ui/skeleton';

const BookReviewSkeleton = () => {
  return (
    <div className="border rounded-lg p-4 md:p-6 bg-sidebar shadow-sm mt-5">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <Skeleton className="h-10 w-10 rounded-full" />

        <div className="flex-1">
          <div className="flex justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>

            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="space-y-2 mb-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-10/12" />
      </div>

      {/* Footer */}
      <div className="flex items-center gap-4 pt-4 border-t border-border">
        <Skeleton className="h-3 w-40" />

        <div className="flex gap-2">
          <Skeleton className="h-8 w-14 rounded-md" />
          <Skeleton className="h-8 w-14 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default BookReviewSkeleton;
