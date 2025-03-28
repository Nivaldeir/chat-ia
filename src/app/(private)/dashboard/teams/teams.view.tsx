"use client"
import { ColumnFiltersState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState } from "@tanstack/react-table"
import { useState } from "react"
import { teams_column } from "./_components/columns"
import { Prisma, User } from "@prisma/client"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/data-table"

type Props = {
  teams: Prisma.TeamGetPayload<{
    include: {
      assistant: true,
      users: {
        select: {
          _count: true
        }
      }
    }
  }>[]
}
export const TeamView = ({ teams }: Props) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data: teams ?? [],
    columns: teams_column,
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
          <h1 className="text-2xl text-black font-bold">Usuarios</h1>
        </div>
        <div>
          <div className="flex gap-2">
            <Input placeholder="Pesquisar" />
          </div>
        </div>
      </header>
      {teams && <DataTable table={table} />}
    </section>
  )
}