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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Activity,
  AlertCircle,
  Camera,
  CheckCircle2,
  Dumbbell,
  IdCard,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Trophy,
  UploadCloud,
  User as UserIcon,
} from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-100 px-4 py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 lg:flex-row">
        <Card className="sticky top-24 h-fit flex-1 border-transparent bg-white/80 shadow-xl backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <CardHeader className="space-y-4">
            <div className="relative mx-auto h-36 w-36 overflow-hidden rounded-full border border-dashed border-primary/30">
              <Avatar className="h-full w-full">
                <AvatarImage
                  src={form.avatar}
                  alt="Avatar preview"
                  onError={() => setForm((p) => ({ ...p, avatar: "" }))}
                />
                <AvatarFallback className="bg-primary/10 text-2xl font-semibold text-primary">
                  {form.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <label className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-1 bg-black/60 opacity-0 transition-opacity hover:opacity-100">
                <Camera className="h-5 w-5 text-white" />
                <span className="text-xs font-medium text-white">Change Photo</span>
                <input type="file" accept="image/*" onChange={handleFileChange} className="sr-only" />
              </label>
            </div>
            <div className="text-center">
              <div className="mb-2 flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-wide text-primary/70">
                <ShieldCheck className="h-4 w-4" />
                <span>{(userFromRedux?.role || "Athlete").toUpperCase()}</span>
              </div>
              <CardTitle className="text-3xl font-semibold text-slate-900">{form.name || "Your Name"}</CardTitle>
              <CardDescription className="flex items-center justify-center gap-2 text-sm text-slate-500">
                <Mail className="h-4 w-4" />
                {form.email}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Separator className="bg-slate-200" />
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>Status</span>
                <Badge variant={userFromRedux?.isActive ? "outline" : "destructive"} className="gap-1">
                  {userFromRedux?.isActive ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5" /> Active
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-3.5 w-3.5" /> Inactive
                    </>
                  )}
                </Badge>
              </div>
              {form.profile?.bio && (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                  <p className="mb-1 flex items-center gap-2 font-semibold text-slate-700">
                    <UserIcon className="h-4 w-4" /> Bio
                  </p>
                  <p className="leading-relaxed">{form.profile.bio}</p>
                </div>
              )}
            </div>
            <Separator className="bg-slate-200" />
            <div className="space-y-3">
              <p className="flex items-center gap-2 text-sm text-slate-500">
                <Phone className="h-4 w-4" />
                {form.profile?.phone || "No phone added"}
              </p>
              <p className="flex items-center gap-2 text-sm text-slate-500">
                <MapPin className="h-4 w-4" />
                {form.profile?.address || "No address set"}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                {form.profile?.social_links?.instagram && (
                  <a
                    href={form.profile.social_links.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 px-3 py-1 text-white shadow-sm transition hover:scale-105"
                  >
                    <Instagram className="h-4 w-4" /> Instagram
                  </a>
                )}
                {form.profile?.social_links?.linkedin && (
                  <a
                    href={form.profile.social_links.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-3 py-1 text-white shadow-sm transition hover:scale-105"
                  >
                    <Linkedin className="h-4 w-4" /> LinkedIn
                  </a>
                )}
              </div>
            </div>
            <Separator className="bg-slate-200" />
            <div className="space-y-3 text-sm text-slate-500">
              <p className="flex items-center gap-2 font-medium text-slate-600">
                <UploadCloud className="h-4 w-4" /> Quick Actions
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Button type="button" variant="outline" onClick={() => window.location.reload()} className="justify-start gap-2">
                  <Activity className="h-4 w-4" /> Refresh
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  className="justify-start gap-2"
                >
                  <AlertCircle className="h-4 w-4" /> Delete Account
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex-[2] space-y-5">
          <Card className="border-transparent bg-white/90 shadow-lg backdrop-blur">
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <CardTitle className="text-2xl font-semibold text-slate-900">Profile Settings</CardTitle>
                <CardDescription className="text-sm text-slate-500">
                  Organize your profile the way top platforms do.
                </CardDescription>
              </div>
              {error && (
                <div className="rounded-md border border-destructive/10 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  <AlertCircle className="mr-2 inline h-4 w-4" />
                  {error}
                </div>
              )}
              {message && (
                <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-600 shadow-sm">
                  <CheckCircle2 className="mr-2 inline h-4 w-4" />
                  {message}
                </div>
              )}
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="personal" className="space-y-6">
                <TabsList className="mx-auto flex flex-wrap justify-center gap-2 sm:justify-start">
                  <TabsTrigger value="personal" className="gap-2">
                    <UserIcon className="h-4 w-4" /> Personal Info
                  </TabsTrigger>
                  <TabsTrigger value="profile" className="gap-2">
                    <IdCard className="h-4 w-4" /> Profile
                  </TabsTrigger>
                  {role === "athlete" && (
                    <TabsTrigger value="fitness" className="gap-2">
                      <Dumbbell className="h-4 w-4" /> Fitness
                    </TabsTrigger>
                  )}
                  {role === "coach" && (
                    <TabsTrigger value="coach" className="gap-2">
                      <Trophy className="h-4 w-4" /> Coach
                    </TabsTrigger>
                  )}
                </TabsList>

                <form onSubmit={handleSave} className="space-y-10">
                  <TabsContent value="personal" className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" value={form.name} onChange={handleChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" value={form.email} readOnly className="cursor-not-allowed bg-slate-100" />
                      </div>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          value={form.password}
                          onChange={handleChange}
                          placeholder="Enter new password"
                        />
                        <p className="text-xs text-slate-500">Changes will overwrite your current password.</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="avatar">Avatar URL</Label>
                        <Input
                          id="avatar"
                          name="avatar"
                          value={form.avatar}
                          onChange={handleChange}
                          placeholder="https://..."
                        />
                        <p className="text-xs text-slate-500">Supports HTTPS or data URIs.</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="profile" className="space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={form.profile?.bio || ""}
                        onChange={(e) => handleNestedChange("profile.bio", e.target.value)}
                        placeholder="Share your story..."
                        className="min-h-[120px]"
                      />
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={form.profile?.phone || ""}
                          onChange={(e) => handleNestedChange("profile.phone", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          value={form.profile?.address || ""}
                          onChange={(e) => handleNestedChange("profile.address", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="instagram">Instagram</Label>
                        <Input
                          id="instagram"
                          value={form.profile?.social_links?.instagram || ""}
                          onChange={(e) => handleNestedChange("profile.social_links.instagram", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input
                          id="linkedin"
                          value={form.profile?.social_links?.linkedin || ""}
                          onChange={(e) => handleNestedChange("profile.social_links.linkedin", e.target.value)}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {role === "athlete" && (
                    <TabsContent value="fitness" className="space-y-6">
                      <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="height">Height (cm)</Label>
                          <Input id="height" name="height" value={form.height} onChange={handleChange} type="number" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="weight">Weight (kg)</Label>
                          <Input id="weight" name="weight" value={form.weight} onChange={handleChange} type="number" />
                        </div>
                      </div>
                      <div className="grid gap-6 sm:grid-cols-3">
                        <div className="space-y-2">
                          <Label>Fitness Level</Label>
                          <Select value={form.fitness_level || ""} onValueChange={(value) => setForm((p) => ({ ...p, fitness_level: value }))}>
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="beginner">Beginner</SelectItem>
                              <SelectItem value="intermediate">Intermediate</SelectItem>
                              <SelectItem value="advanced">Advanced</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Activity Frequency</Label>
                          <Select
                            value={form.activity_frequency || ""}
                            onValueChange={(value) => setForm((p) => ({ ...p, activity_frequency: value }))}
                          >
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="How often?" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sedentary">Sedentary</SelectItem>
                              <SelectItem value="moderate">Moderate</SelectItem>
                              <SelectItem value="active">Active</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Goals</Label>
                          <Select value={form.goals || ""} onValueChange={(value) => setForm((p) => ({ ...p, goals: value }))}>
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Select goal" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="weight_loss">Weight Loss</SelectItem>
                              <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                              <SelectItem value="endurance">Endurance</SelectItem>
                              <SelectItem value="general">General Fitness</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Allergies</Label>
                        <Input
                          value={allergiesString}
                          onChange={(e) =>
                            setForm((p) => ({
                              ...p,
                              allergies: e.target.value
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean),
                            }))
                          }
                          placeholder="Peanuts, lactose..."
                        />
                      </div>
                    </TabsContent>
                  )}

                  {role === "coach" && (
                    <TabsContent value="coach" className="space-y-6">
                      <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="cin">CIN</Label>
                          <Input id="cin" name="cin" value={form.cin} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="experience">Years of Experience</Label>
                          <Input
                            id="experience"
                            name="years_of_experience"
                            value={form.years_of_experience}
                            onChange={handleChange}
                            type="number"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="speciality">Speciality</Label>
                        <Input id="speciality" name="speciality" value={form.speciality} onChange={handleChange} />
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>Certificates</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setForm((p) => ({
                                ...p,
                                certificates: [
                                  ...(p.certificates || []),
                                  { title: "", institution: "", date_obtained: "" },
                                ],
                              }))
                            }
                            className="gap-2"
                          >
                            <UploadCloud className="h-4 w-4" /> Add Certificate
                          </Button>
                        </div>
                        <div className="space-y-4">
                          {(form.certificates || []).map((c, idx) => (
                            <Card key={idx} className="bg-slate-50/80 shadow-sm">
                              <CardContent className="space-y-4 p-4">
                                <div className="grid gap-4 sm:grid-cols-3">
                                  <Input
                                    placeholder="Title"
                                    value={c.title || ""}
                                    onChange={(e) => {
                                      const next = [...(form.certificates || [])];
                                      next[idx] = { ...next[idx], title: e.target.value };
                                      setForm((p) => ({ ...p, certificates: next }));
                                    }}
                                  />
                                  <Input
                                    placeholder="Institution"
                                    value={c.institution || ""}
                                    onChange={(e) => {
                                      const next = [...(form.certificates || [])];
                                      next[idx] = { ...next[idx], institution: e.target.value };
                                      setForm((p) => ({ ...p, certificates: next }));
                                    }}
                                  />
                                  <Input
                                    placeholder="Date Obtained"
                                    value={c.date_obtained || ""}
                                    onChange={(e) => {
                                      const next = [...(form.certificates || [])];
                                      next[idx] = { ...next[idx], date_obtained: e.target.value };
                                      setForm((p) => ({ ...p, certificates: next }));
                                    }}
                                  />
                                </div>
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                  <Label className="text-sm text-slate-500">Upload proof (PDF/JPG/PNG)</Label>
                                  <div className="flex flex-1 items-center gap-3">
                                    <Input
                                      type="file"
                                      accept="image/png,image/jpeg,application/pdf"
                                      onChange={(e) => handleCertificateFileChange(idx, e)}
                                    />
                                    <span className="text-xs text-slate-400">
                                      {c.fileName ? `Attached: ${c.fileName}` : "No file attached"}
                                    </span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                          {(form.certificates || []).length > 0 && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() =>
                                setForm((p) => ({
                                  ...p,
                                  certificates: (p.certificates || []).slice(0, -1),
                                }))
                              }
                              className="w-fit"
                            >
                              Remove Last
                            </Button>
                          )}
                        </div>
                      </div>
                    </TabsContent>
                  )}

                  <Separator className="bg-slate-200" />
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-xs text-slate-500">
                      Need to leave? You can always re-activate your account by contacting support.
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => window.location.reload()}
                        className="border-slate-200 text-slate-600 hover:bg-slate-100"
                      >
                        Reload
                      </Button>
                      <Button type="submit" disabled={saving} className="gap-2">
                        <CheckCircle2 className="h-4 w-4" /> {saving ? "Saving..." : "Save changes"}
                      </Button>
                    </div>
                  </div>
                </form>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
