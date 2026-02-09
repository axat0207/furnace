'use client';

import { useState, useEffect } from 'react';
import { Target, Lock, Unlock } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export function FocusBoard() {
    const { state, updateDailyLog } = useApp();
    const today = new Date().toISOString().split('T')[0];
    const currentLog = state.dailyLogs[today] || { focusItems: [] };

    const [items, setItems] = useState<string[]>(['', '', '']);
    const [isLocked, setIsLocked] = useState(false);

    useEffect(() => {
        if (currentLog.focusItems && currentLog.focusItems.length > 0) {
            const padded = [...currentLog.focusItems, '', '', ''].slice(0, 3);
            setItems(padded);
            // If items exist, assume they might be "locked" if we saved a specific flag, but for now just UI toggle
            if (padded.some(i => i.trim() !== '')) setIsLocked(true);
        }
    }, [currentLog.focusItems]);

    const handleChange = (index: number, value: string) => {
        if (isLocked) return;
        const newItems = [...items];
        newItems[index] = value;
        setItems(newItems);
    };

    const toogleLock = () => {
        if (!isLocked) {
            // Locking in
            const validItems = items.filter(i => i.trim() !== '');
            if (validItems.length > 0) {
                setIsLocked(true);
                updateDailyLog(today, { focusItems: validItems });
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#22d3ee', '#c084fc', '#ffffff'] // Neon colors
                });
            }
        } else {
            setIsLocked(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6 relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <Target size={100} />
            </div>

            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[var(--bg-tertiary)] rounded-lg border border-[var(--border)]">
                        <Target className="text-[var(--neon-blue)]" size={24} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold">Main Quest</h2>
                        <p className="text-xs text-[var(--text-muted)]">Must complete today.</p>
                    </div>
                </div>
                <button
                    onClick={toogleLock}
                    className={`p-2 rounded-lg border transition-all ${isLocked
                            ? 'bg-[var(--bg-tertiary)] border-[var(--neon-green)] text-[var(--neon-green)]'
                            : 'bg-[var(--bg-tertiary)] border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                >
                    {isLocked ? <Lock size={20} /> : <Unlock size={20} />}
                </button>
            </div>

            <div className="flex flex-col gap-4 relative z-10">
                {items.map((item, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <div className="relative group">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[var(--text-muted)] group-focus-within:text-[var(--neon-blue)] transition-colors">
                                0{idx + 1}
                            </span>
                            <input
                                type="text"
                                disabled={isLocked}
                                className={`w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg py-3 pl-10 pr-4 text-sm transition-all ${isLocked
                                        ? 'opacity-80 cursor-not-allowed border-[var(--border)]'
                                        : 'focus:border-[var(--neon-blue)] focus:shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                                    }`}
                                placeholder="Enter objective..."
                                value={item}
                                onChange={(e) => handleChange(idx, e.target.value)}
                            />
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
