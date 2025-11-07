import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import api from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  DollarSign,
  Clock,
  Users,
  Dumbbell,
  ShieldCheck,
  Sparkles,
  Image as ImageIcon,
} from "lucide-react";

export default function GymProfile() {
  const { id } = useParams();
  const [gym, setGym] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [zoomedImage, setZoomedImage] = useState(null);

  const photos = useMemo(() => (Array.isArray(gym?.photos) ? gym.photos.filter(Boolean) : []), [gym]);
  const trueEquipments = useMemo(() => {
    const eq = gym?.equipements || {};
    return Object.keys(eq)
      .filter((key) => eq[key] === true)
      .map((key) => key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()));
  }, [gym]);

  const quickFacts = useMemo(
    () => [
      {
        icon: DollarSign,
        label: "Membership",
        value: typeof gym?.pricing !== "undefined" ? `$${Number(gym.pricing).toFixed(2)}` : null,
      },
      {
        icon: Clock,
        label: "Schedule",
        value: gym?.schedule || null,
      },
      {
        icon: Phone,
        label: "Phone",
        value: gym?.phone || null,
        href: gym?.phone ? `tel:${gym.phone}` : undefined,
      },
      {
        icon: Mail,
        label: "Email",
        value: gym?.email || null,
        href: gym?.email ? `mailto:${gym.email}` : undefined,
      },
      {
        icon: Users,
        label: "Coaches",
        value: Array.isArray(gym?.coaches)
          ? `${gym.coaches.length} coach${gym.coaches.length === 1 ? "" : "es"}`
          : null,
      },
      {
        icon: Users,
        label: "Athletes",
        value: Array.isArray(gym?.athletes)
          ? `${gym.athletes.length} athlete${gym.athletes.length === 1 ? "" : "s"}`
          : null,
      },
      {
        icon: ShieldCheck,
        label: "Approval",
        value:
          typeof gym?.isApproved === "boolean"
            ? gym.isApproved
              ? "Approved"
              : "Pending review"
            : null,
      },
      {
        icon: ShieldCheck,
        label: "Owner",
        value: gym?.owner ? String(gym.owner) : null,
      },
    ],
    [gym]
  );

  const locationLabel = gym?.location;
  const mapSrc = useMemo(() => {
    if (!locationLabel) return null;
    const encoded = encodeURIComponent(locationLabel);
    return `https://maps.google.com/maps?q=${encoded}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
  }, [locationLabel]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/gyms/${id}`);
        if (mounted) setGym(data);
      } catch (e) {
        if (mounted) setError("Failed to load gym");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  useEffect(() => {
    setActivePhotoIndex(0);
  }, [photos.length]);

  const handlePrev = () => {
    if (!photos.length) return;
    setActivePhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleNext = () => {
    if (!photos.length) return;
    setActivePhotoIndex((prev) => (prev + 1) % photos.length);
  };

  if (loading) return <div className="p-6 text-center text-slate-500">Loading gym...</div>;
  if (error) return <div className="p-6 text-center text-destructive">{error}</div>;
  if (!gym) return <div className="p-6 text-center text-slate-500">Gym not found.</div>;

  const currentPhoto = photos[activePhotoIndex];
  const hasActivities = Array.isArray(gym.activities) && gym.activities.length > 0;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-slate-100 via-white to-slate-100 px-4 py-10 pt-24 sm:px-6 lg:px-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
          <Card className="overflow-hidden border-transparent bg-white/80 shadow-2xl backdrop-blur supports-[backdrop-filter]:bg-white/60">
            {photos.length > 0 ? (
              <div className="group relative">
                {currentPhoto ? (
                  <picture>
                    <img
                      src={currentPhoto}
                      alt="Gym highlight"
                      className="h-[420px] w-full cursor-zoom-in object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                      onClick={() => setZoomedImage(currentPhoto)}
                    />
                  </picture>
                ) : (
                  <div className="flex h-[360px] items-center justify-center bg-slate-950/60 text-slate-200">
                    <ImageIcon className="h-10 w-10" />
                  </div>
                )}

                {photos.length > 1 && (
                  <>
                    <Button
                      type="button"
                      size="icon"
                      variant="secondary"
                      onClick={handlePrev}
                      className="absolute left-4 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/90 text-slate-700 shadow-lg transition-all duration-200 hover:-translate-y-1/2 hover:bg-primary/90 hover:text-white focus-visible:ring-2 focus-visible:ring-primary group-hover:flex"
                      aria-label="Previous photo"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="secondary"
                      onClick={handleNext}
                      className="absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/90 text-slate-700 shadow-lg transition-all duration-200 hover:-translate-y-1/2 hover:bg-primary/90 hover:text-white focus-visible:ring-2 focus-visible:ring-primary group-hover:flex"
                      aria-label="Next photo"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </>
                )}

                {photos.length > 1 && (
                  <div className="flex w-full justify-center gap-3 bg-white/80 px-4 pb-5 pt-4">
                    {photos.map((photo, index) => (
                      <button
                        key={photo + index}
                        type="button"
                        onClick={() => setActivePhotoIndex(index)}
                        className={`relative h-20 w-24 overflow-hidden rounded-xl border transition-transform duration-300 hover:scale-105 ${
                          index === activePhotoIndex
                            ? "border-primary shadow-md"
                            : "border-transparent opacity-70"
                        }`}
                        aria-label={`View photo ${index + 1}`}
                      >
                        <img src={photo} alt={`Gym thumbnail ${index + 1}`} className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex h-72 flex-col items-center justify-center gap-3 bg-slate-900/70 text-center text-slate-100">
                <ImageIcon className="h-10 w-10" />
                <p className="max-w-xs text-sm text-slate-200/80">No gallery uploaded yet. Check back soon for visual updates.</p>
              </div>
            )}

            <CardHeader className="gap-4 border-b border-slate-200/70 bg-white/80 px-8 py-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-3">
                  <CardTitle className="text-3xl font-semibold text-slate-900">{gym.name}</CardTitle>
                  {gym.location && (
                    <CardDescription className="flex items-center gap-2 text-base text-slate-600">
                      <MapPin className="h-4 w-4 text-primary" />
                      {gym.location}
                    </CardDescription>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {typeof gym.pricing !== "undefined" && (
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-600">
                      <DollarSign className="mr-1 h-3.5 w-3.5" />
                      ${Number(gym.pricing).toFixed(2)} / month
                    </Badge>
                  )}
                  {typeof gym.mix === "boolean" && (
                    <Badge
                      variant="outline"
                      className={`gap-1 ${
                        gym.mix
                          ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                          : "border-sky-200 bg-sky-50 text-sky-600"
                      }`}
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      {gym.mix ? "Mixed gym" : "Single gender"}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-10 px-8 py-8">
              <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
                <div className="space-y-8">
                  <section className="rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-900">About this gym</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {gym.description || "This gym hasn't added a description yet, but it's already making waves."}
                    </p>
                  </section>

                  {hasActivities && (
                    <section className="rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm">
                      <div className="flex items-center gap-2">
                        <Dumbbell className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold text-slate-900">Signature activities</h3>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {gym.activities.map((activity) => (
                          <Badge key={activity} variant="outline" className="border-primary/20 bg-primary/5 text-primary">
                            {activity}
                          </Badge>
                        ))}
                      </div>
                    </section>
                  )}

                  {trueEquipments.length > 0 && (
                    <section className="rounded-2xl border border-slate-200/70 bg-white/70 p-6 shadow-sm">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold text-slate-900">Equipment lineup</h3>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {trueEquipments.map((label) => (
                          <Badge key={label} variant="secondary" className="rounded-full bg-slate-100 text-slate-700">
                            {label}
                          </Badge>
                        ))}
                      </div>
                    </section>
                  )}

                  {mapSrc && (
                    <section className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white/70 shadow-sm">
                      <div className="flex items-center justify-between px-6 pt-6">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-primary" />
                          <h3 className="text-lg font-semibold text-slate-900">Find us</h3>
                        </div>
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="text-sm text-primary hover:text-primary/80"
                        >
                          <a
                            href={`https://maps.google.com/?q=${encodeURIComponent(locationLabel)}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Open in Maps
                          </a>
                        </Button>
                      </div>
                      <div className="mt-4 aspect-[16/9] w-full">
                        <iframe
                          title="Gym location"
                          src={mapSrc}
                          className="h-full w-full"
                          loading="lazy"
                          allowFullScreen
                        />
                      </div>
                    </section>
                  )}
                </div>

                <aside className="space-y-6 rounded-2xl border border-slate-200/70 bg-slate-50/80 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900">Quick facts</h3>
                  <Separator className="bg-slate-200" />
                  <ul className="space-y-4">
                    {quickFacts
                      .filter((fact) => fact.value)
                      .map(({ icon: Icon, label, value, href }) => (
                        <li key={label} className="flex items-start gap-3 text-sm text-slate-600">
                          <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-inner">
                            <Icon className="h-4 w-4 text-primary" />
                          </span>
                          <div className="flex-1">
                            <p className="font-medium text-slate-800">{label}</p>
                            {href ? (
                              <a href={href} className="text-primary transition-colors hover:text-primary/80">
                                {value}
                              </a>
                            ) : (
                              <p>{value}</p>
                            )}
                          </div>
                        </li>
                      ))}
                  </ul>

                  {(gym.phone || gym.email) && (
                    <div className="flex flex-wrap gap-3 pt-2">
                      {gym.phone && (
                        <Button asChild className="gap-2">
                          <a href={`tel:${gym.phone}`}>
                            <Phone className="h-4 w-4" /> Call now
                          </a>
                        </Button>
                      )}
                      {gym.email && (
                        <Button asChild variant="outline" className="gap-2">
                          <a href={`mailto:${gym.email}`}>
                            <Mail className="h-4 w-4" /> Email gym
                          </a>
                        </Button>
                      )}
                    </div>
                  )}
                </aside>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Dialog open={Boolean(zoomedImage)} onOpenChange={(open) => !open && setZoomedImage(null)}>
        <DialogContent className="max-w-4xl border-none bg-transparent p-0 shadow-none">
          {zoomedImage && (
            <div className="overflow-hidden rounded-3xl bg-black/90">
              <img
                src={zoomedImage}
                alt="Zoomed gym"
                className="max-h-[80vh] w-full object-contain transition-transform duration-500 ease-out"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Footer />
    </>
  );
}