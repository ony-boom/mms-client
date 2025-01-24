import { Home, AudioWaveform, Disc } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { AppRoutes } from "@/route.types";
import { NavLink } from "react-router";
import { clsx } from "clsx";

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="overflow-x-hidden">
        <SidebarGroup>
          <SidebarGroupLabel>My music player</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <NavLink to={item.url}>
                    {({ isActive }) => (
                      <SidebarMenuButton
                        asChild
                        className={clsx(
                          {
                            "!bg-primary/10 !text-primary": isActive,
                          },
                          "transition-colors duration-300 hover:bg-primary/5 hover:text-primary",
                        )}
                        tooltip={item.title}
                      >
                        <span>
                          <item.icon />
                          <span>{item.title}</span>
                        </span>
                      </SidebarMenuButton>
                    )}
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarTrigger />
      </SidebarFooter>
    </Sidebar>
  );
}

const items = [
  {
    title: "Home",
    url: AppRoutes.Home,
    icon: Home,
  },
  {
    title: "Tracks",
    url: AppRoutes.Tracks,
    icon: AudioWaveform,
  },
  {
    title: "Albums",
    url: AppRoutes.Albums,
    icon: Disc,
  },
];
