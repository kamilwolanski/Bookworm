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

export default function AddPublisherDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="text-black cursor-pointer self-start"
        >
          Dodaj wydawcę +
        </Button>
      </DialogTrigger>
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
