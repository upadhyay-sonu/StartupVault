"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import { DealDetailsSkeleton } from "@/components/LoadingSkeleton";
import AuthPrompt from "@/components/AuthPrompt";
import { dealsAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { useAuth } from "@/lib/useAuth";
import { motion } from "framer-motion";

interface Deal {
  _id: string;
  title: string;
  description: string;
  category: string;
  discount: number;
  discountType: "percentage" | "flat";
  partner: {
    name: string;
    logo: string;
    description: string;
    website: string;
  };
  currentClaims: number;
  maxClaims: number;
  terms: string;
  expiresAt: string;
  isLocked: boolean;
  userClaim?: {
    status: string;
    code?: string;
  };
}

export default function DealDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  const { user } = useAuthStore();
  const { isAuthenticated, isHydrated } = useAuth();

  useEffect(() => {
    const fetchDeal = async () => {
      try {
        const response = await dealsAPI.getDealById(id);
        setDeal(response.data);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to load deal");
      } finally {
        setLoading(false);
      }
    };

    fetchDeal();
  }, [id]);

  const handleClaim = async () => {
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }

    setClaiming(true);
    setError("");

    try {
      const response = await dealsAPI.claimDeal(id);
      setSuccess("Deal claimed successfully!");
      setDeal((prev) =>
        prev
          ? {
              ...prev,
              userClaim: {
                status: response.data.status,
                code: response.data.code,
              },
              currentClaims: prev.currentClaims + 1,
            }
          : null,
      );
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to claim deal");
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <DealDetailsSkeleton />
        </div>
      </>
    );
  }

  if (!deal) {
    return (
      <>
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Deal not found</h1>
          <Link href="/deals" className="btn-primary">
            Back to Deals
          </Link>
        </div>
      </>
    );
  }

  const discountDisplay =
    deal.discountType === "percentage"
      ? `${deal.discount}%`
      : `$${deal.discount}`;
  const expiryDate = new Date(deal.expiresAt);
  const daysLeft = Math.ceil(
    (expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );

  return (
    <>
      <Navigation />
      {showAuthPrompt && (
        <AuthPrompt
          title="Log in to claim your first deal"
          description="Create an account to start saving on premium SaaS tools."
          onClose={() => setShowAuthPrompt(false)}
        />
      )}
      <main className="min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            href="/deals"
            className="text-accent hover:underline mb-8 inline-block"
          >
            ← Back to Deals
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-accent/20 text-accent rounded text-sm font-medium">
                  {deal.category}
                </span>
                {deal.userClaim && (
                  <span className="px-3 py-1 bg-success/20 text-success rounded text-sm font-medium">
                    Claimed - {deal.userClaim.status}
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-bold mb-4">{deal.title}</h1>
              <p className="text-xl text-gray-300">{deal.description}</p>
            </div>

            {deal.isLocked && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 bg-warning/20 border border-warning/50 rounded-lg text-warning"
              >
                🔒 This deal requires verified email to claim. Please verify
                your email first.
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 bg-danger/20 border border-danger/50 rounded-lg text-danger"
              >
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 bg-success/20 border border-success/50 rounded-lg text-success"
              >
                {success}
              </motion.div>
            )}

            {/* Main Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left: Partner & Terms */}
              <div className="space-y-6">
                <motion.div
                  className="card"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <h2 className="text-xl font-bold mb-4">Partner</h2>
                  <div className="space-y-4">
                    <div>
                      <div className="w-12 h-12 rounded bg-accent/20 flex items-center justify-center text-lg font-bold mb-3">
                        {deal.partner.name.charAt(0)}
                      </div>
                      <h3 className="text-lg font-semibold">
                        {deal.partner.name}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {deal.partner.description}
                      </p>
                    </div>
                    <a
                      href={deal.partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline text-sm"
                    >
                      Visit Website →
                    </a>
                  </div>
                </motion.div>

                <motion.div
                  className="card"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <h2 className="text-xl font-bold mb-4">Terms & Conditions</h2>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {deal.terms}
                  </p>
                </motion.div>
              </div>

              {/* Right: Claim Card */}
              <motion.div
                className="card sticky top-24"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="space-y-6">
                  {/* Discount Badge */}
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Total Discount</p>
                    <div className="text-5xl font-bold text-accent">
                      {discountDisplay}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="border-t border-gray-700 pt-4">
                    <p className="text-gray-400 text-sm mb-2">Claims</p>
                    <p className="text-lg font-semibold mb-3">
                      {deal.currentClaims} / {deal.maxClaims}
                    </p>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{
                          width: `${(deal.currentClaims / deal.maxClaims) * 100}%`,
                        }}
                        transition={{ duration: 1 }}
                        className="bg-accent rounded-full h-3"
                      />
                    </div>
                  </div>

                  {/* Expiry */}
                  <div className="border-t border-gray-700 pt-4">
                    <p className="text-gray-400 text-sm mb-1">Expires In</p>
                    <p className="text-lg font-semibold">
                      {daysLeft > 0 ? `${daysLeft} days` : "Expired"}
                    </p>
                  </div>

                  {/* Claim Button */}
                  {deal.userClaim ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-3 border-t border-gray-700 pt-4"
                    >
                      <div className="p-4 bg-success/10 border border-success/20 rounded">
                        <p className="text-xs text-gray-400 mb-1">Your Code</p>
                        <p className="text-lg font-mono font-bold text-success">
                          {deal.userClaim.code}
                        </p>
                      </div>
                      <p className="text-xs text-gray-400">
                        Use this code when signing up or purchasing
                      </p>
                    </motion.div>
                  ) : (
                    <motion.button
                      whileHover={
                        !claiming && !deal.isLocked && isHydrated
                          ? { scale: 1.02 }
                          : {}
                      }
                      whileTap={
                        !claiming && !deal.isLocked && isHydrated
                          ? { scale: 0.98 }
                          : {}
                      }
                      onClick={handleClaim}
                      disabled={claiming || deal.isLocked || !isHydrated}
                      className="btn-primary w-full mt-4 border-t border-gray-700 pt-4"
                    >
                      {!isHydrated
                        ? "Loading..."
                        : !isAuthenticated
                          ? "Log In to Claim"
                          : deal.isLocked
                            ? "Verify Email to Claim"
                            : claiming
                              ? "Claiming..."
                              : "Claim This Deal"}
                    </motion.button>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
}
