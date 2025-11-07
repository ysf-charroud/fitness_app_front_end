import React from "react";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { Toaster } from "@/components/ui/sonner";
import { Marquee } from "@/components/ui/marquee";
import { cn } from "@/lib/utils";
import ScrollReveal from "../components/ui/scroll-reveal";
import { motion, AnimatePresence } from "framer-motion";
// Landing page components
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import SearchBar from "../components/SearchBar";
import WhyChooseUs from "../components/WhyChooseUs";
import GymsSection from "../components/GymsSection";
import CTA from "../components/CTA";
import ContactForm from "../components/ContactForm";
import Footer from "../components/Footer";
import ProgramCard from "../components/PorgramCard";
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Profile } from "@/pages/Profile";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const initialReviews = [
  {
    name: "Jack",
    username: "@jack",
    body: "I've never seen anything like this before. It's amazing. I love it.",
    img: "https://avatar.vercel.sh/jack",
  },
  {
    name: "Jill",
    username: "@jill",
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: "https://avatar.vercel.sh/jill",
  },
  {
    name: "John",
    username: "@john",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/john",
  },
  {
    name: "Jane",
    username: "@jane",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/jane",
  },
  {
    name: "Jenny",
    username: "@jenny",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/jenny",
  },
  {
    name: "James",
    username: "@james",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/james",
  },
];

const ReviewCard = ({ img, name, username, body }) => (
  <figure
    className={cn(
      "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
      "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
      "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
    )}
  >
    <div className="flex flex-row items-center gap-2">
      <img className="rounded-full" width="32" height="32" alt={name} src={img} />
      <div className="flex flex-col">
        <figcaption className="text-sm font-medium dark:text-white">
          {name}
        </figcaption>
        <p className="text-xs font-medium dark:text-white/40">{username}</p>
      </div>
    </div>
    <blockquote className="mt-2 text-sm">{body}</blockquote>
  </figure>
); 

