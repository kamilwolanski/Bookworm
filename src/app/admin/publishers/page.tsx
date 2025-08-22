import AdminPublishersTable from '@/components/admin/publisher/AdminPublishersTable';
import { SearchBar } from '@/components/shared/SearchBar';
import { getAllPublishers } from '@/lib/publishers';
import AddPublisherDialog from '@/components/admin/publisher/AddPublisherDialog';

export default async function PublishersPage() {
  const response = await getAllPublishers();
  console.log('responses', response);

  return (
    <div className="min-h-full flex flex-col">
      <div className="flex">
        <AddPublisherDialog />
        <div className="ms-10 w-full">
          <SearchBar />
        </div>
      </div>

      <div className="flex flex-1">
        <AdminPublishersTable publishers={response} />
      </div>
    </div>
  );
}
