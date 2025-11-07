import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const CarouselContext = React.createContext(null);

function useCarouselContext(component) {
  const context = React.useContext(CarouselContext);
  if (!context) {
    throw new Error(`${component} must be used within <Carousel>`);
  }
  return context;
}

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export const Carousel = ({ className, children, value = 0, onValueChange, slideCount }) => {
  const countFromChildren = React.Children.toArray(children).find(
    (child) => child?.type?.displayName === "CarouselContent"
  )?.props?.count;
  const total = typeof slideCount === "number" ? slideCount : countFromChildren ?? 0;
  const safeCount = Math.max(total, 0);

  const updateIndex = React.useCallback(
    (next) => {
      if (typeof onValueChange !== "function" || safeCount < 1) return;
      const wrapped = ((next % safeCount) + safeCount) % safeCount;
      onValueChange(wrapped);
    },
    [onValueChange, safeCount]
  );

  const goTo = React.useCallback(
    (index, bound = true) => {
      if (typeof onValueChange !== "function" || safeCount < 1) return;
      const target = bound ? clamp(index, 0, safeCount - 1) : index;
      onValueChange(target);
    },
    [onValueChange, safeCount]
  );

  const contextValue = React.useMemo(
    () => ({
      current: safeCount < 1 ? 0 : clamp(value, 0, safeCount - 1),
      count: safeCount,
      goTo,
      next: () => updateIndex(value + 1),
      prev: () => updateIndex(value - 1),
    }),
    [goTo, safeCount, updateIndex, value]
  );

  return (
    <CarouselContext.Provider value={contextValue}>
      <div className={cn("relative", className)}>{children}</div>
    </CarouselContext.Provider>
  );
};

export const CarouselContent = ({ className, children, count, drag = true }) => {
  const { current, count: total, next, prev } = useCarouselContext("CarouselContent");
  const items = React.Children.toArray(children);
  const slides = typeof count === "number" ? count : items.length;

  const handleDragEnd = (_, info) => {
    if (!drag || total <= 1) return;
    const threshold = 60;
    if (info.offset.x < -threshold) {
      next();
    } else if (info.offset.x > threshold) {
      prev();
    }
  };

  return (
    <div className="overflow-hidden">
      <motion.div
        className={cn("flex touch-pan-y select-none", className)}
        drag={drag && total > 1 ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        animate={{ x: `-${current * 100}%` }}
        transition={{ type: "spring", stiffness: 200, damping: 30, mass: 0.4 }}
      >
        {items.map((child, index) => (
          <motion.div
            key={index}
            className="w-full shrink-0 grow-0 basis-full"
            initial={{ opacity: 0.7 }}
            animate={{ opacity: current === index ? 1 : 0.7 }}
            transition={{ duration: 0.3 }}
          >
            {child}
          </motion.div>
        ))}
      </motion.div>
      <AnimatePresence>
        {total > 1 && (
          <motion.div
            className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {Array.from({ length: total }).map((_, index) => (
              <span
                key={index}
                className={cn(
                  "h-1.5 w-8 rounded-full bg-white/50 transition-colors",
                  index === current ? "bg-white" : "bg-white/30"
                )}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

CarouselContent.displayName = "CarouselContent";

export const CarouselItem = ({ className, children, ...props }) => (
  <div className={cn("h-full w-full", className)} {...props}>
    {children}
  </div>
);

CarouselItem.displayName = "CarouselItem";

export const CarouselPrevious = React.forwardRef(({ className, ...props }, ref) => {
  const { prev, count } = useCarouselContext("CarouselPrevious");
  if (count < 2) return null;
  return (
    <button
      ref={ref}
      type="button"
      onClick={prev}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-lg transition hover:bg-primary hover:text-white",
        className
      )}
      {...props}
    >
      {props.children}
    </button>
  );
});

CarouselPrevious.displayName = "CarouselPrevious";

export const CarouselNext = React.forwardRef(({ className, ...props }, ref) => {
  const { next, count } = useCarouselContext("CarouselNext");
  if (count < 2) return null;
  return (
    <button
      ref={ref}
      type="button"
      onClick={next}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-lg transition hover:bg-primary hover:text-white",
        className
      )}
      {...props}
    >
      {props.children}
    </button>
  );
});

CarouselNext.displayName = "CarouselNext";
