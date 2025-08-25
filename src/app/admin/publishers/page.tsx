import AdminPublishersTable from '@/components/admin/publisher/AdminPublishersTable';
import { SearchBar } from '@/components/shared/SearchBar';
import { getAllPublishers } from '@/lib/publishers';
import AddPublisherDialog from '@/components/admin/publisher/AddPublisherDialog';

type Props = {
  searchParams?: {
    search?: string;
  };
};

export default async function PublishersPage({ searchParams }: Props) {
  const { search } = searchParams ? await searchParams : {};
  const response = await getAllPublishers(search);

  return (
    <div className="min-h-full flex flex-col">
      <div className="flex">
        <AddPublisherDialog />
        <div className="ms-10 w-full">
          <SearchBar placeholder="wyszukaj wydawcę" />
        </div>
      </div>

      <div className="flex flex-1">
        <AdminPublishersTable publishers={response} />
      </div>
    </div>
  );
}
