"use client";
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import { NavLink } from "react-router";
import { IconSettings } from "@tabler/icons-react";
import { DollarSign } from "lucide-react";
import { Profile } from "@/pages/Profile";

function CoachSideBar({ children }) {
  const links = [
    {
      label: "Programs",
      href: "/coach/programs",
      icon: DollarSign,
    },
    {
      label: "Settings",
      href: "/coach/settings",
      icon: IconSettings,
    },
  ];

  return (
    <SidebarProvider>
      <div className="flex w-full">
        <Sidebar collapsible="icon">
          {/* HEADER */}
          <SidebarHeader className="p-4 border-b">
            <Profile />
          </SidebarHeader>

          {/* CONTENT */}
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="px-4 py-2 text-gray-500 uppercase text-xs">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {links.map((link) => (
                    <SidebarMenuItem key={link.label}>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={link.href}
                          className={({ isActive }) =>
                            `flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100 ${
                              isActive ? "bg-gray-200 font-semibold" : ""
                            }`
                          }
                        >
                          <link.icon className="w-4 h-4" />
                          <span>{link.label}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* Main content */}
        <SidebarInset className="flex-1 overflow-auto">
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

export default CoachSideBar;
