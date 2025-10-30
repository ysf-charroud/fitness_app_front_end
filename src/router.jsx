import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import AdminLayout from "./components/layout/AdminLayout";
import Dashboard from "./pages/Dashboard";
import UsersList from "./pages/UsersList";
import ProgramsList from "./pages/ProgramsList";
import CoachesList from "./pages/CoachesList";
import GymsList from "./pages/GymsList";
import Transactions from "./pages/Statistics"
import CoachLayout from "./layout/CoachLayout";
import ProgramPage from "./page/ProgramPage";

import Login from "./page/Login";
import Register from "./page/Register";
import VerifyEmail from "./page/VerifyEmail";
import LoginSuccess from "./page/LoginSuccess";
import ForgotPassword from "./page/Forgotpassword";
import ResetPassword from "./page/Resetpassword";
// Dashboards
//import AdminDashboard from "./page/dashboard/Admin";
import ProfilePage from "./page/ProfilePage";
import CoachDashboard from "./page/dashboard/Coach";
import GymDashboard from "./page/dashboard/GymDashboard/Dashboard";
import AthleteDashboard from "./page/dashboard/Athlete";

//import CreateProgramPage from "./page/CreateProgramPage";
//import MainLayout from "./layout/MainLayout";
import ErrorSection7 from "./page/ErrorPage";
import Auth from "./layout/Auth";

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
  },{
    path: "/login",
    element: <Login />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },+
  {
    path: "/reset-password/:token",
    element: <ResetPassword />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/verify-email",
    element: <VerifyEmail />,
  },
  {
    path: "/login-success",
    element: <LoginSuccess />,
  },
  {
    path: "/dashboard/coach",
    element: <CoachDashboard />,
  },
  {
    path: "/dashboard/gym",
    element: <GymDashboard />,
  },
  {
    path: "/ProfilePage",
    element: <ProfilePage />,
  },
  {
    path: "/error",
    element: <ErrorSection7 />,
  },
  {
    path: "/dashboard/athlete",
    element: <AthleteDashboard />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  // Protected routes for auth users
  {
    element: <Auth />,
    children: [
      {
        element: <CoachLayout />,
        children: [
          {
            path: "coach",
            children: [
              {
                path: "programs",
                element: <ProgramPage />,
              },
            ],
          },
        ],
      },
    ],
  },
  { path: "*", element: <div className="bg-red-500 h-screen">404 not found</div> },
]);

export default router;
