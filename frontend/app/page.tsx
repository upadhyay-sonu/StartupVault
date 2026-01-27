"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/lib/useAuth";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push("/deals");
    } else {
      router.push("/register");
    }
  };

  const handleClaimDeal = () => {
    if (isAuthenticated) {
      router.push("/deals");
    } else {
      router.push("/register");
    }
  };

  const features = [
    {
      title: "Exclusive Deals",
      description: "Get up to 90% off on premium SaaS tools built for startups",
      icon: "✨",
    },
    {
      title: "Verified Community",
      description: "Access restricted deals when you verify your startup email",
      icon: "🔐",
    },
    {
      title: "One-Click Claims",
      description:
        "Claim deals instantly and get your coupon codes ready to use",
      icon: "⚡",
    },
    {
      title: "No Commitments",
      description: "Try any tool without mandatory contracts or hidden fees",
      icon: "🎯",
    },
  ];

  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        {/* Hero Section */}
        <motion.section
          variants={container}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32"
        >
          <motion.div variants={item} className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-accent via-blue-400 to-accent bg-clip-text text-transparent">
              Your Buisness Toolkit
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Access exclusive SaaS deals curated for founders and early-stage
              teams. Save thousands on the tools that power your growth.
            </p>
          </motion.div>

          <motion.div
            variants={item}
            className="flex gap-4 justify-center mb-20"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/deals")}
              className="btn-primary text-lg"
            >
              Explore Deals
            </motion.button>
            {!isHydrated ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled
                className="btn-secondary text-lg opacity-50"
              >
                Get Started
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetStarted}
                className="btn-secondary text-lg"
              >
                Get Started
              </motion.button>
            )}
          </motion.div>

          {/* Features Grid */}
          <motion.div
            variants={container}
            className="grid md:grid-cols-2 gap-6 mb-20"
          >
            {features.map((feature, i) => (
              <motion.div key={i} variants={item} className="card">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats Section */}
          <motion.div
            variants={item}
            className="grid md:grid-cols-3 gap-8 py-12 border-t border-gray-800"
          >
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">500+</div>
              <p className="text-gray-400">Active Deals</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">$2M+</div>
              <p className="text-gray-400">Total Savings</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">5k+</div>
              <p className="text-gray-400">Happy Founders</p>
            </div>
          </motion.div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-accent/10 to-blue-500/10 border-y border-gray-800"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-gray-400 mb-8">
              Join thousands of founders saving on tools they love
            </p>
            {!isHydrated ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled
                className="btn-primary text-lg opacity-50"
              >
                Claim Your First Deal
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClaimDeal}
                className="btn-primary text-lg"
              >
                Claim Your First Deal
              </motion.button>
            )}
          </div>
        </motion.section>
      </main>
    </>
  );
}
