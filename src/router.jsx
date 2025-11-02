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
import ProgramPage from "./pages/ProgramPage";

import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import LoginSuccess from "./pages/LoginSuccess";
import ForgotPassword from "./pages/Forgotpassword";
import ResetPassword from "./pages/Resetpassword";
// Dashboards
//import AdminDashboard from "./page/dashboard/Admin";
import ProfilePage from "./pages/ProfilePage";
import Athlete from "./pages/dashboard/Athlete";
//import CoachDashboard from "./page/dashboard/Coach";
import GymDashboard from "./pages/dashboard/GymDashboard/Dashboard";

//import AthleteDashboard from "./page/dashboard/Athlete";
 
//import CreateProgramPage from "./page/CreateProgramPage";
//import AdminDashboard from "./pages/dashboard/Admin";
//import CoachDashboard from "./pages/dashboard/Coach";
//import AthleteDashboard from "./pages/dashboard/Athlete";

//import CreateProgramPage from "./pages/CreateProgramPage";
//import MainLayout from "./layout/MainLayout";
import ErrorSection7 from "./pages/ErrorPage";
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
    path: "/dashboard/athlete",
    element: <Athlete />,
  },
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
    element: <ProgramPage />,
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
 /*{
    path: "/dashboard/athlete",
    element: <AthleteDashboard />,
  }, 
  */
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
  { path: "*", element: <ErrorSection7/> },
]);

export default router;
