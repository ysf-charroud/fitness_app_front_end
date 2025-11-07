import CoachSideBar from "@/components/CoachSideBar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";

const CoachLayout = () => {
  const user = useSelector((state) => state.auth.user);
  if (user.role == "admin") return <Navigate to="/login" replace />;
  if (user.role == "athlete") return <Navigate to="/login" replace />;
  if (user.role == "coach")
    return (
      <SidebarProvider>
        <CoachSideBar />
        <main className="h-screen flex-1">
          <Outlet />
        </main>
      </SidebarProvider>
    );
};

export default CoachLayout;
