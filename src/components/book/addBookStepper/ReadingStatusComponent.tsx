import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FormField, FormItem } from '@/components/ui/form';
import { useFormContext } from 'react-hook-form';
import { StatusInput } from '@/lib/validations/addBookToShelfValidation';
import {
  BookmarkPlus,
  BookOpen,
  CheckCircle,
  LucideIcon,
  XCircle,
} from 'lucide-react';

const ReadingStatusComponent = () => {
  const form = useFormContext<StatusInput>();

  const readingStatuses: {
    value: 'WANT_TO_READ' | 'READING' | 'READ' | 'ABANDONED';
    label: string;
    color: string;
    icon: LucideIcon;
  }[] = [
    {
      value: 'WANT_TO_READ',
      label: 'Chcę przeczytać',
      color: 'text-blue-500',
      icon: BookmarkPlus,
    },
    {
      value: 'READING',
      label: 'Czytam',
      color: 'text-yellow-500',
      icon: BookOpen,
    },
    {
      value: 'READ',
      label: 'Przeczytane',
      color: 'text-green-500',
      icon: CheckCircle,
    },
    {
      value: 'ABANDONED',
      label: 'Porzucona',
      color: 'text-red-500',
      icon: XCircle,
    },
  ] as const;

  return (
    <>
      <FormField
        control={form.control}
        name="readingStatus"
        render={({ field }) => (
          <FormItem>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex"
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 w-full gap-2">
                {readingStatuses.map((rStatus) => {
                  const { value, icon: Icon, label, color } = rStatus;
                  const radioId = `readingStatus-${value}`;
                  const isSelected = field.value === value;
                  return (
                    <Label
                      key={radioId}
                      htmlFor={radioId}
                      className={`flex flex-col flex-1 border rounded-md p-3 cursor-pointer ${isSelected ? 'border-primary bg-primary/20' : 'border-muted bg-white/50'}`}
                    >
                      <RadioGroupItem
                        id={radioId}
                        value={value}
                        className="hidden"
                        type="button"
                      />
                      <Icon size={25} className={color} />
                      <span className="text-center mt-5 text-dialog-foreground">
                        {label}
                      </span>
                    </Label>
                  );
                })}
              </div>
            </RadioGroup>
          </FormItem>
        )}
      />
    </>
  );
};

export default ReadingStatusComponent;
