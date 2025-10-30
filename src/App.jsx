import { useEffect } from "react";
import router from "./router";
import { RouterProvider } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "./services/redux/slices/authSlice";

const App = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.isLoading);
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  if (loading)
    return (
      <div className="h-screen  flex justify-center items-center">
        <div className="bg-red-500">Loading...</div>
      </div>
    );

  return <RouterProvider router={router} />;
};

export default App;
