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
import AddEditionForm from '@/components/admin/edition/AddEditionForm';
import { SearchBar } from '@/components/shared/SearchBar';

const AddEditionDialog = ({
  bookId,
  bookSlug,
  bookTitle,
}: {
  bookId: string;
  bookSlug: string;
  bookTitle: string;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer self-start">Dodaj wydanie +</Button>
      </DialogTrigger>
      <div className="ms-10 w-2/6">
        <SearchBar placeholder="wyszukaj wydanie" />
      </div>
      <DialogContent className="sm:max-w-[825px]">
        <DialogHeader>
          <DialogTitle>Dodaj nowe wydanie książki: {bookTitle}</DialogTitle>
          <DialogDescription>
            Wypełnij poniższy formularz, aby dodać nowe wydanie.
          </DialogDescription>
        </DialogHeader>
        <AddEditionForm bookId={bookId} bookSlug={bookSlug} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default AddEditionDialog;
