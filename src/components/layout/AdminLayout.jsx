import { NavLink, Outlet } from "react-router";
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import AppSideBar from "@/components/AdminSidebar";
import Stats from "../admin/dashboard/statistics";

export default function AdminLayout() {
  return (
    <SidebarProvider>
      <AppSideBar />
      <main className="h-screen flex-1 overflow-y-scroll">
        {/* Bouton pour ouvrir/fermer la sidebar (facultatif) */}
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
