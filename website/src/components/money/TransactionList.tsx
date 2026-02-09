'use client'

import { TransactionWithCategory } from '@/types/money';
import { format } from 'date-fns';
import { ArrowUpRight, ArrowDownLeft, TrendingUp, TrendingDown } from 'lucide-react';

export default function TransactionList({ transactions }: { transactions: TransactionWithCategory[] }) {
    if (transactions.length === 0) {
        return (
            <div className="text-center py-16 glass-card">
                <p className="text-[var(--text-muted)] text-sm">No transactions yet</p>
                <p className="text-[var(--text-muted)] text-xs mt-1">Start by adding your first transaction above</p>
            </div>
        )
    }

    return (
        <div className="space-y-3">
            {transactions.map((t) => (
                <div key={t.id} className="glass-card p-4 hover:scale-[1.01] transition-all group">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl transition-all ${t.type === 'INCOME'
                                    ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/10 text-green-400 group-hover:shadow-lg group-hover:shadow-green-500/20'
                                    : 'bg-gradient-to-br from-red-500/20 to-pink-500/10 text-red-400 group-hover:shadow-lg group-hover:shadow-red-500/20'
                                }`}>
                                {t.type === 'INCOME' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                            </div>
                            <div>
                                <p className="font-semibold text-white text-base">{t.category.name}</p>
                                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                                    {t.description || format(new Date(t.date), 'PPp')}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className={`text-xl font-bold ${t.type === 'INCOME' ? 'text-green-400' : 'text-white'
                                }`}>
                                {t.type === 'INCOME' ? '+' : '-'}₹{t.amount.toFixed(2)}
                            </p>
                            <p className="text-[10px] text-[var(--text-muted)] mt-0.5 uppercase tracking-wider">
                                {format(new Date(t.date), 'MMM d')}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
