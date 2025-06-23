import { ReadingStatus } from '@prisma/client';
import { BookCheck, BookOpen, BookX, Bookmark } from 'lucide-react';

const readingStatusVisualMap = {
  [ReadingStatus.WANT_TO_READ]: {
    label: 'Chcę przeczytać',
    icon: Bookmark,
    color: 'text-gray-500',
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
}

export function BookStatus({ status }: BookStatusProps) {
  const { label, icon: Icon, color } = readingStatusVisualMap[status];

  return (
    <div className="flex items-center gap-2">
      <Icon className={`w-8 h-8 ${color}`} />
      <span className={`text-lg font-semibold ${color}`}>{label}</span>
    </div>
  );
}
