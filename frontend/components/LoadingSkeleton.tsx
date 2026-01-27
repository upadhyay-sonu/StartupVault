'use client';

import { motion } from 'framer-motion';

export function DealCardSkeleton() {
  return (
    <div className="card">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <motion.div
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="h-4 bg-gray-700 rounded w-24 mb-2"
            />
            <motion.div
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="h-6 bg-gray-700 rounded w-40"
            />
          </div>
          <motion.div
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="h-8 bg-gray-700 rounded w-16"
          />
        </div>
        <motion.div
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="h-4 bg-gray-700 rounded w-full"
        />
        <motion.div
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="h-12 bg-gray-700 rounded"
        />
      </div>
    </div>
  );
}

export function DealDetailsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <motion.div
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="h-10 bg-gray-700 rounded w-3/4"
        />
        <motion.div
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="h-24 bg-gray-700 rounded"
        />
      </div>
      <div className="card space-y-4">
        <motion.div
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="h-4 bg-gray-700 rounded w-1/2"
        />
        <motion.div
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="h-4 bg-gray-700 rounded w-2/3"
        />
      </div>
    </div>
  );
}
