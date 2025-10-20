import { createBrowserRouter, Navigate } from "react-router-dom";
import Home from "./page/Home";

import Login from "./page/Login";
import Register from "./page/Register";
import VerifyEmail from "./page/VerifyEmail";
import LoginSuccess from "./page/LoginSuccess";
import ForgotPassword from "./page/Forgotpassword";
import ResetPassword from "./page/Resetpassword";
// Dashboards
import AdminDashboard from "./page/dashboard/Admin";
import CoachDashboard from "./page/dashboard/Coach";
import GymDashboard from "./page/dashboard/Gym";
import AthleteDashboard from "./page/dashboard/Athlete";

import CreateProgramPage from "./page/CreateProgramPage";
import MainLayout from "./layout/MainLayout";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />
  },
  {

    path: "/reset-password/:token",
    element: <ResetPassword />
  },
  {
    path: "/register",
    element: <Register />
  }
  ,
  {
    path: "/verify-email",
    element: <VerifyEmail />
  }
  ,
  {
    path: "/login-success",
    element: <LoginSuccess />
  }
  ,
  {
    path: "/dashboard/admin",
    element: <AdminDashboard />
  },
  {
    path: "/dashboard/coach",
    element: <CoachDashboard />
  },
  {
    path: "/dashboard/gym",
    element: <GymDashboard />
  },
  {
    path: "/dashboard/athlete",
    element: <AthleteDashboard />
  },
  {
    path: "/reset-password",
    element: <ResetPassword />
  }

    element: <MainLayout />,
    children: [
      {
        path: "coach",
        children: [
          {
            path: "program/create",
            element: <CreateProgramPage />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <div>404 not found</div>,
  },

]);

export default router;
