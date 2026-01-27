"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface AuthPromptProps {
  title: string;
  description: string;
  onClose: () => void;
}

export default function AuthPrompt({
  title,
  description,
  onClose,
}: AuthPromptProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-secondary border border-gray-700 rounded-lg p-8 max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-gray-400 mb-8">{description}</p>

        <div className="space-y-3">
          <Link href="/login" className="w-full block">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary w-full"
              onClick={onClose}
            >
              Log In
            </motion.button>
          </Link>
          <Link href="/register" className="w-full block">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-secondary w-full"
              onClick={onClose}
            >
              Sign Up
            </motion.button>
          </Link>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 text-gray-400 hover:text-gray-300 transition-colors text-sm"
        >
          Cancel
        </button>
      </motion.div>
    </motion.div>
  );
}
