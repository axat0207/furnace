import { getSharedExpenses, getBalances, settleUp, markSplitAsPaid, getAllUsers } from './actions';
import { getCategories } from '../actions';
import { getUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Users, TrendingUp, TrendingDown, CheckCircle2, Sparkles, ReceiptText, Zap } from 'lucide-react';
import { format } from 'date-fns';
import QuickSplit from '@/components/money/QuickSplit';
import SplitList from './SplitList';

export default async function SplitsPage() {
    const user = await getUser();
    if (!user) redirect('/login');

    const expenses = await getSharedExpenses();
    const { owedToYou, youOwe } = await getBalances();
    const allUsers = await getAllUsers();
    const categories = await getCategories();

    // Calculate totals
    const totalOwedToYou = owedToYou.reduce((sum: number, item: any) => sum + item.amount, 0);
    const totalYouOwe = youOwe.reduce((sum: number, item: any) => sum + item.amount, 0);
    const netBalance = totalOwedToYou - totalYouOwe;

    return (
        <div className="min-h-screen bg-transparent pb-20 md:pb-8 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[var(--neon-purple)] rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-pulse" />
                <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[var(--neon-blue)] rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-pulse delay-700" />
            </div>

            <header className="sticky top-0 z-20 bg-[var(--bg-secondary)]/80 backdrop-blur-xl border-b border-[var(--border)] p-3 md:p-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2 md:gap-4">
                        <Link href="/money" className="p-1.5 md:p-2 rounded-xl hover:bg-[var(--bg-tertiary)] transition-colors border border-transparent hover:border-[var(--border)]">
                            <ArrowLeft size={18} className="md:w-5 md:h-5" />
                        </Link>
                        <div>
                            <h1 className="text-lg md:text-xl font-bold flex items-center gap-1.5 md:gap-2">
                                <span>Shared Expenses</span>
                                <Sparkles size={14} className="md:w-4 md:h-4 text-[var(--neon-gold)]" />
                            </h1>
                            <p className="text-[9px] md:text-[10px] text-[var(--text-secondary)] uppercase tracking-widest font-bold opacity-60 hidden sm:block">Splitwise System v2.0</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto p-3 md:p-4 space-y-4 md:space-y-8 relative z-10 pt-4">
                {/* Quick Split Component - FIRST PRIORITY */}
                <section>
                    <QuickSplit categories={categories} allUsers={allUsers as any} />
                </section>

                {/* Balance Summary Grid - Compact on Mobile */}
                <section className="grid grid-cols-3 gap-2 md:gap-6">
                    <div className="glass-panel p-3 md:p-6 border-l-2 md:border-l-4 border-l-green-500">
                        <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
                            <TrendingUp size={12} className="md:w-4 md:h-4 text-green-500" />
                            <p className="text-[9px] md:text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider hidden sm:block">Owed to you</p>
                        </div>
                        <p className="text-lg md:text-3xl font-bold text-green-500">₹{totalOwedToYou.toFixed(0)}</p>
                    </div>

                    <div className="glass-panel p-3 md:p-6 border-l-2 md:border-l-4 border-l-red-500">
                        <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
                            <TrendingDown size={12} className="md:w-4 md:h-4 text-red-500" />
                            <p className="text-[9px] md:text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider hidden sm:block">You owe</p>
                        </div>
                        <p className="text-lg md:text-3xl font-bold text-red-500">₹{totalYouOwe.toFixed(0)}</p>
                    </div>

                    <div className="glass-panel p-3 md:p-6 animated-gradient group">
                        <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
                                <Users size={12} className="md:w-4 md:h-4 text-white" />
                                <p className="text-[9px] md:text-[10px] font-bold text-white/80 uppercase tracking-wider hidden sm:block">Net</p>
                            </div>
                            <p className={`text-lg md:text-3xl font-bold ${netBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {netBalance >= 0 ? '+' : ''}₹{netBalance.toFixed(0)}
                            </p>
                        </div>
                    </div>
                </section>

                <SplitList
                    expenses={expenses}
                    owedToYou={owedToYou}
                    youOwe={youOwe}
                    currentUserId={user.id}
                />
            </main>
        </div>
    );
}
