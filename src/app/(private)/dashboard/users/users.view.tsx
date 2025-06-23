"use client"
import { ColumnFiltersState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState } from "@tanstack/react-table"
import { useState } from "react"
import { users_column } from "./_components/columns"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/data-table"
import { Prisma } from "@prisma/client"

type Props = {
  users: Prisma.UserGetPayload<{
    include: {
      TokenUsage: true
    }
  }>[]
}
export const UserView = ({ users }: Props) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data: users as any ?? [],
    columns: users_column,
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
    <section className="w-full px-4">
      <header className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl text-black font-bold">Usuários</h1>
        </div>
        <div>
          <div className="flex gap-2">
            <Input placeholder="Pesquisar" />

          </div>
        </div>
      </header>

      {users && <DataTable table={table} />}
    </section>
  )
}