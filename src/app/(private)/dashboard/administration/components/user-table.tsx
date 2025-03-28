"use client"

import { useState } from "react"
import { CheckCircle2, MoreHorizontal, PencilLine, Search, Trash2, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useFetcher } from "@/hooks/use-fetcher"


type ApiResponse = {
  message: string
  data: any[]
}
export function UserTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const { data } = useFetcher<ApiResponse>(`/api/dashboard/users`)
  const filteredUsers = data?.data.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar usuários..."
            className="h-9 w-[250px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button>Adicionar Usuário</Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox />
              </TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Equipes</TableHead>
              <TableHead>Data de Criação</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.isAdmin ? <Badge variant="default">Admin</Badge> : <Badge variant="outline">Usuário</Badge>}
                </TableCell>
                <TableCell>
                  {user.isActived ? (
                    <div className="flex items-center">
                      <CheckCircle2 className="mr-1 h-4 w-4 text-green-500" />
                      <span>Ativo</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <XCircle className="mr-1 h-4 w-4 text-red-500" />
                      <span>Inativo</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {user?.teams.map((team: any) => (
                      <Badge key={team} variant="secondary" className="mr-1">
                        {team}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString("pt-BR")}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <PencilLine className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        {user.isActived ? (
                          <>
                            <XCircle className="mr-2 h-4 w-4" />
                            Desativar
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Ativar
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

