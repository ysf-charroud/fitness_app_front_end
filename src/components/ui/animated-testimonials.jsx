import React from "react";
import { useCallback, useEffect, useState } from "react";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const AnimatedTestimonials = ({
  testimonials,
  autoplay = false,
  className,
  fetchCoaches = false,
}) => {
  const [active, setActive] = useState(0);
  const [coaches, setCoaches] = useState([]);
  const data = fetchCoaches ? coaches : (testimonials || []);

  const handleNext = useCallback(() => {
    if (!data.length) return;
    setActive((prev) => (prev + 1) % data.length);
  }, [data.length]);

  const handlePrev = useCallback(() => {
    if (!data.length) return;
    setActive((prev) => (prev - 1 + data.length) % data.length);
  }, [data.length]);

  const isActive = useCallback((index) => {
    return index === active;
  }, [active]);

  useEffect(() => {
    if (autoplay && data.length > 0) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay, handleNext, data.length]);

  useEffect(() => {
    if (!fetchCoaches) return;
    let mounted = true;
    const load = async () => {
      try {
        const { data: resp } = await api.get("/coaches", { params: { page: 1, limit: 6 } });
        const list = Array.isArray(resp) ? resp : (resp?.coaches || resp?.data || []);
        const mapped = list.map((c) => ({
          id: c._id || c.id,
          name: c.name || c.fullName || "Coach",
          designation: c.specialty || c.expertise || "Fitness",
          quote: c.bio || "Helping you reach your goals.",
          src: c.image || c.avatar || "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400",
        }));
        if (mounted) setCoaches(mapped);
      } catch (e) {
        if (mounted) setCoaches([]);
      }
    };
    load();
    return () => { mounted = false };
  }, [fetchCoaches]);

  const randomRotateY = () => {
    return Math.floor(Math.random() * 21) - 10;
  };
  return (
    <div
      className={cn("max-w-sm md:max-w-4xl mx-auto px-4 md:px-8 lg:px-12 py-20", className)}>
         <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">
          THE BEST COACHES 
        </h2>
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-20">
        <div>
          <div className="relative h-80 w-full">
            <AnimatePresence>
              {data.map((testimonial, index) => (
                <motion.div
                  key={testimonial.src}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    z: -100,
                    rotate: randomRotateY(),
                  }}
                  animate={{
                    opacity: isActive(index) ? 1 : 0.7,
                    scale: isActive(index) ? 1 : 0.95,
                    z: isActive(index) ? 0 : -100,
                    rotate: isActive(index) ? 0 : randomRotateY(),
                    zIndex: isActive(index)
                      ? 999
                      : data.length + 2 - index,
                    y: isActive(index) ? [0, -80, 0] : 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    z: 100,
                    rotate: randomRotateY(),
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 origin-bottom">
                  <img
                    src={testimonial.src}
                    alt={testimonial.name}
                    draggable={false}
                    className="h-full w-full rounded-3xl object-cover object-center" />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        <div className="flex justify-between flex-col py-4">
          <motion.div
            key={active}
            initial={{
              y: 20,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: -20,
              opacity: 0,
            }}
            transition={{
              duration: 0.2,
              ease: "easeInOut",
            }}>
            {data.length > 0 && (
              <>
              <h3 className="text-2xl font-bold text-foreground">
                {data[active].name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {data[active].designation}
              </p>
              <motion.p className="text-lg text-muted-foreground mt-8">
              {data[active].quote.split(" ").map((word, index) => (
                <motion.span
                  key={index}
                  initial={{
                    filter: "blur(10px)",
                    opacity: 0,
                    y: 5,
                  }}
                  animate={{
                    filter: "blur(0px)",
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.2,
                    ease: "easeInOut",
                    delay: 0.02 * index,
                  }}
                  className="inline-block">
                  {word}&nbsp;
                </motion.span>
              ))}
            </motion.p>
              </>
            )}
          </motion.div>
          <div className="flex gap-4 pt-12 md:pt-0 items-center">
            <button
              onClick={handlePrev}
              className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center group/button">
              <IconArrowLeft
                className="h-5 w-5 text-foreground group-hover/button:rotate-12 transition-transform duration-300" />
            </button>
            <button
              onClick={handleNext}
              className="h-7 w-7 rounded-full bg-secondary flex items-center justify-center group/button">
              <IconArrowRight
                className="h-5 w-5 text-foreground group-hover/button:-rotate-12 transition-transform duration-300" />
            </button>
            {data.length > 0 && data[active].id && (
              <Button asChild>
                <Link to={`/coaches/${data[active].id}`}>View Profile</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="mt-10 flex justify-center">
        <Button asChild>
          <Link to="/coaches">View More</Link>
        </Button>
      </div>
    </div>
  );
};