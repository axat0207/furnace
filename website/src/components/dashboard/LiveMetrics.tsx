'use client';

import { useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { calculateStats } from '@/lib/gamification';
import { getHabitStats } from '@/lib/habits';

export function LiveMetrics() {
    const { state } = useApp();
    const today = new Date().toISOString().split('T')[0];
    const todayLog = state.dailyLogs[today] || { habitsCompleted: [] };
    
    const { levelInfo, xp } = useMemo(() => calculateStats(state), [state]);
    
    // Calculate today's XP
    const todayXP = useMemo(() => {
        let xpToday = 0;
        
        // Habits completed today
        if (todayLog.habitsCompleted) {
            xpToday += todayLog.habitsCompleted.length * 15; // HABIT_COMPLETE = 15
        }
        
        // Focus items (if we had a way to mark them complete, but for now just count them)
        // Focus items don't have completion state, so we'll skip for now
        
        // Detox successes today
        if (todayLog.detoxLog && Array.isArray(todayLog.detoxLog)) {
            const successes = todayLog.detoxLog.filter((entry: any) => entry.outcome === 'Success').length;
            xpToday += successes * 30; // DETOX_SUCCESS = 30
        }
        
        return xpToday;
    }, [todayLog]);
    
    // Calculate best streak across all habits
    const bestStreak = useMemo(() => {
        if (state.habits.length === 0) return 0;
        
        const streaks = state.habits.map(habit => {
            const stats = getHabitStats(habit.id, state.dailyLogs);
            return stats.currentStreak;
        });
        
        return Math.max(...streaks, 0);
    }, [state.habits, state.dailyLogs]);
    
    // Calculate completion rate (habits done today / total habits)
    const completionRate = useMemo(() => {
        if (state.habits.length === 0) return 0;
        const completed = todayLog.habitsCompleted?.length || 0;
        return Math.round((completed / state.habits.length) * 100);
    }, [state.habits.length, todayLog.habitsCompleted]);
    
    return (
        <div className="glass-panel p-6">
            <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase mb-4">Live Metrics</h3>
            <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-[var(--text-secondary)]">Best Streak</span>
                    <span className="font-mono text-[var(--neon-purple)] font-bold">
                        {bestStreak} 🔥
                    </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-[var(--text-secondary)]">XP Gained Today</span>
                    <span className="font-mono text-[var(--neon-blue)] font-bold">
                        +{todayXP} XP
                    </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-[var(--text-secondary)]">Total XP</span>
                    <span className="font-mono text-[var(--neon-cyan)] font-bold">
                        {xp.toLocaleString()}
                    </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-[var(--text-secondary)]">Today's Progress</span>
                    <span className="font-mono text-[var(--neon-green)] font-bold">
                        {completionRate}%
                    </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-[var(--text-secondary)]">Level</span>
                    <span className="font-mono text-[var(--neon-gold)] font-bold">
                        {levelInfo.level} ({levelInfo.title})
                    </span>
                </div>
            </div>

            <div className="mt-6 pt-6 border-t border-[var(--border)]">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[var(--text-muted)]">Level Progress</span>
                    <span className="text-xs font-mono text-[var(--text-muted)]">
                        {Math.round(levelInfo.progress)}%
                    </span>
                </div>
                <div className="w-full h-2 bg-[var(--bg-primary)] rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] transition-all duration-500"
                        style={{ width: `${levelInfo.progress}%` }}
                    />
                </div>
                <div className="flex justify-between text-[10px] text-[var(--text-muted)] mt-1">
                    <span>{xp.toLocaleString()} XP</span>
                    <span>Next: {levelInfo.nextLevelXP.toLocaleString()} XP</span>
                </div>
            </div>

            <div className="mt-6 pt-6 border-t border-[var(--border)]">
                <p className="text-xs text-[var(--text-muted)] italic text-center">
                    "We do not rise to the level of our goals. We fall to the level of our systems."
                </p>
            </div>
        </div>
    );
}
