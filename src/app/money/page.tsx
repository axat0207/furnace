import { getCategories, getTransactions } from './actions';
import QuickAdd from '@/components/money/QuickAdd';
import TransactionList from '@/components/money/TransactionList';
import { getUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { BarChart3, Users, TrendingUp, Sparkles, Wallet } from 'lucide-react';
import Image from 'next/image';

export default async function MoneyPage() {
    const user = await getUser();
    if (!user) redirect('/login');

    const categories = await getCategories();
    const transactions = await getTransactions(20);

    // Calculate quick stats
    const thisMonth = transactions.filter(t => {
        const date = new Date(t.date);
        const now = new Date();
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    });

    const totalIncome = thisMonth.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = thisMonth.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpense;

    return (
        <div className="min-h-screen bg-transparent pb-20 md:pb-8 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--neon-purple)] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--neon-blue)] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse delay-700" />
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-[var(--neon-pink)] rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-pulse delay-1000" />
            </div>

            <main className="max-w-6xl mx-auto px-3 md:px-4 space-y-4 md:space-y-8 relative z-10 pt-4 md:pt-8">
                {/* Header - Compact on Mobile */}
                <div className="flex items-center justify-between mb-2 md:mb-4">
                    <div>
                        <h1 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2 neon-text">Money Manager</h1>
                        <p className="text-xs md:text-sm text-[var(--text-secondary)] flex items-center gap-2">
                            <Sparkles size={12} className="text-[var(--neon-gold)] md:w-4 md:h-4" />
                            <span className="hidden sm:inline">Welcome back, </span>
                            <span className="text-[var(--neon-purple)] font-semibold">{user.username}</span>
                        </p>
                    </div>
                    <div className="flex gap-2 md:gap-3">
                        <Link href="/money/splits" className="glass-card p-2 md:p-3 hover:scale-105 transition-transform" title="Shared Expenses">
                            <Users size={20} className="md:w-6 md:h-6 text-[var(--neon-cyan)]" />
                        </Link>
                        <Link href="/money/analytics" className="glass-card p-2 md:p-3 hover:scale-105 transition-transform" title="Analytics">
                            <BarChart3 size={20} className="md:w-6 md:h-6 text-[var(--neon-pink)]" />
                        </Link>
                    </div>
                </div>

                {/* Quick Add Section - FIRST PRIORITY */}
                <section>
                    <QuickAdd categories={categories} />
                </section>

                {/* Balance Cards - Compact on Mobile */}
                <section className="grid grid-cols-3 gap-2 md:gap-6">
                    <div className="glass-card p-3 md:p-6 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
                                <TrendingUp size={12} className="md:w-4 md:h-4 text-green-500" />
                                <p className="text-[10px] md:text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider hidden sm:block">Income</p>
                            </div>
                            <p className="text-lg md:text-3xl font-bold text-green-500">₹{totalIncome.toFixed(0)}</p>
                            <p className="text-[10px] md:text-xs text-[var(--text-muted)] mt-0.5 md:mt-1 hidden md:block">This month</p>
                        </div>
                    </div>

                    <div className="glass-card p-3 md:p-6 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
                                <Wallet size={12} className="md:w-4 md:h-4 text-red-500" />
                                <p className="text-[10px] md:text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider hidden sm:block">Expenses</p>
                            </div>
                            <p className="text-lg md:text-3xl font-bold text-red-500">₹{totalExpense.toFixed(0)}</p>
                            <p className="text-[10px] md:text-xs text-[var(--text-muted)] mt-0.5 md:mt-1 hidden md:block">This month</p>
                        </div>
                    </div>

                    <div className="glass-card p-3 md:p-6 relative overflow-hidden group animated-gradient">
                        <div className="absolute inset-0 bg-black/40" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
                                <Sparkles size={12} className="md:w-4 md:h-4 text-white" />
                                <p className="text-[10px] md:text-xs font-bold text-white uppercase tracking-wider hidden sm:block">Balance</p>
                            </div>
                            <p className={`text-lg md:text-3xl font-bold text-white`}>
                                {balance >= 0 ? '+' : ''}₹{balance.toFixed(0)}
                            </p>
                            <p className="text-[10px] md:text-xs text-white/80 mt-0.5 md:mt-1 hidden md:block">Net this month</p>
                        </div>
                    </div>
                </section>

                {/* Recent Transactions */}
                <section>
                    <div className="flex items-center justify-between mb-3 md:mb-4">
                        <h2 className="text-[var(--neon-cyan)] text-xs md:text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                            <div className="w-1 h-3 md:h-4 bg-[var(--neon-cyan)] rounded-full" />
                            Recent Activity
                        </h2>
                        <Link href="/money/analytics" className="text-[10px] md:text-xs text-[var(--neon-purple)] hover:text-[var(--neon-pink)] transition-colors font-semibold">
                            View All →
                        </Link>
                    </div>
                    <TransactionList transactions={transactions} />
                </section>
            </main>
        </div>
    );
}
