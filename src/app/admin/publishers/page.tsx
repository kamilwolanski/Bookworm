import AdminPublishersTable from '@/components/admin/publisher/AdminPublishersTable';
import AddPublisherDialog from '@/components/admin/publisher/AddPublisherDialog';
import { getAllPublishers } from '@/lib/admin/publishers';

type Props = {
  searchParams?: Promise<{
    page?: string;
    search?: string;
  }>;
};

const ITEMS_PER_PAGE = 16;

export default async function PublishersPage({ searchParams }: Props) {
  const { page, search } = searchParams ? await searchParams : {};
  const currentPage = parseInt(page || '1', 10);
  const response = await getAllPublishers(currentPage, ITEMS_PER_PAGE, search);

  return (
    <div className="min-h-full flex flex-col">
      <div className="flex">
        <AddPublisherDialog />
      </div>

      <div className="flex flex-1">
        <AdminPublishersTable
          publishers={response.publishers}
          pageSize={ITEMS_PER_PAGE}
          page={currentPage}
          totalCount={response.totalCount}
        />
      </div>
    </div>
  );
}
