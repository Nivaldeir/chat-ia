"use client"

import * as React from "react"
import {
  AudioWaveform,
  Bot,
  Command,
  GalleryVerticalEnd,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { TeamSwitcher } from "./team-switcher"
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"

const data = {
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Administração",
      url: "#",
      icon: Bot,
      isAdmin: true,
      isActive: false,
      items: [
        {
          title: "Usuarios",
          url: "/dashboard/users",
        },
        {
          title: "Teams",
          url: "/dashboard/teams",
        },
        {
          title: "Arquivos",
          url: "/dashboard/files",
        },
        {
          title: "Modelos",
          url: "/dashboard/models",
        }
      ],
    },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      {/* <SidebarRail /> */}
    </Sidebar>
  )
}
