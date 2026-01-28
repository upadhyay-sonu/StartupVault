"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import { authAPI, claimsAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { motion } from "framer-motion";

interface Claim {
  id: string;
  dealId: string;
  dealTitle: string;
  dealCategory: string;
  status: "pending" | "approved" | "rejected" | "expired";
  code?: string;
  claimedAt: string;
  approvedAt?: string;
}

interface Stats {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}

export default function Dashboard() {
  const router = useRouter();
  const { user, setUser, logout } = useAuthStore();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ name: "", company: "", role: "" });

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [claimsRes, statsRes] = await Promise.all([
          claimsAPI.getClaims({ limit: 50 }),
          claimsAPI.getStats(),
        ]);
        setClaims(claimsRes.data.claims);
        setStats(statsRes.data);
        setEditData({
          name: user.name,
          company: user.company || "",
          role: user.role || "",
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, router]);

  const handleUpdateProfile = async () => {
    try {
      const response = await authAPI.updateProfile(editData);
      setUser(response.data);
      setEditMode(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Profile skeleton */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card mb-12 animate-pulse"
            >
              <div className="h-10 bg-gray-700 rounded w-1/3 mb-6" />
              <div className="h-4 bg-gray-700 rounded w-1/2 mb-4" />
              <div className="grid md:grid-cols-2 gap-6">
                <div className="h-12 bg-gray-700 rounded" />
                <div className="h-12 bg-gray-700 rounded" />
              </div>
            </motion.div>

            {/* Stats skeleton */}
            <div className="grid md:grid-cols-4 gap-4 mb-12">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-8 bg-gray-700 rounded w-1/2 mx-auto mb-2" />
                  <div className="h-4 bg-gray-700 rounded w-2/3 mx-auto" />
                </div>
              ))}
            </div>

            {/* Claims skeleton */}
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-6 bg-gray-700 rounded w-1/3 mb-4" />
                  <div className="h-4 bg-gray-700 rounded w-2/3" />
                </div>
              ))}
            </div>
          </div>
        </main>
      </>
    );
  }

  const statusColor = {
    pending: "bg-warning/20 text-warning",
    approved: "bg-success/20 text-success",
    rejected: "bg-danger/20 text-danger",
    expired: "bg-gray-600/20 text-gray-400",
  };

  const statusLabel = {
    pending: "⏳ Pending",
    approved: "✓ Approved",
    rejected: "✗ Rejected",
    expired: "⏰ Expired",
  };

  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card mb-12"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                <p className="text-gray-400">{user.email}</p>
              </div>
              <button
                onClick={() => setEditMode(!editMode)}
                className="btn-secondary text-sm"
              >
                {editMode ? "Cancel" : "Edit Profile"}
              </button>
            </div>

            {editMode ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div>
                  <label
                    htmlFor="edit-name"
                    className="text-sm text-gray-300 mb-2 block"
                  >
                    Name
                  </label>
                  <input
                    id="edit-name"
                    type="text"
                    name="name"
                    value={editData.name}
                    onChange={(e) =>
                      setEditData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    autoComplete="name"
                    className="input-field"
                  />
                </div>
                <div>
                  <label
                    htmlFor="edit-company"
                    className="text-sm text-gray-300 mb-2 block"
                  >
                    Company
                  </label>
                  <input
                    id="edit-company"
                    type="text"
                    name="company"
                    value={editData.company}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        company: e.target.value,
                      }))
                    }
                    autoComplete="organization"
                    className="input-field"
                  />
                </div>
                <div>
                  <label
                    htmlFor="edit-role"
                    className="text-sm text-gray-300 mb-2 block"
                  >
                    Role
                  </label>
                  <select
                    id="edit-role"
                    name="role"
                    value={editData.role}
                    onChange={(e) =>
                      setEditData((prev) => ({ ...prev, role: e.target.value }))
                    }
                    className="input-field"
                  >
                    <option value="founder">Founder</option>
                    <option value="cto">CTO</option>
                    <option value="team_member">Team Member</option>
                    <option value="investor">Investor</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUpdateProfile}
                  className="btn-primary"
                >
                  Save Changes
                </motion.button>
              </motion.div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-400 text-sm">Company</p>
                  <p className="text-white font-medium">
                    {user.company || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Role</p>
                  <p className="text-white font-medium capitalize">
                    {user.role || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Verification Status</p>
                  <p className="text-white font-medium">
                    {user.isVerified ? "✓ Verified" : "○ Not Verified"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Member Since</p>
                  <p className="text-white font-medium">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Stats Section */}
          {stats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid md:grid-cols-4 gap-4 mb-12"
            >
              <div className="card text-center">
                <div className="text-3xl font-bold text-accent mb-2">
                  {stats.total}
                </div>
                <p className="text-gray-400 text-sm">Total Claims</p>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold text-warning mb-2">
                  {stats.pending}
                </div>
                <p className="text-gray-400 text-sm">Pending</p>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold text-success mb-2">
                  {stats.approved}
                </div>
                <p className="text-gray-400 text-sm">Approved</p>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold text-danger mb-2">
                  {stats.rejected}
                </div>
                <p className="text-gray-400 text-sm">Rejected</p>
              </div>
            </motion.div>
          )}

          {/* Claims Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="section-title">Your Claimed Deals</h2>

            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="card animate-pulse">
                    <div className="h-6 bg-gray-700 rounded w-1/3 mb-4" />
                    <div className="h-4 bg-gray-700 rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : claims.length > 0 ? (
              <div className="space-y-4">
                {claims.map((claim) => (
                  <motion.div
                    key={claim.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="card"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">
                          {claim.dealTitle}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>{claim.dealCategory}</span>
                          <span>
                            Claimed:{" "}
                            {new Date(claim.claimedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded text-sm font-medium ${
                          statusColor[claim.status]
                        }`}
                      >
                        {statusLabel[claim.status]}
                      </span>
                    </div>

                    {claim.code && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-4 p-3 bg-accent/10 border border-accent/20 rounded"
                      >
                        <p className="text-xs text-gray-400 mb-1">
                          Coupon Code
                        </p>
                        <p className="font-mono text-accent font-bold text-lg">
                          {claim.code}
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="card text-center py-12"
              >
                <p className="text-gray-400 mb-4">No claimed deals yet</p>
                <a href="/deals" className="btn-primary">
                  Explore Deals
                </a>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>
    </>
  );
}
