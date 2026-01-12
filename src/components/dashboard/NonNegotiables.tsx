'use client';

import { Check, Flame } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import confetti from 'canvas-confetti';

export function NonNegotiables() {
    const { state, updateDailyLog } = useApp();
    const today = new Date().toISOString().split('T')[0];
    const currentLog = state.dailyLogs[today] || { habitsCompleted: [] };
    const minimalMode = state.settings.minimalMode;

    const relevantHabits = state.habits.filter(h =>
        !minimalMode || h.requiredInMinimalMode
    );

    const toggleHabit = async (habitId: string) => {
        const completed = currentLog.habitsCompleted || [];
        const isDone = completed.includes(habitId);

        let newCompleted;
        if (isDone) {
            newCompleted = completed.filter(id => id !== habitId);
        } else {
            newCompleted = [...completed, habitId];
            // Micro confetti for each habit
            confetti({
                particleCount: 30,
                spread: 50,
                origin: { y: 0.7 },
                colors: ['#34d399', '#ffffff'],
                scalar: 0.7
            });
        }

        await updateDailyLog(today, { habitsCompleted: newCompleted });
    };

    return (
        <motion.div
            className="glass-panel p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-[var(--bg-tertiary)] rounded-lg border border-[var(--border)]">
                    <Flame className="text-[var(--neon-green)]" size={24} />
                </div>
                <div>
                    <h2 className="text-lg font-bold">Daily Protocol</h2>
                    <p className="text-xs text-[var(--text-muted)]">Maintain the streak.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {relevantHabits.map((habit, idx) => {
                    const isDone = currentLog.habitsCompleted?.includes(habit.id);

                    return (
                        <motion.button
                            key={habit.id}
                            onClick={() => toggleHabit(habit.id)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={clsx(
                                "relative overflow-hidden flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 group",
                                isDone
                                    ? "bg-[var(--neon-green)] border-[var(--neon-green)] shadow-[0_4px_20px_rgba(52,211,153,0.4)]"
                                    : "bg-[var(--bg-tertiary)]/50 border-[var(--border)] hover:border-[var(--text-secondary)]"
                            )}
                        >
                            {/* Background Fill Animation */}
                            {isDone && (
                                <motion.div
                                    layoutId={`fill-${habit.id}`}
                                    className="absolute inset-0 bg-white/10"
                                    initial={{ width: 0 }}
                                    animate={{ width: '100%' }}
                                />
                            )}

                            <span className={clsx(
                                "font-medium relative z-10 transition-colors text-lg",
                                isDone ? "text-[var(--bg-primary)] font-bold tracking-tight" : "text-[var(--text-secondary)]"
                            )}>
                                {habit.label}
                            </span>

                            <div className={clsx(
                                "w-8 h-8 rounded-full flex items-center justify-center border-2 relative z-10 transition-all shadow-inner",
                                isDone
                                    ? "bg-[var(--bg-primary)] border-[var(--bg-primary)]"
                                    : "bg-[var(--bg-primary)] border-[var(--text-muted)] group-hover:border-[var(--text-secondary)]"
                            )}>
                                <AnimatePresence>
                                    {isDone && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                        >
                                            <Check size={20} className="text-[var(--neon-green)] font-black" strokeWidth={4} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.button>
                    );
                })}
            </div>
        </motion.div>
    );
}
