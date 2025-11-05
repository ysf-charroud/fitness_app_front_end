import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUser, setToken, fetchUser } from "@/services/redux/slices/authSlice";
import api from "@/services/axios/axiosClient";
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
  const userId = userFromRedux?._id || userFromRedux?.id || "";
  const role = (userFromRedux?.role || "").toLowerCase();

  // Helpers
  const emptyProfile = { bio: "", phone: "", address: "", social_links: { instagram: "", linkedin: "" } };

  // Initialize from Redux user state (not localStorage)
  const [form, setForm] = useState({
    // personal
    name: userFromRedux?.name || "",
    email: userFromRedux?.email || "",
    password: "",
    avatar: userFromRedux?.avatar || "",
    isActive: userFromRedux?.isActive !== undefined ? userFromRedux.isActive : true,
    // athlete
    height: userFromRedux?.height ?? "",
    weight: userFromRedux?.weight ?? "",
    fitness_level: userFromRedux?.fitness_level || "",
    allergies: Array.isArray(userFromRedux?.allergies) ? userFromRedux.allergies : (userFromRedux?.allergies ? [userFromRedux.allergies] : []),
    activity_frequency: userFromRedux?.activity_frequency || "",
    goals: userFromRedux?.goals || "",
    bought_programs: Array.isArray(userFromRedux?.bought_programs) ? userFromRedux.bought_programs : [],
    profile: userFromRedux?.profile ? {
      bio: userFromRedux.profile.bio || "",
      phone: userFromRedux.profile.phone || "",
      address: userFromRedux.profile.address || "",
      social_links: {
        instagram: userFromRedux.profile.social_links?.instagram || "",
        linkedin: userFromRedux.profile.social_links?.linkedin || "",
      },
    } : { ...emptyProfile },
    // coach
    cin: userFromRedux?.cin || "",
    certificates: Array.isArray(userFromRedux?.certificates) ? userFromRedux.certificates : [],
    years_of_experience: userFromRedux?.years_of_experience ?? "",
    speciality: userFromRedux?.speciality || "",
  });

  useEffect(() => {
    if (!userFromRedux) return;
    setForm((prev) => ({
      ...prev,
      name: userFromRedux.name || "",
      email: userFromRedux.email || "",
      avatar: userFromRedux.avatar || "",
      isActive: userFromRedux.isActive !== undefined ? userFromRedux.isActive : true,
      height: userFromRedux.height ?? "",
      weight: userFromRedux.weight ?? "",
      fitness_level: userFromRedux.fitness_level || "",
      allergies: Array.isArray(userFromRedux.allergies) ? userFromRedux.allergies : (userFromRedux?.allergies ? [userFromRedux.allergies] : []),
      activity_frequency: userFromRedux.activity_frequency || "",
      goals: userFromRedux.goals || "",
      bought_programs: Array.isArray(userFromRedux.bought_programs) ? userFromRedux.bought_programs : [],
      profile: userFromRedux.profile ? {
        bio: userFromRedux.profile.bio || "",
        phone: userFromRedux.profile.phone || "",
        address: userFromRedux.profile.address || "",
        social_links: {
          instagram: userFromRedux.profile.social_links?.instagram || "",
          linkedin: userFromRedux.profile.social_links?.linkedin || "",
        },
      } : { ...emptyProfile },
      cin: userFromRedux.cin || "",
      certificates: Array.isArray(userFromRedux.certificates) ? userFromRedux.certificates : [],
      years_of_experience: userFromRedux.years_of_experience ?? "",
      speciality: userFromRedux.speciality || "",
    }));
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

  const handleNestedChange = (path, value) => {
    setForm((prev) => {
      const updated = { ...prev };
      const keys = path.split(".");
      let ref = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        ref[key] = ref[key] ?? {};
        ref = ref[key];
      }
      ref[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  const allergiesString = useMemo(() => (form.allergies || []).join(", "), [form.allergies]);
  const boughtProgramsString = useMemo(() => (form.bought_programs || []).join(", "), [form.bought_programs]);

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

  // Handle certificate file upload (png, jpg, pdf)
  const handleCertificateFileChange = (idx, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ["image/png", "image/jpeg", "application/pdf"];
    if (!allowed.includes(file.type)) {
      setError("Certificates must be PNG, JPG, or PDF");
      return;
    }
    const MAX_BYTES = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_BYTES) {
      setError("Certificate file too large. Max 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result;
      setForm((p) => {
        const next = [...(p.certificates || [])];
        next[idx] = { ...(next[idx] || {}), fileName: file.name, fileType: file.type, fileData: String(dataUrl) };
        return { ...p, certificates: next };
      });
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
      const payload = {
        name: form.name,
        email: form.email, // immutable on backend typically, sent for completeness
        avatar: form.avatar || null,
        password: form.password || undefined, // if empty, backend should ignore
        // athlete
        height: form.height !== "" ? Number(form.height) : null,
        weight: form.weight !== "" ? Number(form.weight) : null,
        fitness_level: form.fitness_level || null,
        allergies: Array.isArray(form.allergies) ? form.allergies : [],
        activity_frequency: form.activity_frequency || null,
        goals: form.goals || null,
        bought_programs: (form.bought_programs || []).filter(Boolean),
        profile: {
          bio: form.profile?.bio || "",
          phone: form.profile?.phone || "",
          address: form.profile?.address || "",
          social_links: {
            instagram: form.profile?.social_links?.instagram || "",
            linkedin: form.profile?.social_links?.linkedin || "",
          },
        },
        // coach
        cin: form.cin || null,
        certificates: (form.certificates || []).map((c) => ({
          title: c.title || "",
          institution: c.institution || "",
          date_obtained: c.date_obtained || "",
          // Optional file payload for future backend support
          fileName: c.fileName,
          fileType: c.fileType,
          fileData: c.fileData,
        })),
        years_of_experience: form.years_of_experience !== "" ? Number(form.years_of_experience) : null,
        speciality: form.speciality || null,
      };

      const { data } = await api.put(`/api/users/${userId}`, payload);
      // Prefer server-sent user (either under data.user or top-level data)
      const serverUser = data?.user || (data && (data.id || data.email) ? data : null);
      const updatedUser =
        serverUser || {
          ...userFromRedux,
          ...payload,
        };
      // Update Redux store immediately with server response
      dispatch(setUser(updatedUser));
      setMessage(data?.message || "Profile updated successfully");
      
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
      const roleRedirects = {
        admin: "/dashboard/Admin",
        athlete: "/",
        coach: "/coach/programs",
        gym: "/dashboard/gym",
      };
      const target = roleRedirects[(finalUser?.role || "").toLowerCase()] || "/dashboard/athlete";
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

            <form onSubmit={handleSave} className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <Avatar>
                    <AvatarImage
                      src={form.avatar}
                      alt="Avatar preview"
                      onError={() => setForm((p) => ({ ...p, avatar: "" }))}
                    />
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
                <label className="block text-sm font-medium text-muted-foreground">Password (plain text)</label>
                <Input name="password" value={form.password} onChange={handleChange} placeholder="Enter new password" />
                <p className="text-xs text-muted-foreground mt-1">This will replace your password. It is sent to the server for hashing.</p>
              </div>


              <div>
                <label className="block text-sm font-medium text-muted-foreground">Upload avatar image</label>
                <Input type="file" accept="image/*" onChange={handleFileChange} />
                <p className="text-xs text-muted-foreground mt-1">PNG/JPG/GIF/WebP, up to 2MB.</p>
              </div>

              {role === "athlete" && (
                <div className="space-y-4">
                  <h4 className="font-semibold">Fitness Info</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground">Height (cm)</label>
                      <Input name="height" value={form.height} onChange={handleChange} type="number" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground">Weight (kg)</label>
                      <Input name="weight" value={form.weight} onChange={handleChange} type="number" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground">Fitness Level</label>
                      <Input name="fitness_level" value={form.fitness_level} onChange={handleChange} placeholder="beginner | intermediate | advanced" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground">Activity Frequency</label>
                      <Input name="activity_frequency" value={form.activity_frequency} onChange={handleChange} placeholder="active | moderate | sedentary" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground">Goals</label>
                    <Input name="goals" value={form.goals} onChange={handleChange} placeholder="weight_loss | muscle_gain | endurance | general" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground">Allergies (comma separated)</label>
                    <Input value={allergiesString} onChange={(e) => setForm((p) => ({ ...p, allergies: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) }))} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground">Bought Programs (IDs, comma separated)</label>
                    <Input value={boughtProgramsString} onChange={(e) => setForm((p) => ({ ...p, bought_programs: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) }))} />
                  </div>
                  <div className="space-y-3">
                    <h5 className="font-medium">Profile</h5>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground">Bio</label>
                      <Input value={form.profile?.bio || ""} onChange={(e) => handleNestedChange("profile.bio", e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground">Phone</label>
                        <Input value={form.profile?.phone || ""} onChange={(e) => handleNestedChange("profile.phone", e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground">Address</label>
                        <Input value={form.profile?.address || ""} onChange={(e) => handleNestedChange("profile.address", e.target.value)} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground">Instagram</label>
                        <Input value={form.profile?.social_links?.instagram || ""} onChange={(e) => handleNestedChange("profile.social_links.instagram", e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground">LinkedIn</label>
                        <Input value={form.profile?.social_links?.linkedin || ""} onChange={(e) => handleNestedChange("profile.social_links.linkedin", e.target.value)} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {role === "coach" && (
                <div className="space-y-4">
                  <h4 className="font-semibold">Coach Info</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground">CIN</label>
                      <Input name="cin" value={form.cin} onChange={handleChange} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground">Years of Experience</label>
                      <Input name="years_of_experience" value={form.years_of_experience} onChange={handleChange} type="number" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground">Speciality</label>
                    <Input name="speciality" value={form.speciality} onChange={handleChange} />
                  </div>
                  <div className="space-y-3">
                    <h5 className="font-medium">Certificates</h5>
                    {(form.certificates || []).map((c, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="grid grid-cols-3 gap-3">
                          <Input placeholder="Title" value={c.title || ""} onChange={(e) => {
                          const next = [...(form.certificates || [])];
                          next[idx] = { ...next[idx], title: e.target.value };
                          setForm((p) => ({ ...p, certificates: next }));
                        }} />
                          <Input placeholder="Institution" value={c.institution || ""} onChange={(e) => {
                          const next = [...(form.certificates || [])];
                          next[idx] = { ...next[idx], institution: e.target.value };
                          setForm((p) => ({ ...p, certificates: next }));
                        }} />
                          <Input placeholder="Date Obtained" value={c.date_obtained || ""} onChange={(e) => {
                          const next = [...(form.certificates || [])];
                          next[idx] = { ...next[idx], date_obtained: e.target.value };
                          setForm((p) => ({ ...p, certificates: next }));
                        }} />
                        </div>
                        <div className="grid grid-cols-3 gap-3 items-center">
                          <Input type="file" accept="image/png,image/jpeg,application/pdf" onChange={(e) => handleCertificateFileChange(idx, e)} />
                          <div className="col-span-2 text-xs text-muted-foreground truncate">
                            {c.fileName ? (
                              <span>Attached: {c.fileName}</span>
                            ) : (
                              <span>No file attached</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" onClick={() => setForm((p) => ({ ...p, certificates: [ ...(p.certificates || []), { title: "", institution: "", date_obtained: "" } ] }))}>Add Certificate</Button>
                      {(form.certificates || []).length > 0 && (
                        <Button type="button" variant="destructive" onClick={() => setForm((p) => ({ ...p, certificates: (p.certificates || []).slice(0, -1) }))}>Remove Last</Button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h5 className="font-medium">Profile</h5>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground">Bio</label>
                      <Input value={form.profile?.bio || ""} onChange={(e) => handleNestedChange("profile.bio", e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground">Phone</label>
                        <Input value={form.profile?.phone || ""} onChange={(e) => handleNestedChange("profile.phone", e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground">Address</label>
                        <Input value={form.profile?.address || ""} onChange={(e) => handleNestedChange("profile.address", e.target.value)} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground">Instagram</label>
                        <Input value={form.profile?.social_links?.instagram || ""} onChange={(e) => handleNestedChange("profile.social_links.instagram", e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground">LinkedIn</label>
                        <Input value={form.profile?.social_links?.linkedin || ""} onChange={(e) => handleNestedChange("profile.social_links.linkedin", e.target.value)} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

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
