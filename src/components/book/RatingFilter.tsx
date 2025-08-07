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
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

const RatingFilter = () => {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const [selectedRatings, setSelectedRatings] = useState<string[]>(
    params.get('rating')?.split(',') ?? []
  );
  const router = useRouter();

  const handleOnChange = (id: string) => {
    const updatedRatings = selectedRatings.includes(id)
      ? selectedRatings.filter((item) => item !== id)
      : [...selectedRatings, id];

    const newParams = new URLSearchParams(searchParams.toString());

    if (updatedRatings.length > 0) {
      newParams.set('rating', updatedRatings.join(','));
      newParams.set('page', '1'); // resetuj tylko przy zmianie ratingu
    } else {
      newParams.delete('rating');
      newParams.set('page', '1'); // nadal resetuj
    }

    setSelectedRatings(updatedRatings);
    router.push(`?${newParams.toString()}`);
  };

  const isChecked = (id: string) => {
    return selectedRatings.includes(id);
  };

  return (
    <div className="bg-[#1A1D24] shadow rounded-xl px-5 mt-8">
      <Accordion type="single" collapsible defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger className="cursor-pointer hover:no-underline">
            Twoja Ocena
          </AccordionTrigger>

          <AccordionContent className="">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="5"
                  className="data-[state=checked]:border-white w-5 h-5 cursor-pointer"
                  onClick={() => handleOnChange('5')}
                  checked={isChecked('5')}
                />
                <Label htmlFor="5">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      className={num <= 5 ? 'text-yellow-400' : 'text-gray-300'}
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  ))}
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="4"
                  className="data-[state=checked]:border-white w-5 h-5 cursor-pointer"
                  onClick={() => handleOnChange('4')}
                  checked={isChecked('4')}
                />
                <Label htmlFor="4">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      className={
                        num <= 4 ? 'text-yellow-400 ' : 'text-gray-300 '
                      }
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  ))}
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="3"
                  className="data-[state=checked]:border-white w-5 h-5 cursor-pointer"
                  onClick={() => handleOnChange('3')}
                  checked={isChecked('3')}
                />
                <Label htmlFor="3">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      className={
                        num <= 3 ? 'text-yellow-400 ' : 'text-gray-300 '
                      }
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  ))}
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="2"
                  className="data-[state=checked]:border-white w-5 h-5 cursor-pointer"
                  onClick={() => handleOnChange('2')}
                  checked={isChecked('2')}
                />
                <Label htmlFor="2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      className={
                        num <= 2 ? 'text-yellow-400 ' : 'text-gray-300 '
                      }
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  ))}
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="1"
                  className="data-[state=checked]:border-white w-5 h-5 cursor-pointer"
                  onClick={() => handleOnChange('1')}
                  checked={isChecked('1')}
                />
                <Label htmlFor="1">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      className={
                        num <= 1 ? 'text-yellow-400 ' : 'text-gray-300 '
                      }
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  ))}
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="none"
                  className="data-[state=checked]:border-white w-5 h-5 cursor-pointer"
                  onClick={() => handleOnChange('none')}
                  checked={isChecked('none')}
                />
                <Label htmlFor="none">Brak oceny</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default RatingFilter;
