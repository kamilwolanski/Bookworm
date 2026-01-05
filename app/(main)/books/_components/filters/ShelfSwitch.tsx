'use client';

import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

type Props = {
  value?: boolean;
  onChange: (value: boolean) => void;
  showLabel?: boolean;
};

export default function ShelfSwitch({
  value = false,
  onChange,
  showLabel = true,
}: Props) {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="on-shelf"
        checked={value}
        onCheckedChange={onChange}
      />
      {showLabel && <Label htmlFor="on-shelf">Na półce</Label>}
    </div>
  );
}
