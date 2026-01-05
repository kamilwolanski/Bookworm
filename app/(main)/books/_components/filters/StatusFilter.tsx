'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ReadingStatus } from '@prisma/client';

type Props = {
  value?: ReadingStatus[];
  onChange: (value: ReadingStatus[]) => void;
};

const OPTIONS: { id: ReadingStatus; label: string }[] = [
  { id: ReadingStatus.READ, label: 'Przeczytane' },
  { id: ReadingStatus.READING, label: 'Czytam' },
  { id: ReadingStatus.WANT_TO_READ, label: 'Chce przeczytać' },
  { id: ReadingStatus.ABANDONED, label: 'Porzucone' },
];

export default function StatusFilter({
  value = [],
  onChange,
}: Props) {
  const toggle = (status: ReadingStatus) => {
    if (value.includes(status)) {
      onChange(value.filter((s) => s !== status));
    } else {
      onChange([...value, status]);
    }
  };

  const isChecked = (status: ReadingStatus) => value.includes(status);

  return (
    <div className="bg-sidebar shadow-xl rounded-xl px-5 mt-8">
      <Accordion type="single" collapsible defaultValue="status">
        <AccordionItem value="status">
          <AccordionTrigger className="cursor-pointer hover:no-underline">
            Status
          </AccordionTrigger>

          <AccordionContent>
            <div className="flex flex-col gap-5">
              {OPTIONS.map(({ id, label }) => (
                <div key={id} className="flex items-center gap-3">
                  <Checkbox
                    id={`status-${id}`}
                    checked={isChecked(id)}
                    onCheckedChange={() => toggle(id)}
                    className="w-5 h-5 cursor-pointer"
                  />
                  <Label htmlFor={`status-${id}`} className="cursor-pointer">
                    {label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
