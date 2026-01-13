'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { getHabitStats } from '@/lib/habits';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Flame, TrendingUp, Plus, Trash2, X, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { v4 as uuidv4 } from 'uuid';

export default function HabitsPage() {
    const { state, addHabit, deleteHabit, updateDailyLog } = useApp();
    const habits = state.habits;

    const [isAdding, setIsAdding] = useState(false);
    const [newHabitLabel, setNewHabitLabel] = useState('');
    const [newHabitCategory, setNewHabitCategory] = useState<'physical' | 'mental'>('physical');

    // 30 Days History (more robust tracking)
    const dates: string[] = [];
    for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dates.push(d.toISOString().split('T')[0]);
    }

    const getStatus = (date: string, habitId: string) => {
        const log = state.dailyLogs[date];
        if (!log) return 'empty';
        return log.habitsCompleted?.includes(habitId) ? 'done' : 'miss';
    };

    const handleAddHabit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newHabitLabel.trim()) return;

        await addHabit({
            id: uuidv4(),
            label: newHabitLabel,
            category: newHabitCategory,
            requiredInMinimalMode: false
        });

        setNewHabitLabel('');
        setIsAdding(false);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[var(--text-primary)] neon-text">
                        Habit Protocol
                    </h1>
                    <p className="text-[var(--text-secondary)] mt-1">Consistency is the only currency that matters.</p>
                </div>

                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="btn-cyber flex items-center gap-2 self-start md:self-end"
                >
                    <Plus size={18} />
                    <span>New Protocol</span>
                </button>
            </div>

            {/* Add Habit Form */}
            <AnimatePresence>
                {isAdding && (
                    <motion.form
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        onSubmit={handleAddHabit}
                        className="glass-panel p-4 overflow-hidden"
                    >
                        <div className="flex flex-col md:flex-row gap-4 items-end">
                            <div className="flex-1 w-full">
                                <label className="text-xs text-[var(--text-muted)] mb-1 block">Protocol Name</label>
                                <input
                                    type="text"
                                    className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-2 text-sm focus:border-[var(--neon-blue)] outline-none"
                                    placeholder="e.g. 100 Pushups"
                                    value={newHabitLabel}
                                    onChange={(e) => setNewHabitLabel(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className="w-full md:w-auto">
                                <label className="text-xs text-[var(--text-muted)] mb-1 block">Category</label>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setNewHabitCategory('physical')}
                                        className={clsx("px-3 py-2 rounded-lg text-xs font-mono border transition-colors", newHabitCategory === 'physical' ? "bg-[var(--neon-green)]/10 border-[var(--neon-green)] text-[var(--neon-green)]" : "border-[var(--border)] text-[var(--text-muted)]")}
                                    >
                                        PHYSICAL
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setNewHabitCategory('mental')}
                                        className={clsx("px-3 py-2 rounded-lg text-xs font-mono border transition-colors", newHabitCategory === 'mental' ? "bg-purple-500/10 border-purple-500 text-purple-400" : "border-[var(--border)] text-[var(--text-muted)]")}
                                    >
                                        MENTAL
                                    </button>
                                </div>
                            </div>
                            <div className="flex gap-2 w-full md:w-auto">
                                <button type="submit" disabled={!newHabitLabel} className="bg-[var(--neon-blue)] text-black font-bold px-4 py-2 rounded-lg text-sm hover:opacity-90 disabled:opacity-50">
                                    Initialize
                                </button>
                                <button type="button" onClick={() => setIsAdding(false)} className="p-2 border border-[var(--border)] rounded-lg text-[var(--text-muted)] hover:text-white">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            {/* Legend */}
            <div className="flex gap-6 text-xs text-[var(--text-muted)] px-1">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[var(--neon-green)] rounded-sm" />
                    <span>Complete (XP Gained)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-sm" />
                    <span>Pending</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500/20 border border-red-500/50 rounded-sm" />
                    <span>Missed</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {habits.length === 0 && (
                    <div className="p-12 text-center text-[var(--text-muted)] border border-dashed border-[var(--border)] rounded-xl">
                        <AlertCircle className="mx-auto mb-3 opacity-50" size={32} />
                        <p>No protocols defined. Initialize your first habit.</p>
                    </div>
                )}

                {habits.map((habit, idx) => {
                    const stats = getHabitStats(habit.id, state.dailyLogs);

                    return (
                        <motion.div
                            key={habit.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass-panel p-6 flex flex-col items-start gap-6 group hover:border-[var(--text-secondary)]/30 transition-all relative"
                        >
                            {/* Delete Button (Hover Only) */}
                            <button
                                onClick={() => {
                                    if (confirm('Terminate this protocol? Data will be preserved in daily logs but tracking will stop.')) {
                                        deleteHabit(habit.id);
                                    }
                                }}
                                className="absolute top-4 right-4 p-2 text-[var(--text-muted)] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Delete Protocol"
                            >
                                <Trash2 size={16} />
                            </button>

                            <div className="w-full flex flex-col md:flex-row gap-6 md:items-center">
                                {/* Habit Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-3 rounded-xl border ${habit.category === 'mental' ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' : 'bg-[var(--neon-green)]/10 border-[var(--neon-green)]/30 text-[var(--neon-green)]'}`}>
                                            {habit.category === 'mental' ? <TrendingUp size={20} /> : <Flame size={20} />}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-[var(--text-primary)]">{habit.label}</h3>
                                            <span className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] bg-[var(--bg-primary)] px-2 py-0.5 rounded-full border border-[var(--border)]">
                                                {habit.category}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="flex gap-6 text-right">
                                    <div>
                                        <div className="text-xs text-[var(--text-muted)] mb-1">STREAK</div>
                                        <div className="text-xl font-black font-mono text-[var(--text-primary)] flex items-center justify-end gap-1">
                                            {stats.currentStreak}
                                            <span className="text-[10px] text-[var(--neon-gold)]">🔥</span>
                                        </div>
                                    </div>
                                    <div className="hidden sm:block">
                                        <div className="text-xs text-[var(--text-muted)] mb-1">TOTAL</div>
                                        <div className="text-xl font-black font-mono text-[var(--text-secondary)]">
                                            {stats.totalCompletions}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Heatmap Grid */}
                            <div className="w-full">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">Activity Heatmap (30 Days)</span>
                                    <div className="text-[10px] font-mono text-[var(--text-muted)]">
                                        {stats.totalCompletions} total • {Math.round((stats.totalCompletions / 30) * 100)}% avg
                                    </div>
                                </div>
                                <div className="flex gap-1.5 md:gap-2 justify-between">
                                    {dates.map((date) => {
                                        const status = getStatus(date, habit.id);
                                        const isToday = date === new Date().toISOString().split('T')[0];
                                        const yesterday = new Date();
                                        yesterday.setDate(yesterday.getDate() - 1);
                                        const yesterdayStr = yesterday.toISOString().split('T')[0];
                                        const isYesterday = date === yesterdayStr;

                                        const handleToggle = async () => {
                                            // Allow marking today and yesterday (for catch-up)
                                            if (!isToday && !isYesterday) return; // Only allow today or yesterday

                                            const currentLog = state.dailyLogs[date] || { habitsCompleted: [] };
                                            const completed = currentLog.habitsCompleted || [];
                                            const isDone = completed.includes(habit.id);

                                            let newCompleted;
                                            if (isDone) {
                                                newCompleted = completed.filter(id => id !== habit.id);
                                            } else {
                                                newCompleted = [...completed, habit.id];
                                            }

                                            await updateDailyLog(date, { habitsCompleted: newCompleted });
                                        };

                                        return (
                                            <div
                                                key={date}
                                                onClick={handleToggle}
                                                className={clsx(
                                                    "flex-1 flex flex-col items-center gap-1 group/day relative",
                                                    (isToday || isYesterday) 
                                                        ? "cursor-pointer" 
                                                        : "cursor-not-allowed opacity-60"
                                                )}
                                            >
                                                <div
                                                    className={clsx(
                                                        "w-full h-8 md:h-12 rounded md:rounded-lg border transition-all duration-300 relative overflow-hidden flex items-center justify-center",
                                                        status === 'done'
                                                            ? "bg-[var(--neon-green)] border-[var(--neon-green)] shadow-[0_0_10px_rgba(52,211,153,0.3)]"
                                                            : status === 'miss' && !isToday
                                                                ? "bg-red-500/20 border-red-500/50"
                                                                : "bg-[var(--bg-primary)] border-[var(--border)]",
                                                        (isToday || isYesterday) 
                                                            && "hover:border-[var(--neon-blue)]"
                                                    )}
                                                    title={isToday ? "Click to toggle (Today)" : isYesterday ? "Click to toggle (Yesterday)" : date}
                                                >
                                                    {status === 'done' && (
                                                        <CheckCircle2 size={12} className="text-[var(--bg-primary)] md:scale-125 font-bold" />
                                                    )}
                                                    {(isToday || isYesterday) && status !== 'done' && (
                                                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)] opacity-50" />
                                                    )}
                                                </div>
                                                <span className={clsx(
                                                    "text-[8px] md:text-[9px] font-mono hidden md:block",
                                                    (isToday || isYesterday) 
                                                        ? "text-[var(--neon-blue)] font-bold" 
                                                        : "text-[var(--text-muted)] opacity-50"
                                                )}>
                                                    {date.slice(8)}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
