'use client';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const ShelfSwitch = () => {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const [myShelf, setmyShelf] = useState(
    params.get('myshelf') === 'true' ? true : false
  );

  const router = useRouter();

  const handleChange = (checked: boolean) => {
    const newParams = new URLSearchParams(searchParams.toString());

    if (checked) {
      newParams.set('myshelf', 'true');
      newParams.set('page', '1');
    } else {
      newParams.delete('myshelf');
    }

    router.push(`?${newParams.toString()}`);
    setmyShelf(checked);
  };
  return (
    <div className="flex items-center space-x-2">
      <Switch id="on-shelf" checked={myShelf} onCheckedChange={handleChange} />
      <Label htmlFor="on-shelf">Na półce</Label>
    </div>
  );
};

export default ShelfSwitch;