const MarqueeDemo = ({ reviews }) => {
  const firstRow = reviews.slice(0, Math.ceil(reviews.length / 2));
  const secondRow = reviews.slice(Math.ceil(reviews.length / 2));
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-10">
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">
        Explore Our customers reviews
      </h2>
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review, idx) => (
          <ReviewCard key={`${review.username || review.name}-${idx}`} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((review, idx) => (
          <ReviewCard key={`${review.username || review.name}-b-${idx}`} {...review} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-white dark:from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-white dark:from-background"></div>
    </div>
  );
};

// Coach carousel now fetches from the API inside the component

const Home = () => {
  const [programs, setPrograms] = useState([]);
  const [loadingPrograms, setLoadingPrograms] = useState(false);
  const user = useSelector((s) => s.auth.user);
  const [comment, setComment] = useState("");
  const [commentStatus, setCommentStatus] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reviews, setReviews] = useState(initialReviews);

  useEffect(() => {
    let mounted = true;
    const loadPrograms = async () => {
      try {
        setLoadingPrograms(true);
        const { data } = await api.get("/programs", { params: { page: 1, limit: 12 } });
        const list = Array.isArray(data) ? data : (data?.programs || data?.data || []);
        if (mounted) setPrograms(list.slice(0, 6));
      } catch (e) {
        if (mounted) setPrograms([]);
      } finally {
        if (mounted) setLoadingPrograms(false);
      }
    };
    loadPrograms();
    return () => { mounted = false };
  }, []);

    // Fetch comments from backend and inject into marquee reviews
  useEffect(() => {
    let mounted = true;
    const loadComments = async () => {
      try {
        const { data } = await api.get("/comments"); // GET /api/comments (server.js 94-95, comments.route.js 12-13)
        const list = Array.isArray(data) ? data : (data?.comments || data?.data || []);
        if (!mounted || !Array.isArray(list)) return;
        const mapped = list.map((c) => {
          const userObj = c.user || c.user_id || {};
          const name = userObj.name || userObj.fullName || "User";
          return {
            name,
            username: `@${String(name).split(" ")[0].toLowerCase()}`,
            body: c.content || c.text || "",
            img: userObj.avatar || "https://avatar.vercel.sh/user",
          };
        });
        setReviews((prev) => (mapped.length ? [...mapped, ...prev] : prev));
      } catch (_) {
        // ignore errors silently for UX
      }
    };
    loadComments();
    return () => { mounted = false };
  }, []);

  const isAthlete = (user?.role || "").toLowerCase() === "athlete";

  const submitComment = async (e) => {
    e?.preventDefault();
    setCommentStatus(null);
    const text = comment.trim();
    if (!text) return;
    if (!user) {
      try { localStorage.setItem("pending_comment", text); } catch {}
      setDialogOpen(true);
      return;
    }
    try { await api.post("/comments", { content: text }); } catch {}
    const newReview = {
      name: user?.name || "User",
      username: `@${(user?.name || "user").split(" ")[0].toLowerCase()}`,
      body: text,
      img: user?.avatar || "https://avatar.vercel.sh/user",
    };
    setReviews((prev) => [newReview, ...prev]);
    setComment("");
    setCommentStatus("Thanks for your feedback!");
  };

  // Post a pending comment after login and add to marquee
  useEffect(() => {
    if (!user) return;
    let pending = null;
    try { pending = localStorage.getItem("pending_comment"); } catch {}
    if (pending && pending.trim()) {
      const text = pending.trim();
      (async () => {
        try { await api.post("/comments", { content: text }); } catch {}
        const newReview = {
          name: user?.name || "User",
          username: `@${(user?.name || "user").split(" ")[0].toLowerCase()}`,
          body: text,
          img: user?.avatar || "https://avatar.vercel.sh/user",
        };
        setReviews((prev) => [newReview, ...prev]);
        try { localStorage.removeItem("pending_comment"); } catch {}
      })();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Header />
      <main>
        {/* Hero section doesn't need scroll reveal as it's above the fold */}
        <HeroSection />

        {/* Profile (if logged in) & public comment box */}
        <section className="py-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Leave a Comment</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={submitComment} className="space-y-3">
                  <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your thoughts..." />
                  <div className="flex justify-end">
                    <Button type="submit" disabled={!comment.trim()}>Add Comment</Button>
                  </div>
                  {commentStatus && (
                    <p className="text-sm text-green-600">{commentStatus}</p>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </section>

        <ScrollReveal baseOpacity={0} enableBlur={true} baseRotation={0} blurStrength={5}>
          <SearchBar />
        </ScrollReveal>

        <ScrollReveal baseOpacity={0} enableBlur={true} baseRotation={3} blurStrength={8}>
          <WhyChooseUs />
        </ScrollReveal>

        {/* Coaches carousel (fetches from API) */}
        <ScrollReveal baseOpacity={0} enableBlur={false} baseRotation={2} blurStrength={0}>
          <section className="py-16">
            <AnimatedTestimonials fetchCoaches />
          </section>
        </ScrollReveal>

        {/* Marquee section with fade-in only */}
        <ScrollReveal baseOpacity={0} enableBlur={false} baseRotation={0} blurStrength={0}>
          <section className="py-16">
            <MarqueeDemo reviews={reviews} />
          </section>
        </ScrollReveal>

        {/* Programs section */}
        <ScrollReveal baseOpacity={0} enableBlur={true} baseRotation={3} blurStrength={8}>
          <section id="programs" className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">Trending Programs</h2>
              {loadingPrograms ? (
                <div className="text-center text-gray-600">Loading programs...</div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {programs.map((program, idx) => (
                      <ProgramCard key={program._id || idx} program={program} />
                    ))}
                  </div>
                  <div className="mt-10 flex justify-center">
                    <Button asChild>
                      <Link to="/programs">View More</Link>
                    </Button>
                  </div>
                </>
              )}
            </div>
          </section>
        </ScrollReveal>

        {/* Gyms section with more pronounced animation */}
        <ScrollReveal baseOpacity={0} enableBlur={true} baseRotation={5} blurStrength={10}>
          <GymsSection />
        </ScrollReveal>

        

        {/* CTA with attention-grabbing animation */}
        <ScrollReveal baseOpacity={0} enableBlur={true} baseRotation={4} blurStrength={7}>
          <CTA />
        </ScrollReveal>

        {/* Contact form with subtle animation */}
        <ScrollReveal baseOpacity={0} enableBlur={true} baseRotation={2} blurStrength={5}>
          <ContactForm />
        </ScrollReveal>
      </main>
      {/* Auth required dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign in required</DialogTitle>
            <DialogDescription>
              You need to register or log in before adding a comment. Once authenticated, we will post your comment automatically.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className="flex gap-2 justify-end w-full">
              <Button asChild variant="outline"><Link to="/register">Register</Link></Button>
              <Button asChild><Link to="/login">Log in</Link></Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Footer />
    </div>
  );
};

export default Home;
