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
import AddPersonForm from '@/components/admin/person/AddPersonForm';

export default function AddPublisherDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer self-start">Dodaj osobę +</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[825px]">
        <DialogHeader>
          <DialogTitle>Dodaj nową osobę</DialogTitle>
          <DialogDescription>
            Wypełnij poniższy formularz, aby dodać nową osobę
          </DialogDescription>
        </DialogHeader>
        <AddPersonForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
