'use client';

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Publisher } from '@prisma/client';
import EditPublisherForm from './EditPublisherForm';

export default function EditPublisherDialog({
  onSuccess,
  selectedPublisher,
}: {
  onSuccess?: () => void;
  selectedPublisher: Publisher;
}) {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Edytuj wydawcę</DialogTitle>
        <DialogDescription>
          Wypełnij poniższy formularz, aby zaktualizować dane wydawcy
        </DialogDescription>
      </DialogHeader>
      <EditPublisherForm onSuccess={onSuccess} publisher={selectedPublisher} />
    </DialogContent>
  );
}
