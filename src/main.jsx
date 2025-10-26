import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router";
import router from "./router";
import store from "./services/redux/store";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
{/*     <Route path="/dashboard/Admin" element={<PrivateRoute allowedRoles={['admin']}><Admin /></PrivateRoute>} />
 */}  </Provider>
);
