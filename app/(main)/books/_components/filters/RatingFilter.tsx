'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';

type RatingOption = {
  value: string;
  active: number;
  label: string;
};

const OPTIONS: RatingOption[] = [
  { value: '4.5', active: 5, label: '(Od 4,5)' },
  { value: '3.5', active: 4, label: '(Od 3,5)' },
  { value: '2.5', active: 3, label: '(Od 2,5)' },
  { value: '1.5', active: 2, label: '(Od 1,5)' },
  { value: '1', active: 1, label: '(Od 1.0)' },
];

type Props = {
  value?: string;
  onChange: (value?: string) => void;
};

export default function RatingFilter({ value, onChange }: Props) {
  return (
    <div className="bg-sidebar shadow-xl rounded-xl px-5 mt-8">
      <Accordion type="single" collapsible defaultValue="rating">
        <AccordionItem value="rating">
          <AccordionTrigger className="cursor-pointer hover:no-underline">
            Ocena
          </AccordionTrigger>

          <AccordionContent>
            <RadioGroup
              value={value ?? ''}
              onValueChange={(v) => onChange(v || undefined)}
              className="flex flex-col gap-5"
            >
              {OPTIONS.map(({ value: optionValue, active, label }) => {
                const id = `rating-filter-${optionValue}`;

                return (
                  <div key={optionValue} className="flex items-center space-x-2">
                    <RadioGroupItem id={id} value={optionValue} onClick={() => onChange('')} />

                    <Label
                      htmlFor={id}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          className={`h-4 w-4 ${
                            n <= active
                              ? 'fill-current text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="font-normal">{label}</span>
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
