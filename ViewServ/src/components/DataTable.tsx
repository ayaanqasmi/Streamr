"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import useAuthToken from "@/hooks/useAuthToken"

export type Videos = {
  id: number
  thumbnail: string
  title: string
}

export const columns: ColumnDef<Videos>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
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
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => <div className="capitalize">{row.getValue("title")}</div>,
  },
  {
    accessorKey: "thumbnail",
    header: "Thumbnail",
    cell: ({ row }) => (
      <img src={`data:image/jpeg;base64,${row.getValue("thumbnail")}`} alt={row.getValue("title")} className="w-16 h-16" />
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const video = row.original; // Get the original video data
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                // Replace with actual watch video functionality
                window.location.href = `/video/${video.id}`;
                console.log(`Watching video with ID: ${video.id}`);
              }}
            >
              Watch video
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                // Replace with actual edit video functionality
                console.log(`Editing video with ID: ${video.id}`);
              }}
            >
              Edit video
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false, // Disable sorting for actions column
  },
]

export function DataTableDemo() {
  const [videos, setVideos] = React.useState([])
  const token = useAuthToken()
  console.log(token)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [selectedIds, setSelectedIds] = React.useState<number[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
 
  React.useEffect(() => {
    setSelectedIds(Object.keys(rowSelection).map(id => parseInt(id)));
  }, [rowSelection]);
  React.useEffect(() => {
    const fetchData = async () => {
      
      try {
        // const data = await FetchApi(`search?part=snippet&q=${selectedCategory}`);
        const data = await fetch(process.env.NEXT_PUBLIC_STORAGE_API_BASE_URL+"api/storage/videos/my", {
          method: "GET",
          headers: {
            'Authorization': token
          }
        })
        const vids = await data.json()
        console.log(vids);
        setVideos(vids);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    
    };
    fetchData();
  }, [token])
  const handleDeleteSelected = async () => {
    if (selectedIds.length > 0) {
      setIsLoading(true);
      try {
        const selectedVideosIds = selectedIds.map(index => videos[index].id);
        console.log(selectedVideosIds);
        const response = await fetch(process.env.NEXT_PUBLIC_STORAGE_API_BASE_URL + 'api/storage/delete/my', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          },
          body: JSON.stringify(selectedVideosIds),
        });
        if (response.ok) {
          console.log('Selected videos deleted successfully');
          alert("Selected videos deleted successfully");
          const data = await fetch(process.env.NEXT_PUBLIC_STORAGE_API_BASE_URL + "api/storage/videos/my", {
            method: "GET",
            headers: {
              'Authorization': token
            }
          });
          const vids = await data.json();
          setVideos(vids);
          setSelectedIds([]);
        } else {
          console.error('Failed to delete selected videos');
        }
      } catch (error) {
        console.error('Error deleting selected videos:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const table = useReactTable({
    data: videos,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <h1 className="text-2xl">Your videos</h1>
        <div className="flex-1 text-sm text-muted-foreground text-right">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteSelected}
            disabled={selectedIds.length === 0 || isLoading}
          >
            {isLoading ? "Deleting..." : "Delete selected"}
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
