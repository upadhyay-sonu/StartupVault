'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface DealCardProps {
  id: string;
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

export default function DealCard({
  id,
  title,
  description,
  category,
  discount,
  discountType,
  partner,
  currentClaims,
  maxClaims,
  isLocked,
  isClaimed,
}: DealCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const progress = (currentClaims / maxClaims) * 100;
  const discountDisplay = discountType === 'percentage' ? `${discount}%` : `$${discount}`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isLocked) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: (e.clientX - rect.left - rect.width / 2) / 10,
      y: (e.clientY - rect.top - rect.height / 2) / 10,
    });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={!isLocked ? { y: -6, scale: 1.02 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{
        rotateX: !isLocked ? mousePosition.y : 0,
        rotateY: !isLocked ? mousePosition.x : 0,
        transformStyle: 'preserve-3d',
      } as any}
      className="relative group"
    >
      <Link href={id ? `/deals/${id}` : '#'} className="block">
         <motion.div
           className="card-hover relative h-full transition-shadow duration-300"
           style={{
             boxShadow: !isLocked
               ? `0 20px 40px rgba(59, 130, 246, ${Math.abs(mousePosition.y) * 0.05 + 0.1}), 0 10px 20px rgba(0, 0, 0, 0.3)`
               : '0 4px 6px rgba(0, 0, 0, 0.2)',
           } as any}
         >
          {/* Header with badge */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 text-xs bg-accent/20 text-accent rounded">
                  {category}
                </span>
                {isClaimed && (
                  <span className="px-2 py-1 text-xs bg-success/20 text-success rounded">
                    Claimed
                  </span>
                )}
              </div>
              <h3 className="text-lg font-semibold text-white">{title}</h3>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-accent">{discountDisplay}</div>
              <p className="text-xs text-gray-400">off</p>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">{description}</p>

          {/* Partner */}
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-700">
            <div className="w-8 h-8 rounded bg-gray-700 flex items-center justify-center text-xs font-bold">
              {partner.name.charAt(0)}
            </div>
            <span className="text-sm text-gray-300">{partner.name}</span>
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-400">Claims</span>
              <span className="text-xs text-gray-400">
                {currentClaims}/{maxClaims}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="bg-accent rounded-full h-2"
              />
            </div>
          </div>

          {isLocked && (
            <div className="locked-overlay">
              <div className="text-center">
                <p className="text-white font-semibold">Requires Verification</p>
                <p className="text-gray-300 text-sm mt-1">Verify your email to unlock</p>
              </div>
            </div>
          )}
          </motion.div>
          </Link>
          </motion.div>
          );
          }
