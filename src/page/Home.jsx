import React from "react";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { Toaster } from "@/components/ui/sonner";
import { Marquee } from "@/components/ui/marquee";
import { cn } from "@/lib/utils";
import ScrollReveal from "../components/ui/scroll-reveal";

// Landing page components
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import SearchBar from "../components/SearchBar";
import WhyChooseUs from "../components/WhyChooseUs";
import GymsSection from "../components/GymsSection";
import CTA from "../components/CTA";
import ContactForm from "../components/ContactForm";
import Footer from "../components/Footer";

const reviews = [
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

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

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

const MarqueeDemo = () => (
  <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-10">
     <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">
          Explore Our custemers reviews
        </h2>
    <Marquee pauseOnHover className="[--duration:20s]">
      {firstRow.map((review) => (
        <ReviewCard key={review.username} {...review} />
      ))}
    </Marquee>
    <Marquee reverse pauseOnHover className="[--duration:20s]">
      {secondRow.map((review) => (
        <ReviewCard key={review.username} {...review} />
      ))}
    </Marquee>

    {/* gradient fade edges */}
    <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-white dark:from-background"></div>
    <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-white dark:from-background"></div>
  </div>
);

const testimonials = [
  {
    quote:
      "The attention to detail and innovative features have completely transformed our workflow. This is exactly what we've been looking for.",
    name: "Sarah Chen",
    designation: "Product Manager at TechFlow",
    src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560&auto=format&fit=crop",
  },
  {
    quote:
      "Implementation was seamless and the results exceeded our expectations. The platform's flexibility is remarkable.",
    name: "Michael Rodriguez",
    designation: "CTO at InnovateSphere",
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop",
  },
  {
    quote:
      "This solution has significantly improved our team's productivity. The intuitive interface makes complex tasks simple.",
    name: "Emily Watson",
    designation: "Operations Director at CloudScale",
    src: "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540&auto=format&fit=crop",
  },
  {
    quote:
      "Outstanding support and robust features. It's rare to find a product that delivers on all its promises.",
    name: "James Kim",
    designation: "Engineering Lead at DataPro",
    src: "https://images.unsplash.com/photo-1636041293178-808a6762ab39?q=80&w=3464&auto=format&fit=crop",
  },
  {
    quote:
      "The scalability and performance have been game-changing for our organization. Highly recommend to any growing business.",
    name: "Lisa Thompson",
    designation: "VP of Technology at FutureNet",
    src: "https://images.unsplash.com/photo-1624561172888-ac93c696e10c?q=80&w=2592&auto=format&fit=crop",
  },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Header />
      <main>
        {/* Hero section doesn't need scroll reveal as it's above the fold */}
        <HeroSection />
        
        <ScrollReveal baseOpacity={0} enableBlur={true} baseRotation={0} blurStrength={5}>
          <SearchBar />
        </ScrollReveal>

        <ScrollReveal baseOpacity={0} enableBlur={true} baseRotation={3} blurStrength={8}>
          <WhyChooseUs />
        </ScrollReveal>

        {/* Testimonials with subtle animation */}
        <ScrollReveal baseOpacity={0} enableBlur={false} baseRotation={2} blurStrength={0}>
          <section className="py-16">
            <AnimatedTestimonials testimonials={testimonials} />
          </section>
        </ScrollReveal>

        {/* Marquee section with fade-in only */}
        <ScrollReveal baseOpacity={0} enableBlur={false} baseRotation={0} blurStrength={0}>
          <section className="py-16">
            <MarqueeDemo />
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
      <Footer />
    </div>
  );
};

export default Home;
