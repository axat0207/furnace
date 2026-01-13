'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, CheckSquare, MessageSquare, BookOpen, Battery, ClipboardList, Flame, Shield, Wallet, Languages, Lock } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { calculateStats } from '@/lib/gamification';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { logout } from '@/app/login/actions';

const NAV_ITEMS = [
    { icon: Home, label: 'Bridge', href: '/' },
    { icon: CheckSquare, label: 'Habits', href: '/habits' },
    { icon: MessageSquare, label: 'Communication', href: '/communication' },
    { icon: BookOpen, label: 'Learning', href: '/learning' },
    { icon: Wallet, label: 'Money', href: '/money' },
    { icon: ClipboardList, label: 'Review', href: '/review' },
];

const COMING_SOON = [
    { icon: Languages, label: 'Vocabulary' },
];

export function Sidebar() {
    const pathname = usePathname();
    const { state, toggleMinimalMode } = useApp();
    const minimalMode = state.settings.minimalMode;

    const { levelInfo } = useMemo(() => calculateStats(state), [state]);

    return (
        <aside className="fixed left-0 top-0 h-screen w-16 md:w-72 bg-[var(--bg-secondary)]/50 backdrop-blur-xl border-r border-[var(--border)] flex flex-col z-50 shadow-2xl">
            {/* Brand */}
            <div className="p-6 border-b border-[var(--border)] flex items-center gap-3">
                <div className="relative w-10 h-10 bg-gradient-to-br from-[var(--neon-gold)] to-[var(--neon-red)] rounded-xl flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                    <Flame className="text-white fill-white" size={24} />
                </div>
                <div className="hidden md:block">
                    <span className="font-bold tracking-tight text-xl block leading-none text-white">FURNACE</span>
                    <span className="text-[10px] text-[var(--neon-gold)] font-mono tracking-widest uppercase opacity-80">OS v3.0</span>
                </div>
            </div>

            {/* User Stats Card (Desktop Only) */}
            <div className="hidden md:block p-4 mx-2 mt-4 glass-card bg-gradient-to-b from-[var(--bg-tertiary)] to-transparent">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-[var(--text-secondary)] font-mono">LEVEL {levelInfo.level}</span>
                    <span className="text-xs text-[var(--neon-purple)] font-bold">{levelInfo.title}</span>
                </div>
                <div className="w-full h-1.5 bg-[var(--bg-primary)] rounded-full overflow-hidden mb-2">
                    <motion.div
                        className="h-full bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)]"
                        initial={{ width: 0 }}
                        animate={{ width: `${levelInfo.progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    />
                </div>
                <div className="flex justify-between text-[10px] text-[var(--text-muted)]">
                    <span>{Math.round(levelInfo.currentXP)} XP</span>
                    <span>NEXT: {Math.round(levelInfo.nextLevelXP)} XP</span>
                </div>
            </div>

            <nav className="flex-1 py-6 flex flex-col gap-2 px-3">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`relative flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group overflow-hidden ${isActive
                                ? 'bg-[var(--bg-tertiary)] text-[var(--neon-blue)] border border-[var(--border)] shadow-[inset_0_0_10px_rgba(56,189,248,0.1)]'
                                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                                }`}
                        >
                            <item.icon size={20} className={isActive ? 'drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]' : 'group-hover:text-[var(--text-primary)]'} />
                            <span className="hidden md:block text-sm font-medium">{item.label}</span>

                            {isActive && (
                                <motion.div
                                    layoutId="active-pill"
                                    className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--neon-blue)] rounded-r-full"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                />
                            )}
                        </Link>
                    );
                })}

                {/* Coming Soon Section */}
                <div className="mt-4 px-3 mb-2 hidden md:block">
                    <h4 className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Expansion Pack</h4>
                </div>
                {COMING_SOON.map((item) => (
                    <div key={item.label} className="relative flex items-center gap-3 p-3 rounded-xl text-[var(--text-muted)] opacity-60 cursor-not-allowed group">
                        <item.icon size={20} />
                        <span className="hidden md:block text-sm font-medium">{item.label}</span>
                        <Lock size={12} className="hidden md:block absolute right-3 opacity-50" />
                    </div>
                ))}

            </nav>

            <div className="p-4 border-t border-[var(--border)] flex flex-col gap-2 bg-[var(--bg-secondary)]/50 backdrop-blur-md">
                {/* Minimal Mode Toggle */}
                <button
                    onClick={toggleMinimalMode}
                    className={`group flex items-center gap-3 p-3 rounded-lg transition-colors w-full border ${minimalMode
                        ? 'bg-[var(--bg-tertiary)] border-[var(--neon-green)] text-[var(--neon-green)]'
                        : 'border-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
                        }`}
                >
                    <Shield size={20} className={minimalMode ? 'fill-[var(--neon-green)]' : ''} />
                    <div className="hidden md:flex flex-col items-start">
                        <span className="text-sm font-medium">Minimal Mode</span>
                        <span className="text-[10px] text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]">
                            {minimalMode ? 'Active (Focused)' : 'Off (Full OS)'}
                        </span>
                    </div>
                </button>

                {/* Logout Button */}
                <form action={logout}>
                    <button
                        type="submit"
                        className="group flex items-center gap-3 p-3 rounded-lg transition-colors w-full border border-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-red-400"
                    >
                        <Lock size={20} className="group-hover:text-red-400" />
                        <span className="hidden md:block text-sm font-medium">Disconnect</span>
                    </button>
                </form>

                <div className="text-[10px] text-[var(--text-muted)] text-center md:text-left mt-2 px-2 hidden md:block font-mono">
                    DAY {Object.keys(state.dailyLogs).length + 1} / 90
                </div>
            </div>
        </aside>
    );
}
