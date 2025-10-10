import { createBrowserRouter } from "react-router";
import Home from "./page/Home";
import CreateProgramPage from "./page/CreateProgramPage";
import MainLayout from "./layout/MainLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
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
