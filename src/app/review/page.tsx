'use client';

import { useApp } from '@/context/AppContext';
import { getHabitStats } from '@/lib/habits';

export default function ReviewPage() {
    const { state } = useApp();

    // Calculate "Last Week" range
    // Simpler: Just get last 7 days from today.
    const today = new Date();
    const weekDays = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
    });

    // Calculate Wins/Misses
    const totalSlots = state.habits.length * 7;
    let completedCount = 0;

    weekDays.forEach(date => {
        const log = state.dailyLogs[date];
        if (log?.habitsCompleted) {
            completedCount += log.habitsCompleted.length;
        }
    });

    const completionRate = Math.round((completedCount / totalSlots) * 100);

    // Identity Statement Logic
    const identityAdj = completionRate > 85 ? "disciplined professional" :
        completionRate > 60 ? "struggling but persisting engineer" : "distracted amateur";

    return (
        <div className="fade-in">
            <header className="mb-8">
                <h1 className="h1">Weekly Review</h1>
                <p className="text-[var(--text-secondary)]">Inspect and Adapt.</p>
            </header>

            <div className="grid grid-cols-1 gap-6">
                {/* Identity Statement Card */}
                <div className="card border-[var(--accent)] bg-[var(--bg-secondary)] text-center py-8">
                    <h2 className="h2 text-[var(--text-primary)]">Identity Check</h2>
                    <p className="text-xl font-light italic text-[var(--text-secondary)]">
                        &quot;This week I acted like a <span className="font-bold text-[var(--text-primary)] border-b border-[var(--accent)]">{identityAdj}</span>.&quot;
                    </p>
                    <p className="text-xs text-[var(--text-muted)] mt-4">
                        Based on {completionRate}% habit consistency over the last 7 days.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="card">
                        <h3 className="h3 text-[var(--success)]">Wins</h3>
                        <textarea className="input h-32 bg-[var(--bg-primary)] border-none resize-none" placeholder="What went well? (e.g., consistent gym, deep work streak)" />
                    </div>
                    <div className="card">
                        <h3 className="h3 text-[var(--danger)]">Misses</h3>
                        <textarea className="input h-32 bg-[var(--bg-primary)] border-none resize-none" placeholder="Where did discipline break? (e.g., fog habit usage, missed sleep)" />
                    </div>
                </div>

                <div className="card">
                    <h3 className="h3">Strategic Adjustments</h3>
                    <p className="text-sm text-[var(--text-muted)] mb-2">What will you change next week?</p>
                    <textarea className="input h-24" placeholder="e.g., Phone in other room after 9 PM..." />
                </div>
            </div>
        </div>
    );
}
