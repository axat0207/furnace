'use client';

import { useMemo } from 'react';
import { FocusBoard } from '@/components/dashboard/FocusBoard';
import { NonNegotiables } from '@/components/dashboard/NonNegotiables';
import { ProgressRing } from '@/components/dashboard/ProgressRing';
import { DetoxLogger } from '@/components/dashboard/DetoxLogger';
import { useApp } from '@/context/AppContext';
import { calculateStats } from '@/lib/gamification';
import { motion } from 'framer-motion';

export default function Home() {
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

          {/* Motivation/Stats Card */}
          <motion.div
            className="glass-panel p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase mb-4">Live Metrics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[var(--text-secondary)]">Current Streak</span>
                <span className="font-mono text-[var(--neon-purple)] font-bold">
                  {/* Logic to get streaks from each habit? Or just global max? */}
                  Active
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-[var(--text-secondary)]">XP Gained Today</span>
                <span className="font-mono text-[var(--neon-blue)] font-bold">Isocalcing...</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-[var(--text-secondary)]">Systems Check</span>
                <span className="text-[var(--neon-green)] font-bold">OK</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-[var(--border)]">
              <p className="text-xs text-[var(--text-muted)] italic text-center">
                "We do not rise to the level of our goals. We fall to the level of our systems."
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
