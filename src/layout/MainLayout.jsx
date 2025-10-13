import { Outlet } from "react-router";

const MainLayout = () => {
  return (
    <div className="bg-background min-h-screen">
      <Outlet />
    </div>
  );
};

export default MainLayout;
