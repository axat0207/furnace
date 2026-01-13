'use client'

import { useState, useRef } from 'react';
import { addTransaction } from '@/app/money/actions';
import { Category } from '@prisma/client';
import { Plus, Minus, DollarSign, Calendar, Tag, ChevronDown, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { CategoryManager } from './CategoryManager';


export default function QuickAdd({ categories: initialCategories }: { categories: Category[] }) {
    const [categories, setCategories] = useState(initialCategories);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [type, setType] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    const filteredCategories = categories.filter(c => c.type === type);

    const handleCategoryAdded = async () => {
        // Fetch updated categories
        const response = await fetch('/api/money/categories', { cache: 'no-store' });
        if (response.ok) {
            const updatedCategories = await response.json();
            setCategories(updatedCategories);
        }
    };

    const handleCategoryDeleted = async () => {
        // Fetch updated categories
        const response = await fetch('/api/money/categories', { cache: 'no-store' });
        if (response.ok) {
            const updatedCategories = await response.json();
            setCategories(updatedCategories);
            // Clear selected category if it was deleted
            if (selectedCategory && !updatedCategories.find((c: Category) => c.id === selectedCategory.id)) {
                setSelectedCategory(null);
            }
        }
    };

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
            <div className="p-4 md:p-6">
                <div className="flex items-center justify-center mb-4 md:mb-6">
                    <div className="flex space-x-1.5 md:space-x-2 bg-[var(--bg-secondary)] p-1 md:p-1.5 rounded-xl border border-[var(--border)] w-full md:w-auto">
                        <button
                            type="button"
                            onClick={() => setType('EXPENSE')}
                            className={cn(
                                "flex-1 md:flex-none px-4 md:px-6 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-bold transition-all duration-300 flex items-center justify-center gap-1.5 md:gap-2",
                                type === 'EXPENSE'
                                    ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/50"
                                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                            )}
                        >
                            <Minus size={14} className="md:w-4 md:h-4" />
                            <span>Expense</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setType('INCOME')}
                            className={cn(
                                "flex-1 md:flex-none px-4 md:px-6 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-bold transition-all duration-300 flex items-center justify-center gap-1.5 md:gap-2",
                                type === 'INCOME'
                                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/50"
                                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                            )}
                        >
                            <Plus size={14} className="md:w-4 md:h-4" />
                            <span>Income</span>
                        </button>
                    </div>
                </div>

                <form action={handleSubmit} ref={formRef} className="space-y-4 md:space-y-6">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none">
                            <span className="text-[var(--neon-purple)] text-xl md:text-2xl font-bold">₹</span>
                        </div>
                        <input
                            name="amount"
                            type="number"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full bg-[var(--bg-secondary)] text-3xl md:text-5xl font-bold text-white placeholder-[var(--text-muted)] pl-10 md:pl-12 pr-3 md:pr-4 py-3 md:py-4 rounded-xl border border-[var(--border)] focus:outline-none focus:border-[var(--neon-purple)] focus:ring-2 focus:ring-[var(--neon-purple)]/20 transition-all"
                            required
                            inputMode="decimal"
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
                                    <div className="flex items-center justify-between mb-2 md:mb-3">
                                        <label className="text-[10px] md:text-xs font-bold text-[var(--neon-cyan)] uppercase tracking-wider">
                                            Category
                                        </label>
                                        <CategoryManager
                                            categories={categories}
                                            type={type}
                                            onCategoryAdded={handleCategoryAdded}
                                            onCategoryDeleted={handleCategoryDeleted}
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 md:grid-cols-3 gap-2 md:gap-3">
                                        {filteredCategories.map(cat => (
                                            <button
                                                key={cat.id}
                                                type="button"
                                                onClick={() => setSelectedCategory(cat)}
                                                className={cn(
                                                    "p-2 md:p-4 rounded-lg md:rounded-xl border text-[10px] md:text-sm font-medium transition-all duration-200 flex flex-col items-center justify-center gap-1 md:gap-2 h-16 md:h-24 active:scale-95 md:hover:scale-105 touch-manipulation",
                                                    selectedCategory?.id === cat.id
                                                        ? "bg-gradient-to-br from-[var(--neon-purple)] to-[var(--neon-blue)] text-white border-transparent shadow-lg shadow-purple-500/50"
                                                        : "bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--neon-purple)]"
                                                )}
                                            >
                                                <Tag size={14} className="md:w-[18px] md:h-[18px]" />
                                                <span className="truncate w-full text-center">{cat.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <input
                                    name="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Add a note (optional)..."
                                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--neon-purple)] focus:ring-2 focus:ring-[var(--neon-purple)]/20 transition-all"
                                />

                                <button
                                    type="submit"
                                    disabled={!selectedCategory || !amount || isSubmitting}
                                    className="w-full bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-pink)] text-white font-bold py-3 md:py-4 rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] md:hover:scale-[1.02] flex items-center justify-center gap-2 text-sm md:text-base touch-manipulation"
                                >
                                    {isSubmitting ? (
                                        <>Processing...</>
                                    ) : (
                                        <>
                                            <Zap size={16} className="md:w-[18px] md:h-[18px]" />
                                            <span>Add Transaction</span>
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
