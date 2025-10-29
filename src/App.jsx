import { useEffect } from "react";
import router from "./router";
import { RouterProvider } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "./services/redux/slices/authSlice";

const App = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  return <RouterProvider router={router} />;
};

export default App;
