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
  useSidebar,
} from "@/components/ui/sidebar";
import { NavLink } from "react-router";
import {
  Calendar,
  House,
  Inbox,
  Users,
  Dumbbell,
  ChartNoAxesCombined,
} from "lucide-react";

const AppSideBar = () => {
  const { open } = useSidebar();
  console.log(open);
  const items = [
    {
      title: "Dashboard",
      url: "/admin/home",
      icon: House,
    },
    {
      title: "athletes",
      url: "/admin/athletes",
      icon: Inbox,
    },
    {
      title: "gyms",
      url: "/admin/gyms",
      icon: Dumbbell,
    },
    {
      title: "Programs",
      url: "/admin/programs",
      icon: Calendar,
    },
    {
      title: "Coaches",
      url: "/admin/coaches",
      icon: Users,
    },
    {
      title: "transactions",
      url: "/admin/transactions",
      icon: ChartNoAxesCombined,
    },
  ];

  return (
    <Sidebar collapsible="icon">
      {/* HEADER */}
      {open && (
        <SidebarHeader className="text-lg font-semibold px-4 py-2 border-b">
          Admin Dashboard
        </SidebarHeader>
      )}

      {/* CONTENT */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-2 text-gray-500 uppercase text-xs">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-100 ${
                          isActive ? "bg-gray-200 font-semibold" : ""
                        }`
                      }
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* FOOTER */}
      {open && (
        <SidebarFooter className="border-t p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
              A
            </div>
            <div className="flex flex-col">
              <span className="font-semibold">Admin Name</span>
              <span className="text-sm text-gray-500">admin@example.com</span>
            </div>
            <button className="ml-auto text-gray-400 hover:text-gray-600">
              •••
            </button>
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
};

export default AppSideBar;
