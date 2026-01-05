'use client';

import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PaginationWithLinks } from '@/components/shared/PaginationWithLinks';
import { Trash2, Pencil } from 'lucide-react';
import { Person } from '@prisma/client';
import { Dialog } from '@/components/ui/dialog';
import { deletePersonAction } from '@/app/(admin)/admin/persons/actions/personActions';
import DeleteDialog from '@/components/shared/DeleteDialog';
import EditPersonDialog from './EditPersonDialog';
import { useRouter } from 'next/navigation';

export default function AdminPersonsTable({
  pageSize,
  page,
  totalCount,
  persons,
}: {
  pageSize: number;
  page: number;
  totalCount: number;
  persons: Person[];
}) {
  const router = useRouter();
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [dialogType, setDialogType] = React.useState<null | 'delete' | 'edit'>(
    null
  );
  const openDialog = dialogType !== null;
  const [clickedRow, setClickedRow] = React.useState<Person | null>(null);

  const columns: ColumnDef<Person>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'id',
      header: 'Id',
      cell: ({ row }) => <div>{row.getValue('id')}</div>,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Name
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'slug',
      header: 'Slug',
      cell: ({ row }) => <div>{row.getValue('slug')}</div>,
    },
    {
      accessorKey: 'createdAt',
      header: 'createdAt',
      cell: ({ row }) => {
        const date = row.getValue('createdAt') as Date;
        return <div>{date.toLocaleString()}</div>;
      },
    },
    {
      accessorKey: 'imageUrl',
      header: 'imageUrl',
      cell: ({ row }) => <div>{row.getValue('imageUrl')}</div>,
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const person = row.original;

        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Akcję</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(person.id)}
                >
                  Skopiuj ID osoby
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="px-2 py-1.5 text-sm flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer"
                  data-no-nav="true"
                  onClick={() => {
                    setDialogType('delete');
                    setClickedRow(person);
                  }}
                >
                  <Trash2 size={16} />
                  Usuń rekord
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="px-2 py-1.5 text-sm flex items-center gap-2 text-secondary focus:text-secondary cursor-pointer"
                  data-no-nav="true"
                  onClick={() => {
                    setDialogType('edit');
                    setClickedRow(person);
                  }}
                >
                  <Pencil size={16} />
                  Zaktualizuj dane
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      },
    },
  ];

  const table = useReactTable({
    data: persons,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualFiltering: true,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4"></div>
      <div className="overflow-hidden shadow rounded-xl px-5 bg-sidebar text-sidebar-foreground">
        <Dialog
          open={openDialog}
          onOpenChange={(o) => !o && setDialogType(null)}
        >
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="text-sidebar-foreground"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className="border-b transition-colors "
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Brak wyników
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {dialogType === 'delete' && clickedRow && (
            <DeleteDialog
              id={clickedRow.id}
              removeAction={deletePersonAction}
              revalidatePath="/admin/persons"
              dialogTitle={
                <>
                  Czy na pewno chcesz usunąć <b>„{clickedRow.name}”</b>
                </>
              }
              onSuccess={() => {
                setClickedRow(null);
                setDialogType(null);
                router.refresh();
              }}
            />
          )}
          {dialogType === 'edit' && clickedRow && (
            <EditPersonDialog
              selectedPublisher={clickedRow}
              onSuccess={() => {
                setClickedRow(null);
                setDialogType(null);
                router.refresh();
              }}
            />
          )}
        </Dialog>
      </div>
      <div className="mt-10">
        <PaginationWithLinks
          page={page}
          pageSize={pageSize}
          totalCount={totalCount}
        />
      </div>
    </div>
  );
}
