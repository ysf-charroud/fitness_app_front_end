import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginForm } from "@/components/login-form";
import api from "@/services/axios/axiosClient";

function Login() {
  const navigate = useNavigate(); 
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerErrors([]);
    setSuccessMessage("");
    setLoading(true);

    try {
      const res = await api.post("/api/auth/login", {
        email: form.email,
        password: form.password,
      });

      const user = res.data.user;

      // Role-based message
      let msg = "";
      switch (user.role) {
        case "athlete":
          msg = `Welcome Athlete ${user.name}!`;
          break;
        case "coach":
          msg = `Welcome Coach ${user.name}!`;
          break;
        case "gym":
          msg = `Welcome Gym ${user.name}!`;
          break;
        default:
          msg = `Welcome ${user.name}!`;
      }

  setSuccessMessage(msg);
  setForm({ email: "", password: "" });

  // Redirect based on role
  const role = user.role || "athlete";
  // normalize possible values
  const rolePath = (role === "admin" || role === "coach" || role === "gym" || role === "athlete") ? role : "athlete";
  navigate(`/dashboard/${rolePath}`);
    } catch (err) {
      const message = err?.response?.data?.message || "Invalid credentials";
      setServerErrors([message]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-50">
      <LoginForm
        email={form.email}
        password={form.password}
        onChange={handleChange}
        onSubmit={handleSubmit}
        loading={loading}
        serverErrors={serverErrors}
        successMessage={successMessage}
      />
    </div>
  );
}

export default Login;
