'use client';

import { useApp } from '@/context/AppContext';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

export function ProgressRing() {
    const { state } = useApp();
    const today = new Date().toISOString().split('T')[0];
    const currentLog = state.dailyLogs[today] || { habitsCompleted: [] };
    const minimalMode = state.settings.minimalMode;

    const relevantHabits = state.habits.filter(h =>
        !minimalMode || h.requiredInMinimalMode
    );

    const total = relevantHabits.length;
    const completed = currentLog.habitsCompleted?.filter(id =>
        relevantHabits.find(h => h.id === id)
    ).length || 0;

    const percentage = total === 0 ? 0 : (completed / total) * 100;

    // Neon Color based on Percentage
    let strokeColor = '#262626'; // Default border
    let neonColor = 'var(--text-muted)';

    if (percentage > 0) neonColor = '#f87171'; // Red start
    if (percentage > 40) neonColor = '#facc15'; // Yellow mid
    if (percentage > 75) neonColor = '#34d399'; // Green high
    if (percentage === 100) neonColor = '#22d3ee'; // Blue max

    return (
        <motion.div
            className="glass-panel p-6 flex flex-col items-center justify-center relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
        >
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Activity size={120} />
            </div>

            <h3 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-4">Integrity</h3>

            <div className="relative w-40 h-40 flex items-center justify-center">
                {/* Glow Effect */}
                <div
                    className="absolute inset-0 rounded-full blur-2xl opacity-20 transition-colors duration-500"
                    style={{ backgroundColor: percentage > 0 ? neonColor : 'transparent' }}
                />

                <svg className="transform -rotate-90 w-40 h-40 relative z-10">
                    <circle
                        className="text-[var(--bg-tertiary)]"
                        strokeWidth="12"
                        stroke="currentColor"
                        fill="transparent"
                        r="70"
                        cx="80"
                        cy="80"
                    />
                    <motion.circle
                        strokeWidth="12"
                        strokeDasharray={2 * Math.PI * 70}
                        strokeDashoffset={2 * Math.PI * 70 * (1 - percentage / 100)}
                        strokeLinecap="round"
                        stroke={neonColor}
                        fill="transparent"
                        r="70"
                        cx="80"
                        cy="80"
                        initial={{ strokeDashoffset: 2 * Math.PI * 70 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 70 * (1 - percentage / 100) }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        style={{ filter: `drop-shadow(0 0 5px ${neonColor})` }}
                    />
                </svg>

                <div className="absolute flex flex-col items-center">
                    <motion.span
                        className="text-4xl font-black font-mono"
                        style={{ color: neonColor }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        {Math.round(percentage)}%
                    </motion.span>
                </div>
            </div>

            <div className="mt-6 flex flex-col items-center gap-1">
                <div className="text-xs font-mono text-[var(--text-secondary)] bg-[var(--bg-tertiary)] px-3 py-1 rounded-full border border-[var(--border)]">
                    {completed} / {total} MODULES ACTIVE
                </div>
            </div>
        </motion.div>
    );
}
