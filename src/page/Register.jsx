import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import api from "@/services/axios/axiosClient";

function Register() {
  const navigate = useNavigate();

  // State
  //const [role, setRole] = useState("athlete");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "athlete", // include role
  });
  const [loading, setLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // Handle change
  const handleChange = (e) => {
    const { id, name, value } = e.target;
    const key = id || name;
    setForm((s) => ({ ...s, [key]: value }));
  };

  // Reset form
  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      password: "",
      role: "athlete" // add role here

    });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setServerErrors([]);
    setSuccessMessage("");
    setLoading(true);

    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      };

      const res = await api.post("/api/auth/signup", payload);
      const msg =
        res?.data?.message ||
        "A verification code has been sent to your email. Please verify your account.";
      setSuccessMessage(msg);
      resetForm();

      localStorage.setItem("verifyEmail", payload.email);
      const qEmail = encodeURIComponent(payload.email || "");
      navigate(`/verify-email?email=${qEmail}`);
    } catch (err) {
      const resp = err?.response;
      setFieldErrors({});
      if (resp && resp.data) {
        const data = resp.data;
        const messages = [];
        const fErrors = {};

        if (data.errors && Array.isArray(data.errors)) {
          data.errors.forEach((it) => {
            const field = it.param || it.field;
            const msg = it.msg || it.message || JSON.stringify(it);
            if (field) fErrors[field] = msg;
            else messages.push(msg);
          });
        } else if (data.errors && typeof data.errors === "object") {
          Object.entries(data.errors).forEach(([k, v]) => {
            fErrors[k] = v?.message || v?.msg || JSON.stringify(v);
          });
        } else if (data.field && data.message) {
          fErrors[data.field] = data.message;
        }

        if (typeof data === "string") messages.push(data);
        else if (data.message && typeof data.message === "string")
          messages.push(data.message);
        else if (data.error && typeof data.error === "string")
          messages.push(data.error);

        setFieldErrors(fErrors);
        setServerErrors(messages.filter(Boolean));
      } else {
        setServerErrors([err.message || "An unknown error occurred"]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Field error renderer
  const renderFieldError = (key) => {
    const v = fieldErrors[key];
    if (!v) return null;
    return (
      <div className="mt-1">
        <Alert variant="destructive">
          <AlertDescription className="whitespace-pre-line">
            {Array.isArray(v) ? v.join("\n") : v}
          </AlertDescription>
        </Alert>
      </div>
    );
  };

  // JSX
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Create your account</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-md bg-white p-6 rounded-2xl shadow-md border"
      >
        {/* Errors */}
        {serverErrors.length > 0 && (
          <div className="mb-2">
            {serverErrors.map((m, idx) => (
              <Alert key={idx} variant="destructive" className="mb-2">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{m}</AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {successMessage && (
          <Alert variant="success" className="mb-2">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        {/* Name */}
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Your full name"
            value={form.name}
            onChange={handleChange}
            required
          />
          {renderFieldError("name")}
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />
          {renderFieldError("email")}
        </div>

        {/* Password */}
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="********"
            value={form.password}
            onChange={handleChange}
            required
          />
          {renderFieldError("password")}
        </div>

        {/* Role */}
        <div>
          <Label>Role</Label>
          <Select
            value={form.role}
            onValueChange={(value) => setForm((s) => ({ ...s, role: value }))}
              >
        <SelectTrigger>
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="athlete">Athlete</SelectItem>
          <SelectItem value="coach">Coach</SelectItem>
          <SelectItem value="gym">Gym</SelectItem>
        </SelectContent>
      </Select>

            </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading || !form.name || !form.email || !form.password || !form.role}
          className="w-full bg-neutral-800 hover:bg-neutral-700 text-white"
        >
          {loading ? "Registering…" : "Register"}
        </Button>
      </form>

      <p className="mt-4 text-sm">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 underline">
          Login here
        </Link>
      </p>
    </div>
  );
}

export default Register;
