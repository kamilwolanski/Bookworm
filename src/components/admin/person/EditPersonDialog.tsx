'use client';

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Person } from '@prisma/client';
import EditPersonForm from '@/components/admin/person/EditPersonForm';

export default function EditPersonDialog({
  onSuccess,
  selectedPublisher,
}: {
  onSuccess?: () => void;
  selectedPublisher: Person;
}) {
  return (
    <DialogContent className="sm:max-w-[825px]">
      <DialogHeader>
        <DialogTitle>Edytuj osobę</DialogTitle>
        <DialogDescription>
          Wypełnij poniższy formularz, aby zaktualizować dane osoby
        </DialogDescription>
      </DialogHeader>
      <EditPersonForm onSuccess={onSuccess} person={selectedPublisher} />
    </DialogContent>
  );
}
