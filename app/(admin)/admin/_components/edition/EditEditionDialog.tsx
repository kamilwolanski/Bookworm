'use client';

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { EditionDto } from '@/lib/editions';
import EditEditionForm from './EditEditionForm';

const EditEditionDialog = ({
  bookId,
  bookSlug,
  onSuccess,
  selectedEdition,
}: {
  bookId: string;
  bookSlug: string;
  onSuccess?: () => void;
  selectedEdition: EditionDto;
}) => {
  return (
    <DialogContent className="sm:max-w-[825px]">
      <DialogHeader>
        <DialogTitle>Edytuj wydanie</DialogTitle>
        <DialogDescription>
          Wypełnij poniższy formularz, aby edytować wydanie.
        </DialogDescription>
      </DialogHeader>
      <EditEditionForm
        bookId={bookId}
        bookSlug={bookSlug}
        onSuccess={onSuccess}
        edition={selectedEdition}
      />
    </DialogContent>
  );
};

export default EditEditionDialog;
