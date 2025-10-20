import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function LoginSuccess() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(search);
  const token = params.get("token");
  const error = params.get("error");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (error) {
      setMessage(error);
      // stay on page so user sees error
      return;
    }

    if (token) {
      try {
        localStorage.setItem("token", token);
      } catch {
        // ignore storage errors
      }
      setMessage("Login successful — redirecting…");
      setTimeout(() => navigate("/dashboard/athlete"), 1200);
    } else {
      setMessage("Missing token from authentication response.");
    }
  }, [token, error, navigate]);

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
