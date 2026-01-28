"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import { authAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { motion } from "framer-motion";

export default function Login() {
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.login(formData.email, formData.password);
      setToken(response.data.token);
      setUser(response.data.user);
      router.push("/deals");
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="card">
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-gray-400 mb-8">
              Sign in to access your claimed deals
            </p>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-4 p-4 bg-danger/20 border border-danger/50 rounded-lg text-danger text-sm"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
               <motion.div
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: 0.1 }}
               >
                 <label
                   htmlFor="email"
                   className="block text-sm font-medium text-gray-300 mb-2"
                 >
                   Email
                 </label>
                 <motion.input
                   whileFocus={{ scale: 1.01 }}
                   id="email"
                   type="email"
                   name="email"
                   value={formData.email}
                   onChange={handleChange}
                   autoComplete="email"
                   className="input-field transition-all duration-200"
                   placeholder="you@startup.com"
                 />
               </motion.div>

               <motion.div
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: 0.15 }}
               >
                 <label
                   htmlFor="password"
                   className="block text-sm font-medium text-gray-300 mb-2"
                 >
                   Password
                 </label>
                 <motion.input
                   whileFocus={{ scale: 1.01 }}
                   id="password"
                   type="password"
                   name="password"
                   value={formData.password}
                   onChange={handleChange}
                   autoComplete="current-password"
                   className="input-field transition-all duration-200"
                   placeholder="••••••••"
                 />
               </motion.div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                type="submit"
                className="btn-primary w-full"
              >
                {loading ? "Signing In..." : "Sign In"}
              </motion.button>
            </form>

            <p className="text-gray-400 text-center mt-6">
              Don't have an account?{" "}
              <Link href="/register" className="text-accent hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
