'use client';

import { Label } from '@/components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Star } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import * as React from 'react';

export default function UserRatingFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const ratingInParam = searchParams.get('rating');

  const applyParam = (val: string | '') => {
    const next = new URLSearchParams(searchParams.toString());
    if (val === '') next.delete('rating');
    else next.set('rating', val);
    next.set('page', '1');
    router.replace(`?${next.toString()}`);
  };

  const handleOnChange = (val: string) => {
    applyParam(val);
  };

  const handleItemClick = (val: string) => {
    if (ratingInParam === val) {
      applyParam('');
    }
  };

  const options = [
    { value: '4.5', active: 5, label: '(Od 4,5)' },
    { value: '3.5', active: 4, label: '(Od 3,5)' },
    { value: '2.5', active: 3, label: '(Od 2,5)' },
    { value: '1.5', active: 2, label: '(Od 1,5)' },
    { value: '1', active: 1, label: '(Od 1.0)' },
  ];

  return (
    <div className="bg-sidebar shadow-xl rounded-xl px-5 mt-8">
      <Accordion type="single" collapsible defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger className="cursor-pointer hover:no-underline">
            Ocena
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-5">
              <RadioGroup value={ratingInParam} onValueChange={handleOnChange}>
                {options.map(({ value, active, label }) => {
                  const id = `rating-filter-${value}`;
                  return (
                    <div key={value} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={value}
                        id={id}
                        onClick={() => handleItemClick(value)} // „odklik”
                        onKeyDown={(e) => {
                          if (
                            (e.key === 'Enter' || e.key === ' ') &&
                            ratingInParam === value
                          ) {
                            e.preventDefault();
                            applyParam('');
                          }
                        }}
                      />
                      <Label
                        htmlFor={id}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Star
                            key={n}
                            className={`w-4 h-4 ${n <= active ? 'fill-current text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                        <span className="font-normal">{label}</span>
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
