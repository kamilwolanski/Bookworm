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
import { SearchBar } from '@/components/shared/SearchBar';

const AddBookDialog = ({ bookGenres }: { bookGenres: GenreDTO[] }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer self-start">Dodaj książkę +</Button>
      </DialogTrigger>
      <div className="ms-10 w-2/6">
        <SearchBar placeholder="wyszukaj książke" />
      </div>
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
