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
// Redux-powered data; API calls handled in slices
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Profile } from "@/pages/Profile";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { fetchPrograms } from "@/services/redux/slices/programsSlice";
import { fetchGyms } from "@/services/redux/slices/gymsSlice";
import { fetchComments, addComment } from "@/services/redux/slices/commentsSlice";

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
  const dispatch = useDispatch();
  const { items: programs, loading: loadingPrograms, error: programsError } = useSelector((s) => s.programs);
  const { items: gyms, loading: loadingGyms, error: gymsError } = useSelector((s) => s.gyms);
  const { items: comments, loading: loadingComments, error: commentsError, adding: addingComment } = useSelector((s) => s.comments);
  const user = useSelector((s) => s.auth.user);
  const [comment, setComment] = useState("");
  const [commentStatus, setCommentStatus] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reviews, setReviews] = useState(initialReviews);

  useEffect(() => {
    dispatch(fetchPrograms());
    dispatch(fetchGyms());
    dispatch(fetchComments());
  }, [dispatch]);

    // Fetch comments from backend and inject into marquee reviews
  useEffect(() => {
    // whenever comments slice updates, rebuild marquee reviews
    const mapped = (comments || []).map((c) => {
      const userObj = c.user || c.user_id || {};
      const name = userObj.name || userObj.fullName || "User";
      return {
        name,
        username: `@${String(name).split(" ")[0].toLowerCase()}`,
        body: c.content || c.text || "",
        img: userObj.avatar || "https://avatar.vercel.sh/user",
      };
    });
    setReviews((prev) => [...mapped, ...initialReviews]);
  }, [comments]);

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
    await dispatch(addComment(text));
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
        try { await dispatch(addComment(text)); } finally { try { localStorage.removeItem("pending_comment"); } catch {} }
      })();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Header />
      <main>
        {/* Hero section doesn't need scroll reveal as it's above the fold */}
        <HeroSection />

{/* 
        <ScrollReveal baseOpacity={0} enableBlur={true} baseRotation={0} blurStrength={5}>
          <SearchBar />
        </ScrollReveal> */}

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

        {/* Gyms section (dynamic) */}
        <ScrollReveal baseOpacity={0} enableBlur={true} baseRotation={5} blurStrength={10}>
          <section id="gyms" className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">Featured Gyms</h2>
              {loadingGyms ? (
                <div className="text-center text-gray-600">Loading gyms...</div>
              ) : (
                <>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {gyms.map((gym) => (
                      <div key={gym._id} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                        <div className="relative aspect-[16/10] overflow-hidden">
                          <img src={(gym.photos && gym.photos[0]) || "https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=800"} alt={gym.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{gym.name}</h3>
                          {gym.location && (
                            <p className="text-gray-600 mb-4 flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                              {gym.location}
                            </p>
                          )}
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">{typeof gym.pricing !== "undefined" ? `$${Number(gym.pricing).toFixed(2)}` : ""}</span>
                            <Button asChild>
                              <Link to={`/gyms/${gym._id}`}>Consult</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>
        </ScrollReveal>

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
