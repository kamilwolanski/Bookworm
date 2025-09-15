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
import AddBookForm from '@/components/admin/book/AddBookForm';
import { GenreDTO } from '@/lib/userbooks';

const AddBookDialog = ({ bookGenres }: { bookGenres: GenreDTO[] }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer self-start">Dodaj książkę +</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[825px]">
        <DialogHeader>
          <DialogTitle>Dodaj nową książkę</DialogTitle>
          <DialogDescription>
            Wypełnij poniższy formularz, aby dodać książkę.
          </DialogDescription>
        </DialogHeader>
        <AddBookForm bookGenres={bookGenres} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default AddBookDialog;
