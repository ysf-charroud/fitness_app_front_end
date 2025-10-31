import { NavLink, Outlet } from "react-router";
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import AppSideBar from "@/components/AppSideBar";
import Stats from "../admin/dashboard/statistics";

export default function AdminLayout() {
  return (
    <SidebarProvider>
        <AppSideBar />

        <main className="flex-1 p-8 overflow-y-auto">
          {/* Bouton pour ouvrir/fermer la sidebar (facultatif) */}
          <SidebarTrigger />
          <Outlet />
          
        </main>
    </SidebarProvider>
  );
}
