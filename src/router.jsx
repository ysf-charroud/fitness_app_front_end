import { createBrowserRouter } from "react-router";
import { Children } from "react";
import Home from "./pages/Home";
import AdminLayout from "./components/layout/AdminLayout";
import Dashboard from "./pages/Dashboard";
import UsersList from "./pages/UsersList";
import ProgramsList from "./pages/ProgramsList";
import CoachesList from "./pages/CoachesList";
import GymsList from "./pages/GymsList";
import Transactions from "./pages/Statistics"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "admin/",
    element: <AdminLayout />,
    children: [
      {index: true, element: <Dashboard/>},
      {path: "home", element: <Dashboard/>},
      { path: "athletes", element: <UsersList /> },
      { path: "programs", element: <ProgramsList /> },
      { path: "coaches", element: <CoachesList /> },
      { path: "gyms", element: <GymsList /> },
      { path: "transactions", element: <Transactions /> },
    ],
  },
]);

export default router;
