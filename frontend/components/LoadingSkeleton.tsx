'use client';

import { motion } from 'framer-motion';

const shimmerVariants = {
  shimmer: {
    backgroundPosition: ['200% 0%', '-200% 0%'],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

export function DealCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="card"
    >
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <motion.div
              variants={shimmerVariants}
              animate="shimmer"
              className="h-4 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded w-24 mb-2 bg-[length:200%_100%]"
            />
            <motion.div
              variants={shimmerVariants}
              animate="shimmer"
              transition={{ delay: 0.1 }}
              className="h-6 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded w-40 bg-[length:200%_100%]"
            />
          </div>
          <motion.div
            variants={shimmerVariants}
            animate="shimmer"
            transition={{ delay: 0.2 }}
            className="h-8 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded w-16 bg-[length:200%_100%]"
          />
        </div>
        <motion.div
          variants={shimmerVariants}
          animate="shimmer"
          transition={{ delay: 0.15 }}
          className="h-4 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded w-full bg-[length:200%_100%]"
        />
        <motion.div
          variants={shimmerVariants}
          animate="shimmer"
          transition={{ delay: 0.25 }}
          className="h-12 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded bg-[length:200%_100%]"
        />
      </div>
    </motion.div>
  );
}

export function DealDetailsSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      <div className="space-y-4">
        <motion.div
          variants={shimmerVariants}
          animate="shimmer"
          className="h-10 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded w-3/4 bg-[length:200%_100%]"
        />
        <motion.div
          variants={shimmerVariants}
          animate="shimmer"
          transition={{ delay: 0.1 }}
          className="h-24 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded bg-[length:200%_100%]"
        />
      </div>
      <div className="card space-y-4">
        <motion.div
          variants={shimmerVariants}
          animate="shimmer"
          transition={{ delay: 0.15 }}
          className="h-4 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded w-1/2 bg-[length:200%_100%]"
        />
        <motion.div
          variants={shimmerVariants}
          animate="shimmer"
          transition={{ delay: 0.25 }}
          className="h-4 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded w-2/3 bg-[length:200%_100%]"
        />
      </div>
    </motion.div>
  );
}
