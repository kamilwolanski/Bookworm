'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const ShelfSwitch = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const myShelf = searchParams.get('myshelf') === 'true';

  const handleChange = (checked: boolean) => {
    const params = new URLSearchParams(searchParams.toString());

    if (checked) {
      params.set('myshelf', 'true');
      params.set('page', '1');
    } else {
      params.delete('myshelf');
      params.delete('page');
    }

    const query = params.toString();
    const next = query ? `${pathname}?${query}` : pathname;

    router.replace(next, { scroll: false });
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch id="on-shelf" checked={myShelf} onCheckedChange={handleChange} />
      <Label htmlFor="on-shelf">Na półce</Label>
    </div>
  );
};

export default ShelfSwitch;
