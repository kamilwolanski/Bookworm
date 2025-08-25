import AdminPersonsTable from '@/components/admin/person/AdminPersonsTable';
import { SearchBar } from '@/components/shared/SearchBar';
import { getAllPersons } from '@/lib/persons';
import AddPersonDialog from '@/components/admin/person/AddPersonDialog';

type Props = {
  searchParams?: {
    search?: string;
  };
};

export default async function PersonsPage({ searchParams }: Props) {
  const { search } = searchParams ? await searchParams : {};

  const response = await getAllPersons(search);
  console.log('responses', response);

  return (
    <div className="min-h-full flex flex-col">
      <div className="flex">
        <AddPersonDialog />
        <div className="ms-10 w-full">
          <SearchBar placeholder="wyszukaj osobę" />
        </div>
      </div>

      <div className="flex flex-1">
        <AdminPersonsTable persons={response} />
      </div>
    </div>
  );
}
