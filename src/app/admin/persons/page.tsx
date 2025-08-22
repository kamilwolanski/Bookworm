import AddPersonForm from '@/components/admin/AddPersonForm';
import AdminPersonsTable from '@/components/admin/AdminPersonsTable';
import { SearchBar } from '@/components/shared/SearchBar';

import { getAllPersons } from '@/lib/persons';

export default async function PersonsPage() {
  const response = await getAllPersons();
  console.log('responses', response);

  return (
    <div className="min-h-full flex flex-col">
      <div className="flex">
        <AddPersonForm />
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
