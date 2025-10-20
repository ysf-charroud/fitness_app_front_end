import { useState } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import api from "@/services/axios/axiosClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function ResetPassword() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Read token and id from query string first, fallback to url param
  const query = new URLSearchParams(location.search);
  const tokenFromQuery = query.get("token");
  const idFromQuery = query.get("id");
  const tokenFromParams = params?.token;

  const token = tokenFromQuery || tokenFromParams;
  const userId = idFromQuery || "";

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setMessage("");

  if (!token) {
    setError("Missing or invalid reset token. Use the link from your email or request a new one.");
    return;
  }

  // Strong password regex
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

  // Client-side password validation
  if (!password) {
    setError("Password is required.");
    return;
  }
  if (!strongPasswordRegex.test(password)) {
    setError(
      "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character."
    );
    return;
  }
  if (password !== confirmPassword) {
    setError("Passwords do not match.");
    return;
  }

  setLoading(true);
  try {
    const res = await api.post(`/api/auth/reset-password/${token}`, {
      id: userId,
      newPassword: password,
    });

    setMessage(res.data?.message || "Password reset successful.");
    setPassword("");
    setConfirmPassword("");
    setTimeout(() => navigate("/login"), 1800);
  } catch (err) {
    const resp = err?.response;
    if (resp && (resp.status === 400 || resp.status === 401)) {
      setError(
        resp.data?.message ||
          "Invalid or expired token. Request a new password reset link."
      );
    } else if (resp?.data?.message) {
      setError(resp.data.message);
    } else {
      setError(err.message || "Error resetting password");
    }
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Reset Password</h1>

      {message && (
        <Alert variant="success" className="mb-2">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mb-2">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-80">
        <Input
          type="password"
          placeholder="New password (min 8 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />
        <Input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={8}
        />
        <Button type="submit" className="bg-black text-white" disabled={loading}>
          {loading ? "Resetting…" : "Reset Password"}
        </Button>
      </form>

      {!token && (
        <p className="mt-4 text-sm">
          <Link to="/forgot-password" className="text-blue-600 underline">
            Request a new password reset link
          </Link>
        </p>
      )}
    </div>
  );
}
export default ResetPassword;
