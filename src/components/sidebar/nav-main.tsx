"use client"

import { Bot, ChevronRight, LayoutDashboard, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { useFetcher } from "@/hooks/use-fetcher"
import { useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { useEffect } from "react"

type ApiResponse = {
  message: string;
  data: any[]
};

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    isAdmin?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const { data } = useSession()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams.toString())
  const team = params.get("team")
  const teamFind = data?.user.teams.find(t => t.name == team)
  const { data: response } = useFetcher<ApiResponse>(`/api/openai/assistents?team=${team}`);
  useEffect(() => {

  }, [])
  return (
    <SidebarGroup>
      <SidebarGroupLabel>TATICCA</SidebarGroupLabel>
      <SidebarMenu>
        <Collapsible
          asChild
          className="group/collapsible"
        >
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip={"Modelos"}>
                <Bot />
                <Link href={'#'}>{'Modelos'}</Link>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {
                  response?.data.map(e => (
                    <SidebarMenuSubItem key={e.id}>
                      <SidebarMenuSubButton asChild>
                        <a href={`/assistent/${e.id}?team=${team}`}>
                          <span>{e.name}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))
                }
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
        {
          data?.user.isAdmin && <Collapsible
            asChild
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={"Dashboard"}>
                  <LayoutDashboard />
                  <Link href={`/dashboard/administration`}>Dashboard</Link>
                </SidebarMenuButton>
              </CollapsibleTrigger>
            </SidebarMenuItem>
          </Collapsible>
        }

        {teamFind?.admin && items.map((item) => {
          return <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <Link href={item.url}>{item.title}</Link>
                  {
                    (item.items?.length ?? 0) > 0 && <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  }
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                {
                  (item.items?.length ?? 0) > 0 && <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <Link href={{
                            pathname: subItem.url,
                            query: params.toString()
                          }}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                }
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
