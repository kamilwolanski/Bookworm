import { ReadingStatus } from '@prisma/client';
import { BookCheck, BookOpen, BookX, Bookmark } from 'lucide-react';

const readingStatusVisualMap = {
  [ReadingStatus.WANT_TO_READ]: {
    label: 'Chcę przeczytać',
    icon: Bookmark,
    color: 'text-gray-100',
  },
  [ReadingStatus.READING]: {
    label: 'Czytam',
    icon: BookOpen,
    color: 'text-blue-500',
  },
  [ReadingStatus.READ]: {
    label: 'Przeczytana',
    icon: BookCheck,
    color: 'text-green-600',
  },
  [ReadingStatus.ABANDONED]: {
    label: 'Porzucona',
    icon: BookX,
    color: 'text-red-500',
  },
};

interface BookStatusProps {
  status: ReadingStatus;
  onlyIcon?: boolean;
  onlyText?: boolean;
  textSize?: 'xs' | 'sm' | 'md' | 'lg';
  iconSize?: number;
}

export function BookStatus({
  status,
  onlyIcon = false,
  onlyText = false,
  textSize = 'lg',
  iconSize = 8,
}: BookStatusProps) {
  const { label, icon: Icon, color } = readingStatusVisualMap[status];

  return (
    <div className="flex items-center gap-2">
      {!onlyText && <Icon className={`w-${iconSize} h-${iconSize} ${color}`} />}
      {!onlyIcon && (
        <span className={`text-${textSize} font-semibold ${color}`}>
          {label}
        </span>
      )}
    </div>
  );
}
