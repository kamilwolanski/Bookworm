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
import { BookBasicDTO } from '@/lib/books';
import { PaginationWithLinks } from '@/components/shared/PaginationWithLinks';
import { Trash2, Pencil } from 'lucide-react';
import DeleteBtn from '@/components/forms/DeleteBookBtn';
import EditBtn from '@/components/shared/EditBtn';
import { deleteBookAction } from '@/app/admin/books/actions/bookActions';
import { GenreDTO } from '@/lib/userbooks';

export default function AdminBooksTable({
  books,
  pageSize,
  page,
  totalCount,
  bookGenres,
}: {
  books: BookBasicDTO[];
  pageSize: number;
  page: number;
  totalCount: number;
  bookGenres: GenreDTO[];
}) {
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const columns: ColumnDef<BookBasicDTO>[] = [
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
      cell: ({ row }) => <div className="capitalize">{row.getValue('id')}</div>,
    },
    {
      accessorKey: 'title',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Title
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue('title')}</div>,
    },
    {
      accessorKey: 'author',
      header: 'Author',
      cell: ({ row }) => <div>{row.getValue('author')}</div>,
    },
    {
      accessorKey: 'imageUrl',
      header: 'Image Url',
      cell: ({ row }) => <div>{row.getValue('imageUrl') ?? 'None'}</div>,
    },
    {
      accessorKey: 'addedAt',
      header: 'Added At',
      cell: ({ row }) => {
        const date = row.getValue('addedAt') as Date;
        return <div>{date.toLocaleString()}</div>;
      },
    },

    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const book = row.original;

        return (
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
                onClick={() => navigator.clipboard.writeText(book.id)}
              >
                Skopiuj ID książki
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DeleteBtn
                bookId={book.id}
                removeBookAction={deleteBookAction}
                revalidatePath="/admin/books"
                dialogTitle={
                  <>
                    Czy na pewno chcesz usunąć <b>„{book.title}”</b> ze zbioru
                    książek?
                  </>
                }
              >
                <div className="cursor-pointer px-2 py-1.5 text-sm hover:bg-muted flex items-center gap-2">
                  Usuń
                  <Trash2 size={16} />
                </div>
              </DeleteBtn>
              <EditBtn bookGenres={bookGenres} bookData={book}>
                <span className="cursor-pointer px-2 py-1.5 text-sm hover:bg-muted flex items-center gap-2">
                  Edytuj
                  <Pencil size={16} />
                </span>
              </EditBtn>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: books,
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
  const selectedIds = table
    .getSelectedRowModel()
    .rows.map((row) => row.original.id);
  console.log('selectedIds', selectedIds);
  return (
    <div className="w-full">
      <div className="flex items-center py-4"></div>
      <div className="overflow-hidden bg-[#1A1D24] shadow rounded-xl px-5">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-white">
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
                  className="hover:bg-black data-[state=selected]:bg-black border-b transition-colors text-white"
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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
