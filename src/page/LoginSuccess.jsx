import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setToken, setUser, fetchUser } from "@/services/redux/slices/authSlice";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function LoginSuccess() {
  
  const { search } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = new URLSearchParams(search);
  const token = params.get("accessToken") || params.get("token"); // Support both keys
  const userEncoded = params.get("user");
  const error = params.get("error");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (error) {
      setMessage(error);
      return; // stay on page so user can read the error
    }

    if (token && userEncoded) {
      try {
        // Decode user object
        const user = JSON.parse(decodeURIComponent(userEncoded));

        // ✅ Store token and user in Redux
        dispatch(setUser(user));
        dispatch(setToken(token));
        // ✅ Immediately validate token by fetching current user
        dispatch(fetchUser());

        setMessage("Login successful — redirecting…");

        // ✅ Redirect based on user role
        const role = user.role?.toLowerCase();
        const roleRedirects = {
          admin: "/dashboard/Admin",
          athlete: "/dashboard/athlete",
          coach: "/coach/programs",
          gym: "/dashboard/gym",
        };

        const target = roleRedirects[role] || "/dashboard/athlete";
        setTimeout(() => navigate(target), 1200);
      } catch (err) {
        console.error("Failed to process user info:", err);
        setMessage("Error decoding user information.");
      }
    } else if (token) {
      // Fallback for response (token only)
      dispatch(setToken(token));
      dispatch(fetchUser());
      setMessage("Login successful — redirecting…");
      setTimeout(() => navigate("/dashboard/athlete"), 1200);
    } else {
      setMessage("Missing authentication data. Please try again.");
    }
  }, [token, userEncoded, error, navigate, dispatch]);

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md border">
        {error ? (
          <Alert variant="destructive">
            <AlertTitle>Authentication failed</AlertTitle>
            <AlertDescription>{message || error}</AlertDescription>
          </Alert>
        ) : (
          <Alert variant="success">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{message || "Successfully authenticated."}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
