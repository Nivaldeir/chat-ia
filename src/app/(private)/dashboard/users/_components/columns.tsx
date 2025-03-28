'use client'
import { Badge } from "@/components/ui/badge"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useModal } from "@/contexts/modal";

type Input = Prisma.UserGetPayload<{
  include: {
    TokenUsage: true
  }
}>

export const users_column: ColumnDef<Input>[] = [
  {
    accessorKey: 'image',
    header: () => <div className="text-center uppercase text-[11px] w-10 h-10"></div>,
    cell: ({ row }) => (
      <Avatar style={{ width: '40px', height: '40px' }}>
        <AvatarImage src={row.original.image || '/path/to/default/avatar.png'} alt={row.original.name || 'Usuário'} />
        <AvatarFallback>{row.original.name?.charAt(0) || 'U'}</AvatarFallback>
      </Avatar>
    ),
  },
  {
    accessorKey: 'name',
    header: () => <div className="text-center uppercase text-[11px]">Nome</div>,
    cell: ({ row }) => <div className="text-center text-[11px] font-medium">{row.original?.name}</div>,
  },
  {
    accessorKey: 'email',
    header: () => <div className="text-center uppercase text-[11px]">Email</div>,
    cell: ({ row }) => <div className="text-center text-[11px] font-medium">{row.original?.email}</div>,
  },
  {
    accessorKey: 'utilizado',
    header: () => <div className="text-center justify-center flex uppercase text-[11px]">Gasto</div>,
    cell: ({ row }) => {
      const ammount = row.original.TokenUsage.reduce((acc, data) => {
        return acc + data.price
      }, 0)
      return (
        <div className='flex justify-center'>{ammount.toLocaleString("pt-BR", {
          currency: "BRL", style: "currency"
        })}</div >
      )
    },
  },
  {
    accessorKey: 'status',
    header: () => <div className="text-center justify-center flex uppercase text-[11px]">Status</div>,
    cell: ({ row }) => {
      let status = {
        label: 'Disponivel',
        color: 'bg-green-600'
      }
      if (!row.original.isActived) {
        status = {
          label: 'Indisponivel',
          color: 'bg-yellow-600'
        }
      }
      return (
        <div className='flex justify-center'>
          <Badge className={`flex justify-center ${status.color}`}>{status.label}</Badge>
        </div >
      )
    },
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
              <DropdownMenuItem className="cursor-pointer">Expulsar</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
