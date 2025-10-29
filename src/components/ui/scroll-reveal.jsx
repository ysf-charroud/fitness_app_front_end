"use client";

import React, { useEffect, useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";

export const ScrollReveal = ({
  children,
  width = "100%",
  viewTriggerOffset = true,
  delay = 0,
  duration = 0.5,
  direction = "up", // up, down, left, right
  scale = 1,
  opacity = 0,
  blur = 0,
  rotate = 0,
  className = "",
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: viewTriggerOffset ? "-150px" : "0px" }); // 👈 allow re-trigger
  const controls = useAnimation();

  // Animation variants based on direction
  const variants = {
    hidden: {
      opacity,
      y: direction === "up" ? 100 : direction === "down" ? -100 : 0,
      x: direction === "left" ? 100 : direction === "right" ? -100 : 0,
      scale,
      filter: `blur(${blur}px)`,
      rotate,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      filter: "blur(0px)",
      rotate: 0,
    },
  };

  useEffect(() => {
    if (isInView) {
      controls.start("visible"); // 👈 animate in
    } else {
      controls.start("hidden"); // 👈 animate out when leaving
    }
  }, [isInView, controls]);

  return (
    <div
      ref={ref}
      style={{
        width,
        position: "relative",
        overflow: "hidden",
      }}
      className={className}
    >
      <motion.div
        variants={variants}
        initial="hidden"
        animate={controls}
        transition={{
          duration,
          delay,
          ease: "easeOut",
        }}
        style={{ width: "100%" }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export const RevealList = ({
  children,
  width = "100%",
  delay = 0.2,
  interval = 0.1,
  duration = 0.5,
  direction = "up",
  scale = 1,
  opacity = 0,
  blur = 15,
  rotate = 0,
  className = "",
}) => {
  return (
    <div className={className} style={{ width }}>
      {React.Children.map(children, (child, index) => (
        <ScrollReveal
          key={index}
          delay={delay + index * interval}
          duration={duration}
          direction={direction}
          scale={scale}
          opacity={opacity}
          blur={blur}
          rotate={rotate}
          viewTriggerOffset
        >
          {child}
        </ScrollReveal>
      ))}
    </div>
  );
};

export default ScrollReveal;
