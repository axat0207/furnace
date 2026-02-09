'use client';

import { useState, useTransition } from 'react';
import { format } from 'date-fns';
import { CheckCircle2, ChevronRight, ReceiptText, User, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { markSplitAsPaid, settleUp } from './actions';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function SplitList({ expenses, owedToYou, youOwe, currentUserId }: any) {
    const [isPending, startTransition] = useTransition();

    async function handleReceivePayment(expenseId: string, userId: string) {
        startTransition(async () => {
            await markSplitAsPaid(expenseId, userId);
        });
    }

    async function handleSettleNow(expenseId: string) {
        startTransition(async () => {
            await settleUp(expenseId);
        });
    }

    return (
        <div className="space-y-8">
            {/* Active Transfers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Owed to You */}
                <div className="space-y-4">
                    <h3 className="flex items-center gap-2 text-green-500 text-[10px] font-black uppercase tracking-[0.2em] ml-2">
                        <ArrowUpRight size={14} />
                        Receivable Ledger
                    </h3>
                    {owedToYou.length === 0 ? (
                        <div className="glass-panel p-8 text-center border-dashed border-2 opacity-50">
                            <p className="text-[10px] uppercase font-bold text-[var(--text-muted)]">No pending collections</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {owedToYou.map((item: any) => (
                                <motion.div
                                    layout
                                    key={item.splitId}
                                    className="glass-card p-4 flex items-center justify-between group hover:border-green-500/30 transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/20">
                                            <User size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white group-hover:text-green-400 transition-colors uppercase tracking-tight">
                                                {item.user.username}
                                            </p>
                                            <p className="text-[9px] text-[var(--text-muted)] font-black uppercase tracking-widest">{item.expenseDescription}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <p className="text-md font-black text-green-500">₹{item.amount.toFixed(2)}</p>
                                        <button
                                            onClick={() => handleReceivePayment(item.expenseId, item.user.id)}
                                            disabled={isPending}
                                            className="px-3 py-1.5 rounded-lg bg-green-500/10 text-[9px] font-black text-green-500 uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all border border-green-500/20 disabled:opacity-50"
                                        >
                                            {isPending ? 'Updating...' : 'Received'}
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                {/* You Owe */}
                <div className="space-y-4">
                    <h3 className="flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] ml-2">
                        <ArrowDownLeft size={14} />
                        Payable Ledger
                    </h3>
                    {youOwe.length === 0 ? (
                        <div className="glass-panel p-8 text-center border-dashed border-2 opacity-50">
                            <p className="text-[10px] uppercase font-bold text-[var(--text-muted)]">All debts cleared</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {youOwe.map((item: any) => (
                                <motion.div
                                    layout
                                    key={item.splitId}
                                    className="glass-card p-4 flex items-center justify-between group hover:border-red-500/30 transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
                                            <User size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white group-hover:text-red-400 transition-colors uppercase tracking-tight">
                                                {item.user.username}
                                            </p>
                                            <p className="text-[9px] text-[var(--text-muted)] font-black uppercase tracking-widest">{item.expenseDescription}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <p className="text-md font-black text-red-500">₹{item.amount.toFixed(2)}</p>
                                        <button
                                            onClick={() => handleSettleNow(item.expenseId)}
                                            disabled={isPending}
                                            className="px-3 py-1.5 rounded-lg bg-red-500/10 text-[9px] font-black text-red-500 uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all border border-red-500/20 disabled:opacity-50"
                                        >
                                            {isPending ? 'Updating...' : 'Settle Now'}
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* History Feed */}
            <section className="space-y-4 pt-4">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-[var(--text-muted)] text-[10px] font-black uppercase tracking-[0.3em]">Master Feed</h3>
                    <div className="text-[9px] font-bold text-[var(--text-muted)] uppercase bg-[var(--bg-secondary)] px-2 py-1 rounded border border-[var(--border)]">
                        {expenses.length} Records
                    </div>
                </div>

                {expenses.length === 0 ? (
                    <div className="glass-panel p-20 text-center flex flex-col items-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center border border-[var(--border)] text-[var(--text-muted)]">
                            <ReceiptText size={40} />
                        </div>
                        <div>
                            <p className="text-white font-bold">No history found</p>
                            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest mt-1">Start by adding a split above</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {expenses.map((exp: any) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={exp.id}
                                className={cn(
                                    "glass-card p-4 group transition-all relative overflow-hidden",
                                    exp.isSettled ? 'opacity-40 grayscale-sm hover:grayscale-0 hover:opacity-100' : 'hover:border-[var(--neon-purple)]/50'
                                )}
                            >
                                {exp.isSettled && (
                                    <div className="absolute top-0 right-0 p-2 opacity-20 pointer-events-none">
                                        <CheckCircle2 size={48} className="text-green-500 rotate-12" />
                                    </div>
                                )}

                                <div className="flex items-start justify-between relative z-10">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-2 h-2 rounded-full",
                                                exp.isSettled ? "bg-green-500" : "bg-[var(--neon-gold)] animate-pulse"
                                            )} />
                                            <h4 className="font-bold text-md text-white tracking-tight">{exp.description}</h4>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[9px] text-[var(--text-muted)] font-black uppercase tracking-widest">
                                            <span className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded">
                                                {format(new Date(exp.date), 'dd MMM yyyy')}
                                            </span>
                                            <span className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded">
                                                By {exp.paidBy.username === currentUserId ? 'You' : exp.paidBy.username}
                                            </span>
                                            {exp.category && (
                                                <span className="text-[var(--neon-purple)] bg-[var(--neon-purple)]/10 px-2 py-1 rounded border border-[var(--neon-purple)]/20">
                                                    {exp.category}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-black text-white">₹{exp.totalAmount.toLocaleString()}</p>
                                        <p className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-wider">Total Amount</p>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-[var(--border)] grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {exp.splits.map((split: any) => (
                                        <div key={split.id} className={cn(
                                            "flex flex-col gap-1 p-2 rounded-xl border text-[9px] font-black uppercase tracking-tight transition-all",
                                            split.isPaid
                                                ? 'bg-green-500/5 border-green-500/20 text-green-400'
                                                : 'bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-muted)]'
                                        )}>
                                            <div className="flex items-center justify-between">
                                                <span className="truncate max-w-[80%]">{split.user.username}</span>
                                                {split.isPaid && <CheckCircle2 size={10} />}
                                            </div>
                                            <span className="text-xs text-white">₹{split.shareAmount.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
