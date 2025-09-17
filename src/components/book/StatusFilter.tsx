'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { ReadingStatus } from '@prisma/client';

const StatusFilter = () => {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const [selectedStatuses, setSelectedStatuses] = useState<ReadingStatus[]>(
    (params.get('status')?.toUpperCase().split(',') as ReadingStatus[]) ?? []
  );
  const router = useRouter();

  const handleOnChange = (id: ReadingStatus) => {
    console.log('weszlo');
    const updatedStatuses = selectedStatuses.includes(id)
      ? selectedStatuses.filter((item) => item !== id)
      : [...selectedStatuses, id];

    const newParams = new URLSearchParams(searchParams.toString());

    if (updatedStatuses.length > 0) {
      newParams.set('status', updatedStatuses.join(',').toLowerCase());
      newParams.set('page', '1');
    } else {
      newParams.delete('status');
      newParams.set('page', '1');
    }

    setSelectedStatuses(updatedStatuses);
    router.push(`?${newParams.toString()}`);
  };

  const isChecked = (id: ReadingStatus) => {
    return selectedStatuses.includes(id);
  };

  return (
    <div className="bg-sidebar shadow-xl rounded-xl px-5 mt-8">
      <Accordion type="single" collapsible defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger className="cursor-pointer hover:no-underline">
            Status
          </AccordionTrigger>

          <AccordionContent className="">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <Checkbox
                  id={ReadingStatus.READ}
                  className="data-[state=checked]:border-border w-5 h-5 cursor-pointer"
                  onClick={() => handleOnChange(ReadingStatus.READ)}
                  checked={isChecked(ReadingStatus.READ)}
                />
                <Label htmlFor={ReadingStatus.READ}>Przeczytane</Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id={ReadingStatus.READING}
                  className="data-[state=checked]:border-border w-5 h-5 cursor-pointer"
                  onClick={() => handleOnChange(ReadingStatus.READING)}
                  checked={isChecked(ReadingStatus.READING)}
                />
                <Label htmlFor={ReadingStatus.READING}>Czytam</Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id={ReadingStatus.WANT_TO_READ}
                  className="data-[state=checked]:border-border w-5 h-5 cursor-pointer"
                  onClick={() => handleOnChange(ReadingStatus.WANT_TO_READ)}
                  checked={isChecked(ReadingStatus.WANT_TO_READ)}
                />
                <Label htmlFor={ReadingStatus.WANT_TO_READ}>
                  Chce przeczytać
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id={ReadingStatus.ABANDONED}
                  className="data-[state=checked]:border-border w-5 h-5 cursor-pointer"
                  onClick={() => handleOnChange(ReadingStatus.ABANDONED)}
                  checked={isChecked(ReadingStatus.ABANDONED)}
                />
                <Label htmlFor={ReadingStatus.ABANDONED}>Porzucone</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default StatusFilter;
