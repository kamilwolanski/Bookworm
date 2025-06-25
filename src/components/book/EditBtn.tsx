'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { ReactNode, useState } from 'react';
import EditBookForm from './EditBookForm';
import { BookDTO, GenreDTO } from '@/lib/books';

const EditBtn = ({
  bookGenres,
  bookData,
  children,
}: {
  bookGenres: GenreDTO[];
  bookData: BookDTO;
  children: ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const closeDialog = () => setOpen(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edytuj książkę</DialogTitle>
          <DialogDescription>
            Zaktualizuj informacje o książce, takie jak tytuł, autor, liczba
            stron czy ocena.
          </DialogDescription>
        </DialogHeader>
        <EditBookForm
          closeDialog={closeDialog}
          bookGenres={bookGenres}
          bookData={bookData}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditBtn;
