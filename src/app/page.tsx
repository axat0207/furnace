import { HabitGrid } from "@/components/furnace/HabitGrid";
import { BrainDump } from "@/components/furnace/BrainDump";
import { AICoach } from "@/components/furnace/AICoach";
import { Brain, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function FurnaceDashboard() {
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



            {/* Progress / Status (Placeholder) */}
            <section className="bg-furnace-gray/30 rounded-3xl p-6 border border-white/5">
                <div className="flex justify-between items-end mb-4">
                    <h3 className="text-lg font-medium text-white/80">Daily Completion</h3>
                    <span className="text-2xl font-bold text-white">0%</span>
                </div>
                <div className="w-full bg-black/50 rounded-full h-4 overflow-hidden">
                    <div className="bg-gradient-to-r from-furnace-primary to-furnace-accent h-full w-0" style={{ width: '0%' }} />
                </div>
            </section>
        </div>
    );
}
