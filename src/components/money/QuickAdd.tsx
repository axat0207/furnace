'use client'

import { useState, useRef } from 'react';
import { addTransaction } from '@/app/money/actions';
import { Category } from '@prisma/client';
import { Plus, Minus, DollarSign, Calendar, Tag, ChevronDown, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';


export default function QuickAdd({ categories }: { categories: Category[] }) {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [type, setType] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    const filteredCategories = categories.filter(c => c.type === type);

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        try {
            if (!selectedCategory) return;
            formData.set('categoryId', selectedCategory.id);
            formData.set('type', type);
            formData.set('date', new Date().toISOString());

            await addTransaction(formData);

            // Reset
            setAmount('');
            setDescription('');
            setSelectedCategory(null);
            setIsExpanded(false);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="w-full glass-card overflow-hidden glow-effect">
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex space-x-2 bg-[var(--bg-secondary)] p-1.5 rounded-xl border border-[var(--border)]">
                        <button
                            onClick={() => setType('EXPENSE')}
                            className={cn(
                                "px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 flex items-center gap-2",
                                type === 'EXPENSE'
                                    ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/50"
                                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                            )}
                        >
                            <Minus size={16} />
                            Expense
                        </button>
                        <button
                            onClick={() => setType('INCOME')}
                            className={cn(
                                "px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 flex items-center gap-2",
                                type === 'INCOME'
                                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/50"
                                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                            )}
                        >
                            <Plus size={16} />
                            Income
                        </button>
                    </div>
                </div>

                <form action={handleSubmit} ref={formRef} className="space-y-6">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <span className="text-[var(--neon-purple)] text-2xl font-bold">₹</span>
                        </div>
                        <input
                            name="amount"
                            type="number"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full bg-[var(--bg-secondary)] text-5xl font-bold text-white placeholder-[var(--text-muted)] pl-12 pr-4 py-4 rounded-xl border border-[var(--border)] focus:outline-none focus:border-[var(--neon-purple)] focus:ring-2 focus:ring-[var(--neon-purple)]/20 transition-all"
                            required
                        />
                    </div>

                    <AnimatePresence>
                        {(amount || isExpanded) && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="space-y-6 overflow-hidden"
                            >
                                <div>
                                    <label className="text-xs font-bold text-[var(--neon-cyan)] uppercase tracking-wider mb-3 block">
                                        Select Category
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {filteredCategories.map(cat => (
                                            <button
                                                key={cat.id}
                                                type="button"
                                                onClick={() => setSelectedCategory(cat)}
                                                className={cn(
                                                    "p-4 rounded-xl border text-sm font-medium transition-all duration-200 flex flex-col items-center justify-center gap-2 h-24 hover:scale-105",
                                                    selectedCategory?.id === cat.id
                                                        ? "bg-gradient-to-br from-[var(--neon-purple)] to-[var(--neon-blue)] text-white border-transparent shadow-lg shadow-purple-500/50"
                                                        : "bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--neon-purple)]"
                                                )}
                                            >
                                                <Tag size={18} />
                                                {cat.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <input
                                    name="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Add a note (optional)..."
                                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3 text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--neon-purple)] focus:ring-2 focus:ring-[var(--neon-purple)]/20 transition-all"
                                />

                                <button
                                    type="submit"
                                    disabled={!selectedCategory || !amount || isSubmitting}
                                    className="w-full bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-pink)] text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>Processing...</>
                                    ) : (
                                        <>
                                            <Zap size={18} />
                                            Add Transaction
                                        </>
                                    )}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {!amount && !isExpanded && (
                        <div
                            className="text-center text-[var(--text-muted)] text-sm py-3 cursor-pointer hover:text-[var(--neon-purple)] transition-colors"
                            onClick={() => setIsExpanded(true)}
                        >
                            Click to expand and add details →
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
}
