import CoachSideBar from "@/components/CoachSideBar";
import { Outlet } from "react-router";

const CoachLayout = () => {
  return (
    <main className="bg-background min-h-screen">
      <CoachSideBar>
        <Outlet />
      </CoachSideBar>
    </main>
  );
};

export default CoachLayout;
