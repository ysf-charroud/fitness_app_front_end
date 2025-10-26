import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import api from "@/services/axios/axiosClient";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"


// Utility: format seconds into mm:ss
function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function VerifyEmail() {
  const navigate = useNavigate();

  // Read email from query string, route state, or localStorage (in that order)
  const { search, state } = useLocation();
  const params = new URLSearchParams(search);
  const emailFromQuery = params.get("email") || "";
  const emailFromState = state?.email || "";
  const storedEmail = typeof window !== "undefined" ? localStorage.getItem("verifyEmail") : null;
  const initialEmail = emailFromQuery || emailFromState || storedEmail || "";
  const [email] = useState(initialEmail);

  // State
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [timer, setTimer] = useState(600); // 10 minutes
  const [resendCooldown, setResendCooldown] = useState(0); // seconds
  const intervalRef = useRef(null);
  const resendRef = useRef(null);

  // ⏱️ Timer effect
  useEffect(() => {
    if (!email) {
      navigate("/register");
      return;
    }

    // start expiry timer
    intervalRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      clearInterval(intervalRef.current);
      clearInterval(resendRef.current);
    };
  }, [email, navigate]);

  // resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) {
      clearInterval(resendRef.current);
      return;
    }
    resendRef.current = setInterval(() => {
      setResendCooldown((c) => {
        if (c <= 1) {
          clearInterval(resendRef.current);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(resendRef.current);
  }, [resendCooldown]);

  // ✅ Handle verification
  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) return setError("Missing email. Please register first.");
    if (!/^[0-9]{6}$/.test(code)) return setError("Please enter the 6-digit code.");
    setLoading(true);
    try {
      const res = await api.post("/api/auth/verify-code", { email, code });
      setSuccess(res?.data?.message || "Email verified successfully! Redirecting to your Dashboard");

      // Clear stored email after success
      try { localStorage.removeItem("verifyEmail"); } catch (e) {}

      // Redirect to login after a short delay
      setTimeout(() => navigate(`/login`), 2000);
    } catch (err) {
      const msg = err?.response?.data?.message || "Invalid or expired code";
      setError(msg.includes("expired") ? "Invalid or expired code" : msg);
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Handle resend
  const handleResend = async () => {
    setError("");
    setSuccess("");
    if (!email) return setError("Missing email. Please register first.");

    setResendLoading(true);
    try {
      const res = await api.post("/api/auth/resend-code", { email });
      setSuccess(res?.data?.message || "A new code was sent to your email.");

      // Reset expiry timer to 10 minutes
      setTimer(600);
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setTimer((t) => {
          if (t <= 1) {
            clearInterval(intervalRef.current);
            return 0;
          }
          return t - 1;
        });
      }, 1000);

      // Start resend cooldown (60s)
      setResendCooldown(60);
    } catch (err) {
      const msg = err?.response?.data?.message || "Unable to resend code";
      setError(msg);
    } finally {
      setResendLoading(false);
    }
  };

  // 🧱 UI
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-50">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md border">
        <h2 className="text-2xl font-semibold mb-4">Verify your email</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Please check your email and enter the verification code sent there.
        </p>
 
        {error && (
          <Alert variant="destructive" className="mb-3">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert variant="success" className="mb-3">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <div className="mb-3">
          <Label>Email</Label>
          <div className="text-sm text-muted-foreground">{email}</div>
        </div>

       <form onSubmit={handleVerify} className="flex flex-col gap-3">
  <div>
    <Label htmlFor="code" className="mb-2">Verification Code</Label>

    {/* ✅ Single OTP input, no groups or separators */}
     <InputOTP
      className="scale-110 tracking-widest"
      id="code"
      name="code"
      maxLength={6}
      value={code}
      onChange={(value) => setCode(value.replace(/[^0-9]/g, "").slice(0, 6))}
      required
    >
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>

      <InputOTPSeparator />

      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
    </div>

  <div className="flex items-center justify-between text-sm text-muted-foreground">
    {timer > 0 ? (
      <span>Code expires in {formatTime(timer)}</span>
    ) : (
      <span className="text-destructive">
        Code expired. Please resend a new one.
      </span>
    )}
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={resendLoading || resendCooldown > 0}
      onClick={handleResend}
    >
      {resendLoading
        ? "Sending…"
        : resendCooldown > 0
        ? `Resend (${resendCooldown}s)`
        : "Resend code"}
    </Button>
  </div>

  <Button
    type="submit"
    disabled={loading || code.length !== 6}
    className="w-full"
  >
    {loading ? "Verifying…" : "Verify"}
  </Button>
</form>

      </div>
    </div>
  );
}
