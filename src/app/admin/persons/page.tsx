import AdminPersonsTable from '@/components/admin/person/AdminPersonsTable';
import { SearchBar } from '@/components/shared/SearchBar';
import { getAllPersons } from '@/lib/persons';
import AddPersonDialog from '@/components/admin/person/AddPersonDialog';

export default async function PersonsPage() {
  const response = await getAllPersons();
  console.log('responses', response);

  return (
    <div className="min-h-full flex flex-col">
      <div className="flex">
        <AddPersonDialog />
        <div className="ms-10 w-full">
          <SearchBar />
        </div>
      </div>

      <div className="flex flex-1">
        <AdminPersonsTable persons={response} />
      </div>
    </div>
  );
}
