import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    gender: "",
    avatar: "",
    isActive: true,
  });

  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  useEffect(() => {
    const loadProfile = async () => {
    setError(null);
      try {
        const res = await fetch("http://localhost:5000/api/user/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.message || `Failed to load profile (${res.status})`);
        }

        const data = await res.json();
        // expect data shape { user: { name, email, gender, avatar, isActive } } or { name, email... }
        const user = data.user || data;
        setForm((prev) => ({
          ...prev,
          name: user.name || "",
          email: user.email || "",
          gender: user.gender || "",
          avatar: user.avatar || "",
          isActive: user.isActive !== undefined ? user.isActive : true,
        }));
      } catch (err) {
        console.error(err);
        setError(err.message || "Unable to load profile");
      }
    };

    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSave = async (e) => {
    e?.preventDefault();
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
        body: JSON.stringify({
          name: form.name,
          gender: form.gender,
          avatar: form.avatar,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `Save failed (${res.status})`);
      }

      const data = await res.json().catch(() => ({}));
      setMessage(data.message || "Profile updated successfully");
      // Optionally update stored user
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    // soft delete: set isActive to false
    if (!confirm("Are you sure you want to delete your account? This action can be undone by an admin.")) return;
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

      // success: call logout endpoint to clear refresh cookie, then clear local storage and redirect
      setMessage("Account deleted. Logging out and redirecting to login...");
      try {
        // Call logout endpoint — send cookies (refresh token) with credentials
        const logoutRes = await fetch("http://localhost:5000/api/auth/logout", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (!logoutRes.ok) {
          // log but continue to clear local state
          const body = await logoutRes.json().catch(() => ({}));
          console.error("Logout after delete failed:", body.message || logoutRes.status);
        }
      } catch (err) {
        console.error("Error calling logout after delete:", err);
      } finally {
        try {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
        } catch {
          /* ignore */
        }
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
                  {form.avatar ? <AvatarImage src={form.avatar} /> : <AvatarFallback>{(form.name || "U").slice(0,2)}</AvatarFallback>}
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
                <label className="block text-sm font-medium text-muted-foreground">Gender</label>
                <Input name="gender" value={form.gender} onChange={handleChange} placeholder="e.g. male, female, other" />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground">Avatar URL</label>
                <Input name="avatar" value={form.avatar} onChange={handleChange} placeholder="https://..." />
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
