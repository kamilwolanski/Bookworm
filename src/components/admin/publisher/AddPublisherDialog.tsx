'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import AddPublisherForm from './AddPublisherForm';
import { SearchBar } from '@/components/shared/SearchBar';

export default function AddPublisherDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer self-start">Dodaj wydawcę +</Button>
      </DialogTrigger>
      <div className="ms-10 w-2/6">
        <SearchBar placeholder="wyszukaj wydawcę" />
      </div>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Dodaj nowego wydawcę</DialogTitle>
          <DialogDescription>
            Wypełnij poniższy formularz, aby dodać nowego wydawcę
          </DialogDescription>
        </DialogHeader>
        <AddPublisherForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
