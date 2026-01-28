/**
 * Centralized motion configuration for consistent animations across the app
 * Follows premium SaaS design principles: smooth, intentional, never excessive
 */

export const pageVariants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.23, 1, 0.320, 1], // Custom ease (fast in, smooth out)
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

export const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

export const itemVariants = {
  initial: { opacity: 0, y: 4 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

export const cardVariants = {
  initial: { opacity: 0, y: 8, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

export const skeletonPulse = {
  opacity: [0.5, 1, 0.5],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

export const shimmer = {
  backgroundPosition: ["200% 0%", "-200% 0%"],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "linear",
  },
};

/**
 * Micro-interaction presets
 */
export const buttonInteraction = {
  whileHover: { scale: 1.02, y: -1 },
  whileTap: { scale: 0.98, y: 0 },
  transition: { type: "spring", stiffness: 400, damping: 17 },
};

export const cardHoverLift = {
  whileHover: { y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" },
  transition: { type: "spring", stiffness: 300, damping: 20 },
};

export const formInputFocus = {
  scale: 1.01,
  transition: { duration: 0.2, ease: "easeOut" },
};

/**
 * Reduced motion respecting utilities
 */
export const prefersReducedMotion = "@media (prefers-reduced-motion: reduce)";

export const respectReducedMotion = (animation: any) => {
  return {
    ...animation,
    [prefersReducedMotion]: {
      transition: { duration: 0 },
    },
  };
};
