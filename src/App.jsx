import { useEffect, useState, lazy, Suspense } from "react";
import router from "./router";
import { RouterProvider } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "./services/redux/slices/authSlice";

// Lazy load the loader component
const ClimbingBoxLoader = lazy(() =>
  import("react-spinners").then((mod) => ({ default: mod.ClimbingBoxLoader }))
);

const App = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.isLoading);
  const token = useSelector((state) => state.auth.token);

  const [delayPassed, setDelayPassed] = useState(false);

  // Small delay before rendering app content
  useEffect(() => {
    const timer = setTimeout(() => {
      setDelayPassed(true);
    }, 1000); // 1.5s delay
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (token) {
      dispatch(fetchUser());
    }
  }, [dispatch, token]);

  if (loading || !delayPassed) {
    return (
      <Suspense fallback={null}>
      <div className="h-screen flex justify-center items-center">
        <ClimbingBoxLoader />
      </div>
      </Suspense>
    );
  }

  return <RouterProvider router={router} />;
};

export default App;
