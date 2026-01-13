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
        <div className="min-h-screen bg-transparent pb-20 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--neon-purple)] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--neon-blue)] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse delay-700" />
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-[var(--neon-pink)] rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-pulse delay-1000" />
            </div>

            {/* Hero Section */}
            <div className="relative">
                <div className="max-w-6xl mx-auto px-4 pt-8 pb-12">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-4xl font-bold mb-2 neon-text">Money Manager</h1>
                            <p className="text-[var(--text-secondary)] flex items-center gap-2">
                                <Sparkles size={16} className="text-[var(--neon-gold)]" />
                                Welcome back, <span className="text-[var(--neon-purple)] font-semibold">{user.username}</span>
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Link href="/money/splits" className="glass-card p-3 hover:scale-105 transition-transform" title="Shared Expenses">
                                <Users size={24} className="text-[var(--neon-cyan)]" />
                            </Link>
                            <Link href="/money/analytics" className="glass-card p-3 hover:scale-105 transition-transform" title="Analytics">
                                <BarChart3 size={24} className="text-[var(--neon-pink)]" />
                            </Link>
                        </div>
                    </div>

                    {/* Balance Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="glass-card p-6 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-2">
                                    <TrendingUp size={16} className="text-green-500" />
                                    <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Income</p>
                                </div>
                                <p className="text-3xl font-bold text-green-500">₹{totalIncome.toFixed(2)}</p>
                                <p className="text-xs text-[var(--text-muted)] mt-1">This month</p>
                            </div>
                        </div>

                        <div className="glass-card p-6 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-2">
                                    <Wallet size={16} className="text-red-500" />
                                    <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Expenses</p>
                                </div>
                                <p className="text-3xl font-bold text-red-500">₹{totalExpense.toFixed(2)}</p>
                                <p className="text-xs text-[var(--text-muted)] mt-1">This month</p>
                            </div>
                        </div>

                        <div className="glass-card p-6 relative overflow-hidden group animated-gradient">
                            <div className="absolute inset-0 bg-black/40" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles size={16} className="text-white" />
                                    <p className="text-xs font-bold text-white uppercase tracking-wider">Balance</p>
                                </div>
                                <p className={`text-3xl font-bold ${balance >= 0 ? 'text-white' : 'text-white'}`}>
                                    {balance >= 0 ? '+' : ''}₹{balance.toFixed(2)}
                                </p>
                                <p className="text-xs text-white/80 mt-1">Net this month</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-4 space-y-8 relative z-10">
                {/* Quick Add Section */}
                <section>
                    <h2 className="text-[var(--neon-gold)] text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                        <div className="w-1 h-4 bg-[var(--neon-gold)] rounded-full" />
                        Quick Add Transaction
                    </h2>
                    <QuickAdd categories={categories} />
                </section>

                {/* Recent Transactions */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-[var(--neon-cyan)] text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                            <div className="w-1 h-4 bg-[var(--neon-cyan)] rounded-full" />
                            Recent Activity
                        </h2>
                        <Link href="/money/analytics" className="text-xs text-[var(--neon-purple)] hover:text-[var(--neon-pink)] transition-colors font-semibold">
                            View All →
                        </Link>
                    </div>
                    <TransactionList transactions={transactions} />
                </section>
            </main>
        </div>
    );
}
