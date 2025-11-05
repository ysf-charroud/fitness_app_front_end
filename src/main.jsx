import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
//import { RouterProvider } from "react-router";
import store from "./services/redux/store";
import { Toaster } from "sonner";
import App from "./App";
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <Toaster position="top-right" richColors />
    <App />
  </Provider>
);
