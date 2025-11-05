import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "@/services/redux/slices/authSlice";

export function LoginForm({ className /* , ...props */ }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setServerErrors([]);
    setSuccessMessage("");

    try {
      // Send credentials to backend
      const response = await axios.post(
        `${import.meta.env.VITE_API_ORIGIN}/api/auth/login`,
        { email, password },
        { withCredentials: true } //  allow backend to set HttpOnly cookie
      );

      //  Access Token returned in JSON
      const { accessToken, user } = response.data;

      //  Update Redux store
      dispatch(setUser(user));
      dispatch(setToken(accessToken));

      //  Check if account is desactivated
      if (user && user.isActive === false) {
        navigate("/error");
        setLoading(false);
        return; // stop here, no redirect or login
      }

      // Do NOT store Access Token or user info in localStorage anymore!

      setSuccessMessage("Login successful!");

      //  Role-based redirect
      const roleRedirects = {
        admin: "/dashboard/Admin",
        athlete: "/dashboard/athlete",
        coach: "/coach/programs",
        gym: "/dashboard/gym",
      };

      // Normalize and match role safely
      const userRole = user.role?.toLowerCase();
      const targetPath = roleRedirects[userRole] || "/dashboard/athlete"; // default fallback

      setTimeout(() => navigate(targetPath), 800);
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.message || "Login failed. Please try again.";
      setServerErrors([message]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} /* {...props} */>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your Apple or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <Button variant="outline" type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                      fill="currentColor"
                    />
                  </svg>
                  Login with Apple
                </Button>
                <Button variant="outline" asChild>
                  <a
                    href={`${import.meta.env.VITE_API_ORIGIN}/api/auth/google`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853   3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                    Login with Google
                  </a>
                </Button>
              </Field>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>

              {/* Errors */}
              {serverErrors.length > 0 && (
                <div className="mb-2 col-span-full">
                  {serverErrors.map((m, idx) => (
                    <Alert key={idx} variant="destructive">
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{m}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}

              {successMessage && (
                <div className="mb-2 col-span-full">
                  <Alert variant="success">
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>{successMessage}</AlertDescription>
                  </Alert>
                </div>
              )}

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link
                    to="/forgot-password"
                    className="ml-auto text-sm text-blue-600 underline underline-offset-4 hover:text-blue-700"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Field>

              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? "Logging in…" : "Login"}
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <Link to="/register" className="text-blue-600 underline">
                    Sign up
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our{" "}
        <Link to="#" className="text-blue-600 underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link to="#" className="text-blue-600 underline">
          Privacy Policy
        </Link>
        .
        </FieldDescription>
    </div>
  );
}
