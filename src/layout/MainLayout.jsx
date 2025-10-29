import CoachSideBar from "@/components/CoachSideBar";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";

const CoachLayout = () => {
  const user = useSelector((state) => state.auth.user);
  if (user.role !== "admin") return <Navigate to="/login" replace />;
  if (user.role !== "athlete") return <Navigate to="/login" replace />;
  if (user.role !== "coach")
    return (
      <main className="bg-background min-h-screen">
        <CoachSideBar>
          <Outlet />
        </CoachSideBar>
      </main>
    );
};

export default CoachLayout;
