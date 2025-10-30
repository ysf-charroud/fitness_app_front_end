import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { IconSettings, IconUserBolt } from "@tabler/icons-react";
import { DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

// Logo component
const Logo = () => (
  <div className="flex items-center gap-2 px-2">
    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
      <span className="text-lg font-bold text-primary-foreground">F</span>
    </div>
    <span className="text-lg font-semibold">Fitness App</span>
  </div>
);

function CoachSideBar({ children }) {
  const items = [
    {
      title: "Programs",
      url: "/coach/programs",
      icon: DollarSign,
    },
    {
      title: "Profile",
      url: "#",
      icon: IconUserBolt,
    },
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
  ];

  return (
    <div className="flex h-screen w-full flex-1 flex-col overflow-hidden border border-neutral-200 md:flex-row dark:border-neutral-700 dark:bg-neutral-800">
      <SidebarProvider defaultOpen={true}>
        <Sidebar>
          <SidebarHeader>
            <Logo />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Coach Dashboard</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link to={item.url}>
                          <item.icon className="h-5 w-5" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="#" className="flex items-center gap-3">
                    <img
                      src="https://assets.aceternity.com/manu.png"
                      className="h-7 w-7 shrink-0 rounded-full"
                      width={50}
                      height={50}
                      alt="Avatar"
                    />
                    <span>Manu Arora</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 overflow-auto p-4">
          <SidebarTrigger />
          {children}
        </div>
      </SidebarProvider>
    </div>
  );
}

export default CoachSideBar;
