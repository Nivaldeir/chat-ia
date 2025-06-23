'use client'
import { ColumnDef } from '@tanstack/react-table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Prisma } from "@prisma/client";
import { ListFilterPlus } from 'lucide-react'
import { returnIcon } from "@/components/sidebar/team-switcher";
import { useModal } from "@/contexts/modal";

type Input = Prisma.TeamGetPayload<{
  include: {
    assistant: true,
    users: {
      select: {
        _count: true
      }
    }
  }
}>

export const teams_column: ColumnDef<Input>[] = [
  {
    accessorKey: 'icon',
    header: () => <div className="text-center uppercase text-[11px] w-[50px]">Icone</div>,
    cell: ({ row }) => <div className="text-center text-[11px] font-medium w-[30px] flex justify-center border p-1 rounded-md">{returnIcon(row.original?.icon as any)}</div>,
  },
  {
    accessorKey: 'name',
    header: () => <div className="text-center uppercase text-[11px]">Nome</div>,
    cell: ({ row }) => <div className="text-center text-[11px] font-medium">{row.original?.name}</div>,
  },
  {
    accessorKey: 'assistant',
    header: () => <div className="text-center uppercase text-[11px]">Assistentes</div>,
    cell: ({ row }) => <div className="text-center text-[11px] font-medium">{row.original?.assistant.length}</div>,
  },
  {
    accessorKey: 'user',
    header: () => <div className="text-center uppercase text-[11px]">Usuários</div>,
    cell: ({ row }) => <div className="text-center text-[11px] font-medium">{row.original?.users.length}</div>,
  },
  {
    accessorKey: 'option',
    header: () => <div className="text-center uppercase text-[11px]"></div>,
    cell: ({ row }) => {
      const { setOpen } = useModal();
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild className='text-sidebar-foreground cursor-pointer'>
            <ListFilterPlus size={16} />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Opções</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer">Sair</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
