import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { BookBasicDTO } from '@/lib/admin/books';
import { GenreDTO } from '@/lib/books';
import EditBookForm from './EditBookForm';

const EditBookDialog = ({
  onSuccess,
  selectedBook,
  bookGenres,
}: {
  onSuccess?: () => void;
  selectedBook: BookBasicDTO;
  bookGenres: GenreDTO[];
}) => {
  return (
    <DialogContent className="sm:max-w-[825px]">
      <DialogHeader>
        <DialogTitle>Edytuj książkę</DialogTitle>
        <DialogDescription>
          Wypełnij poniższy formularz, aby edytować książkę.
        </DialogDescription>
      </DialogHeader>
      <EditBookForm
        bookGenres={bookGenres}
        onSuccess={onSuccess}
        book={selectedBook}
      />
    </DialogContent>
  );
};

export default EditBookDialog;
