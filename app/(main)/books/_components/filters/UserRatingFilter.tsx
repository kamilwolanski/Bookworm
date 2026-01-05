'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Star } from 'lucide-react';

type Props = {
  /** Wybrane oceny użytkownika (np. ['5', '3', 'none']) */
  value?: string[];
  /** Callback zmiany – ustawia TYLKO local state */
  onChange: (value: string[]) => void;
};

const OPTIONS = [
  { id: '5', stars: 5 },
  { id: '4', stars: 4 },
  { id: '3', stars: 3 },
  { id: '2', stars: 2 },
  { id: '1', stars: 1 },
  { id: 'none', label: 'Brak oceny' },
];

export default function UserRatingFilter({
  value = [],
  onChange,
}: Props) {
  const toggle = (id: string) => {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
  };

  const isChecked = (id: string) => value.includes(id);

  return (
    <div className="bg-sidebar shadow-xl rounded-xl px-5 mt-8">
      <Accordion type="single" collapsible defaultValue="user-rating">
        <AccordionItem value="user-rating">
          <AccordionTrigger className="cursor-pointer hover:no-underline">
            Twoja Ocena
          </AccordionTrigger>

          <AccordionContent>
            <div className="flex flex-col gap-5">
              {OPTIONS.map((opt) => (
                <div key={opt.id} className="flex items-center gap-3">
                  <Checkbox
                    id={`user-rating-${opt.id}`}
                    checked={isChecked(opt.id)}
                    onCheckedChange={() => toggle(opt.id)}
                    className="w-5 h-5 cursor-pointer"
                  />

                  <Label
                    htmlFor={`user-rating-${opt.id}`}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    {'stars' in opt ? (
                      [1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          className={`h-4 w-4 ${
                            n <= (opt.stars ?? 0)
                              ? 'fill-current text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))
                    ) : (
                      <span>{opt.label}</span>
                    )}
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
