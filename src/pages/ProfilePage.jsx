import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUser, setToken, fetchUser } from "@/services/redux/slices/authSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

function ProfilePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userFromRedux = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Initialize from Redux user state (not localStorage)
  const [form, setForm] = useState({
    name: userFromRedux?.name || "",
    email: userFromRedux?.email || "",
    avatar: userFromRedux?.avatar || "",
    isActive: userFromRedux?.isActive !== undefined ? userFromRedux.isActive : true,
  });

  useEffect(() => {
    // Optionally fetch profile if not present, or refresh fields
    if (userFromRedux) {
      setForm((prev) => ({
        ...prev,
        name: userFromRedux.name || "",
        email: userFromRedux.email || "",
        avatar: userFromRedux.avatar || "",
        isActive:
          userFromRedux.isActive !== undefined
            ? userFromRedux.isActive
            : true,
      }));
    }
    // No longer fetch token or user from localStorage
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userFromRedux]);

  const isValidAvatarUrl = (val) => {
    const v = String(val || "").trim();
    if (!v) return true; // allow empty (will show fallback)
    try {
      const url = new URL(v);
      return ["http:", "https:", "data:"].includes(url.protocol);
    } catch {
      return false;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "avatar") {
      const trimmed = String(value).trim();
      // Only accept valid URLs; otherwise keep raw text so user can edit
      setForm((p) => ({ ...p, avatar: trimmed }));
      return;
    }
    setForm((p) => ({ ...p, [name]: value }));
  };

  // Handle selecting an avatar image from local files
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (png, jpg, gif, webp)");
      return;
    }
    const MAX_BYTES = 2 * 1024 * 1024; // 2MB
    if (file.size > MAX_BYTES) {
      setError("Image too large. Max 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result;
      setForm((p) => ({ ...p, avatar: String(dataUrl) }));
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e?.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);
    // Basic client-side validation for avatar URL
    if (form.avatar && !isValidAvatarUrl(form.avatar)) {
      setError("Please enter a valid avatar URL (http, https or data URI)");
      setSaving(false);
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          name: form.name,
          //gender: form.gender,
          avatar: form.avatar,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `Save failed (${res.status})`);
      }

      const data = await res.json().catch(() => ({}));
      // Prefer server-sent user (either under data.user or top-level data)
      const serverUser = data?.user || (data && (data.id || data.email) ? data : null);
      const updatedUser =
        serverUser || {
          ...userFromRedux,
          name: form.name,
          avatar: form.avatar,
        };
      // Update Redux store immediately with server response
      dispatch(setUser(updatedUser));
      setMessage(data.message || "Profile updated successfully");
      
      // Refresh from backend to ensure we have canonical data, then redirect
      let finalUser = updatedUser;
      if (token) {
        try {
          const refreshedUser = await dispatch(fetchUser()).unwrap();
          finalUser = refreshedUser || updatedUser;
        } catch (err) {
          console.error("Failed to refresh user data:", err);
          // Continue anyway since we already updated Redux with server response
        }
      }
      
      // Role-based redirect after save
      const role = (finalUser?.role || "").toLowerCase();
      const roleRedirects = {
        admin: "/dashboard/Admin",
        athlete: "/dashboard/athlete", // matches router path
        coach: "/coach/programs",
        gym: "/dashboard/gym",
      };
      const target = roleRedirects[role] || "/dashboard/athlete";
      navigate(target, { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action can be undone by an admin.")) return;
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ isActive: false }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `Delete failed (${res.status})`);
      }

      setMessage("Account deleted. Logging out and redirecting to login...");
      try {
        // Call logout endpoint
        const logoutRes = await fetch("http://localhost:5000/api/auth/logout", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        if (!logoutRes.ok) {
          const body = await logoutRes.json().catch(() => ({}));
          console.error("Logout after delete failed:", body.message || logoutRes.status);
        }
      } catch (err) {
        console.error("Error calling logout after delete:", err);
      } finally {
        // Clear Redux auth state
        dispatch(setUser(null));
        dispatch(setToken(null));
        setTimeout(() => navigate("/login"), 800);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete account");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gray-50">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Account Profile</CardTitle>
            <CardDescription>Manage your account details</CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="mb-4">
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </div>
            )}

            {message && (
              <div className="mb-4">
                <Alert variant="success">
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              </div>
            )}

            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <Avatar>
                  {form.avatar ? (
                    <AvatarImage
                      src={form.avatar}
                      alt="Avatar preview"
                      onError={() => setForm((p) => ({ ...p, avatar: "" }))}
                    />
                  ) : (
                    <AvatarFallback>{(form.name || "U").slice(0, 2)}</AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-muted-foreground">Name</label>
                  <Input name="name" value={form.name} onChange={handleChange} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground">Email</label>
                <Input name="email" value={form.email} readOnly />
              </div>


              <div>
                <label className="block text-sm font-medium text-muted-foreground">Avatar URL</label>
                <Input name="avatar" value={form.avatar} onChange={handleChange} placeholder="https://..." />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground">Upload avatar image</label>
                <Input type="file" accept="image/*" onChange={handleFileChange} />
                <p className="text-xs text-muted-foreground mt-1">PNG/JPG/GIF/WebP, up to 2MB.</p>
              </div>

              <div className="flex gap-3 mt-2">
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save changes"}
                </Button>
                <Button variant="outline" type="button" onClick={() => window.location.reload()}>
                  Reload
                </Button>
                <div className="ml-auto">
                  <Button variant="destructive" type="button" onClick={handleDelete}>
                    Delete Account
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ProfilePage;
