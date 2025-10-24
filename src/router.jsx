import { createBrowserRouter } from "react-router";
import Home from "./page/Home";
import CoachLayout from "./layout/MainLayout";
import ProgramPage from "./page/ProgramPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
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
  {
    path: "*",
    element: <div>404 not found</div>,
  },
]);

export default router;
