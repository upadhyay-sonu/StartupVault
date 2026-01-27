'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import DealCard from '@/components/DealCard';
import { DealCardSkeleton } from '@/components/LoadingSkeleton';
import { dealsAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { motion } from 'framer-motion';

interface Deal {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  category: string;
  discount: number;
  discountType: 'percentage' | 'flat';
  partner: {
    name: string;
    logo: string;
  };
  currentClaims: number;
  maxClaims: number;
  isLocked: boolean;
  isClaimed: boolean;
}

const CATEGORIES = [
  'hosting',
  'analytics',
  'payment',
  'communication',
  'productivity',
  'design',
  'development',
  'marketing',
];

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);

  const user = useAuthStore((state) => state.user);

  const LIMIT = 12;

  useEffect(() => {
    const fetchDeals = async () => {
      setLoading(true);
      try {
        const response = await dealsAPI.getDeals({
          search: search || undefined,
          category: selectedCategory || undefined,
          limit: LIMIT,
          skip: page * LIMIT,
        });
        setDeals(response.data.deals);
        setTotal(response.data.total);
      } catch (error) {
        console.error('Failed to fetch deals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, [search, selectedCategory, page]);

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="section-title">Explore Deals</h1>
            <p className="text-gray-400 mb-8">
              {user?.isVerified
                ? '✓ You have access to all deals including verified-only offers'
                : 'Some deals are locked. Verify your email to unlock premium deals.'}
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 space-y-4"
          >
            <input
              type="text"
              placeholder="Search deals..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              className="input-field w-full"
            />

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setSelectedCategory('');
                  setPage(0);
                }}
                className={`btn-small ${
                  selectedCategory === ''
                    ? 'bg-accent text-white'
                    : 'bg-secondary text-gray-300 hover:bg-gray-600'
                }`}
              >
                All Categories
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setPage(0);
                  }}
                  className={`btn-small ${
                    selectedCategory === cat
                      ? 'bg-accent text-white'
                      : 'bg-secondary text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Deals Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: LIMIT }).map((_, i) => (
                <DealCardSkeleton key={i} />
              ))}
            </div>
          ) : deals.length > 0 ? (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
              >
                {deals.map((deal) => (
                  <motion.div
                    key={deal._id || deal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <DealCard {...deal} id={deal._id || deal.id || ''} />
                  </motion.div>
                ))}
              </motion.div>

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-center items-center gap-4 mt-12"
                >
                  <button
                    onClick={() => setPage(Math.max(0, page - 1))}
                    disabled={page === 0}
                    className="btn-secondary disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-gray-400">
                    Page {page + 1} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                    disabled={page === totalPages - 1}
                    className="btn-secondary disabled:opacity-50"
                  >
                    Next
                  </button>
                </motion.div>
              )}
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-gray-400 text-lg">No deals found matching your criteria</p>
            </motion.div>
          )}
        </div>
      </main>
    </>
  );
}
