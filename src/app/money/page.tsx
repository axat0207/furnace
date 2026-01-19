'use client';

import { useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FocusBoard } from '@/components/dashboard/FocusBoard';
import { NonNegotiables } from '@/components/dashboard/NonNegotiables';
import { ProgressRing } from '@/components/dashboard/ProgressRing';
import { DetoxLogger } from '@/components/dashboard/DetoxLogger';
import { LiveMetrics } from '@/components/dashboard/LiveMetrics';
import { useApp } from '@/context/AppContext';
import { calculateStats } from '@/lib/gamification';
import { motion } from 'framer-motion';

export default function Home() {
  const router = useRouter();
  
  // Verify authentication on client side as well - redirect immediately if not authenticated
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/user', { 
          credentials: 'include', // Ensure cookies are sent
          cache: 'no-store' // Don't cache the auth check
        });
        if (!res.ok || res.status === 401) {
          router.replace('/login');
          return;
        }
      } catch (error) {
        router.replace('/login');
        return;
      }
    }
    checkAuth();
  }, [router]);
  const { state } = useApp();
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const { levelInfo } = useMemo(() => calculateStats(state), [state]);

  const greetings = [
    "Ready to ship, Developer?",
    "Systems online.",
    "Build the future.",
    "Focus is the key.",
    "Discipline equals freedom."
  ];

  // Random greeting based on day
  const greeting = greetings[new Date().getDate() % greetings.length];

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      {/* Header */}
      <motion.div
        className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)] neon-text">
            Command Center
          </h1>
          <p className="text-[var(--text-secondary)] font-mono mt-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--neon-green)] animate-pulse" />
            {today}
          </p>
        </div>

        <div className="text-right hidden md:block">
          <p className="text-sm font-bold text-[var(--neon-blue)]">{greeting}</p>
          <p className="text-xs text-[var(--text-muted)] font-mono">Current Rank: {levelInfo.title}</p>
        </div>
      </motion.div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column - Actionable (2/3 width) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <FocusBoard />
          <NonNegotiables />
          <DetoxLogger />
        </div>

        {/* Right Column - Status (1/3 width) */}
        <div className="flex flex-col gap-6">
          <ProgressRing />
          <LiveMetrics />
        </div>
      </div>
    </div>
  );
}
