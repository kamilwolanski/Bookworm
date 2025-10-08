import AdminPersonsTable from '@/components/admin/person/AdminPersonsTable';
import { getAllPersons } from '@/lib/persons';
import AddPersonDialog from '@/components/admin/person/AddPersonDialog';

type Props = {
  searchParams?: Promise<{
    page?: string;
    search?: string;
  }>;
};

const ITEMS_PER_PAGE = 16;

export default async function PersonsPage({ searchParams }: Props) {
  const { page, search } = searchParams ? await searchParams : {};
  const currentPage = parseInt(page || '1', 10);
  const response = await getAllPersons(currentPage, ITEMS_PER_PAGE, search);

  return (
    <div className="min-h-full flex flex-col">
      <div className="flex">
        <AddPersonDialog />
      </div>

      <div className="flex flex-1">
        <AdminPersonsTable
          persons={response.persons}
          pageSize={ITEMS_PER_PAGE}
          page={currentPage}
          totalCount={response.totalCount}
        />
      </div>
    </div>
  );
}
