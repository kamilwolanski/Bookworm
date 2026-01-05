'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Trash2 } from 'lucide-react';

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
import { Pencil } from 'lucide-react';
import { deleteBookAction } from '@/app/(admin)/admin/books/actions/bookActions';

import { Dialog } from '@/components/ui/dialog';
import { BookBasicDTO } from '@/lib/adminBooks';
import { GenreDTO } from '@/lib/books';
import DeleteDialog from '@/components/shared/DeleteDialog';
import EditBookDialog from './EditBookDialog';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [dialogType, setDialogType] = React.useState<null | 'delete' | 'edit'>(
    null
  );
  const openDialog = dialogType !== null;
  const [clickedRow, setClickedRow] = React.useState<BookBasicDTO | null>(null);

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
      cell: ({ row }) => <div>{row.getValue('id')}</div>,
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
      cell: ({ row }) => {
        return row.original.slug ? (
          <Link
            href={`/admin/books/${row.original.slug}`}
            className="text-link"
          >
            {row.getValue('title')}
          </Link>
        ) : (
          <div>{row.getValue('title')}</div>
        );
      },
    },
    {
      accessorKey: 'authors',
      header: 'Authors',
      cell: ({ row }) => {
        const authors: {
          order: number | null;
          person: {
            id: string;
            name: string;
            slug: string;
          };
        }[] = row.getValue('authors') ?? [];
        return (
          <div className="space-y-1">
            {authors.map((a) => (
              <p key={a.person.id}>{a.person.name}</p>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: 'slug',
      header: 'Slug',
      cell: ({ row }) => {
        return <div>{row.getValue('slug')}</div>;
      },
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
              <DropdownMenuItem
                className="px-2 py-1.5 text-sm flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer"
                data-no-nav="true"
                onClick={() => {
                  setDialogType('delete');
                  setClickedRow(book);
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
                  setClickedRow(book);
                }}
              >
                <Pencil size={16} />
                Zaktualizuj dane
              </DropdownMenuItem>
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
  // const selectedIds = table
  //   .getSelectedRowModel()
  //   .rows.map((row) => row.original.id);
  // console.log('selectedIds', selectedIds);
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
                    className="border-b transition-colors"
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
              removeAction={deleteBookAction}
              revalidatePath="/admin/books"
              dialogTitle={
                <>
                  Czy na pewno chcesz usunąć <b>„{clickedRow.title}”</b>
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
            <EditBookDialog
              selectedBook={clickedRow}
              onSuccess={() => {
                setClickedRow(null);
                setDialogType(null);
                router.refresh();
              }}
              bookGenres={bookGenres}
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
