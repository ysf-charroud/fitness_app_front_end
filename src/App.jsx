import { useEffect } from "react";
import router from "./router";
import { RouterProvider } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "./services/redux/slices/authSlice";
import { ClimbingBoxLoader } from "react-spinners";

const App = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.isLoading);
  const token = useSelector((state) => state.auth.token);
  useEffect(() => {
    if (token) {
      dispatch(fetchUser());
    }
  }, [dispatch, token]);

  if (loading)
    return (
      <div className="h-screen  flex justify-center items-center">
        <ClimbingBoxLoader />
      </div>
    );

  return <RouterProvider router={router} />;
};

export default App;
