import AddPublisherForm from '@/components/admin/AddPublisherForm';
import AdminPublishersTable from '@/components/admin/AdminPublishersTable';
import { SearchBar } from '@/components/shared/SearchBar';
import { getAllPublishers } from '@/lib/publishers';

export default async function PublishersPage() {
  const response = await getAllPublishers();
  console.log('responses', response);

  return (
    <div className="min-h-full flex flex-col">
      <div className="flex">
        <AddPublisherForm />
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
