'use client';

import { useState, useEffect } from 'react';
import { HabitGrid } from "@/components/furnace/HabitGrid";
import { BrainDump } from "@/components/furnace/BrainDump";
import { AICoach } from "@/components/furnace/AICoach";
import { Brain, MessageSquare, TrendingUp, Flame, Target } from "lucide-react";
import Link from "next/link";
import { getTodayHabits, getStreaks } from '@/app/furnace-actions';
import { FURNACE_HABITS } from '@/lib/furnace-constants';

export default function FurnaceDashboard() {
    const [completedHabits, setCompletedHabits] = useState<string[]>([]);
    const [streaks, setStreaks] = useState<Record<string, number>>({});

    useEffect(() => {
        const loadData = async () => {
            const habits = await getTodayHabits();
            const streakData = await getStreaks();
            setCompletedHabits(habits);
            setStreaks(streakData);
        };
        loadData();
    }, []);

    const completionPercentage = FURNACE_HABITS.length > 0
        ? Math.round((completedHabits.length / FURNACE_HABITS.length) * 100)
        : 0;

    const totalStreak = Object.values(streaks).reduce((sum, val) => sum + val, 0);
    const avgStreak = Object.keys(streaks).length > 0
        ? Math.round(totalStreak / Object.keys(streaks).length)
        : 0;

    return (
        <div className="min-h-screen p-4 md:p-8 space-y-12 pb-24">
            {/* Header */}
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-2">
                        FURNACE
                    </h1>
                    <p className="text-furnace-primary font-medium tracking-wide">
                        DAY 1 OF 90
                    </p>
                </div>

                {/* Quick Actions */}
                <button className="p-3 rounded-full bg-furnace-gray border border-white/10 hover:border-furnace-main/50 transition-colors">
                    <Brain className="text-furnace-accent" />
                </button>
            </header>

            {/* Main Grid */}
            <section>
                <div className="mb-8 p-1 rounded-2xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-indigo-500/30">
                    <Link href="/communication" className="block p-6 rounded-xl bg-black/60 hover:bg-black/40 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <MessageSquare size={100} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                            Speech Dojo <span className="text-xs bg-indigo-500 text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider">New</span>
                        </h3>
                        <p className="text-zinc-400 max-w-lg">Master vocabulary, grammar, and confidence with the AI Coach.</p>
                    </Link>
                </div>

                <HabitGrid />
            </section>

            <BrainDump />
            <AICoach />

            {/* Analytics Section */}
            <section className="space-y-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <TrendingUp className="text-furnace-primary" size={24} />
                    Analytics
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Daily Completion */}
                    <div className="bg-furnace-gray/30 rounded-2xl p-6 border border-white/5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-white/60">Daily Completion</h3>
                            <Target className="text-furnace-primary" size={20} />
                        </div>
                        <div className="text-3xl font-bold text-white mb-2">{completionPercentage}%</div>
                        <div className="w-full bg-black/50 rounded-full h-2 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-furnace-primary to-furnace-accent h-full transition-all duration-500"
                                style={{ width: `${completionPercentage}%` }}
                            />
                        </div>
                        <p className="text-xs text-zinc-500 mt-2">
                            {completedHabits.length} of {FURNACE_HABITS.length} habits completed
                        </p>
                    </div>

                    {/* Total Fire */}
                    <div className="bg-furnace-gray/30 rounded-2xl p-6 border border-white/5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-white/60">Total Streaks</h3>
                            <Flame className="text-furnace-accent" size={20} />
                        </div>
                        <div className="text-3xl font-bold text-white mb-2">{totalStreak}</div>
                        <p className="text-xs text-zinc-500 mt-2">
                            Combined streak days
                        </p>
                    </div>

                    {/* Average Streak */}
                    <div className="bg-furnace-gray/30 rounded-2xl p-6 border border-white/5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-white/60">Avg Streak</h3>
                            <TrendingUp className="text-green-400" size={20} />
                        </div>
                        <div className="text-3xl font-bold text-white mb-2">{avgStreak}</div>
                        <p className="text-xs text-zinc-500 mt-2">
                            Days per habit
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
