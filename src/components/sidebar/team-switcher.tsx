//@ts-nocheck
"use client";

import * as React from "react";
import {
  AudioWaveform,
  ChevronsUpDown,
  Command,
  GalleryVerticalEnd,
  Plus,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useModal } from "@/contexts/modal";
import CustomModal from "../custom-modal";
import { AddingTeam } from "./adding-team";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Team } from "@prisma/client";

export function TeamSwitcher() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = new URLSearchParams(searchParams.toString());
  const { isMobile } = useSidebar();
  const { setOpen } = useModal();
  const session = useSession();
  const user = session.data?.user;

  const [teamName, setTeamName] = useLocalStorage<string>("selectedTeam", "");
  const [activeTeam, setActiveTeam] = React.useState<Team | null>(null);
  React.useEffect(() => {
    if (!user || !user.teams.length) return;

    const storedTeam = user.teams.find((t) => t.name === teamName);
    const defaultTeam = user.teams[0];

    if (!storedTeam && defaultTeam && session.data!.user?.teams?.length > 0) {
      setTeamName(defaultTeam.name);
      setActiveTeam(defaultTeam);
    } else {
      setActiveTeam(storedTeam || defaultTeam);
    }
  }, [user?.teams, teamName, session.data?.user]);

  React.useEffect(() => {
    if (!activeTeam) return;

    const teamSelectedLast = params.get("team");

    if (teamSelectedLast !== activeTeam.name) {
      params.set("team", activeTeam.name);
      router.push(`${window.location.pathname}?${params.toString()}`);
    }
  }, [activeTeam]);

  const handleOpenModalTeam = () => {
    setOpen(
      <CustomModal>
        <AddingTeam />
      </CustomModal>
    );
  };

  if (!user) return null;

  const renderTeamButtonText = activeTeam ? (
    <>
      <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
        {returnIcon(activeTeam.icon as any)}
      </div>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold">{activeTeam.name}</span>
        <span className="truncate text-xs">Enterprise</span>
      </div>
      <ChevronsUpDown className="ml-auto" />
    </>
  ) : (
    "Sem nenhuma associação"
  );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {renderTeamButtonText}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">Teams</DropdownMenuLabel>
            {user.teams.length > 0 && (
              user.teams.map((team, index) => (
                <DropdownMenuItem
                  key={team.id}
                  onClick={() => {
                    setActiveTeam(team);
                    setTeamName(team.name);
                  }}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    {returnIcon(team.icon as any)}
                  </div>
                  {team.name}
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2" onClick={handleOpenModalTeam}>
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Adicionar time</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

const icons = {
  "Acme Inc": GalleryVerticalEnd,
  "Acme Corp.": AudioWaveform,
  "Evil Corp.": Command,
};

export const returnIcon = (label: "Acme Inc" | "Acme Corp." | "Evil Corp.") => {
  const Icon = icons[label] || Command;
  return <Icon className="size-4" />;
};
