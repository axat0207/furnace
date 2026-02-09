'use client';

import { useState, useEffect, useRef } from 'react';
import { addSharedExpense } from '@/app/money/splits/actions';
import { Category } from '@prisma/client';
import { Plus, Users, Zap, Tag, X, ChevronDown, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { CategoryManager } from './CategoryManager';

interface UserOption {
    id: string;
    username: string;
}

export default function QuickSplit({
    categories: initialCategories,
    allUsers
}: {
    categories: Category[];
    allUsers: UserOption[]
}) {
    const [categories, setCategories] = useState(initialCategories);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [participants, setParticipants] = useState<string[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const filteredUsers = allUsers.filter(u =>
        u.username.toLowerCase().includes(userInput.toLowerCase()) &&
        !participants.includes(u.username)
    );

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowUserDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    const toggleParticipant = (username: string) => {
        setParticipants(prev =>
            prev.includes(username)
                ? prev.filter(u => u !== username)
                : [...prev, username]
        );
        setUserInput('');
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        if (!amount || !selectedCategory || participants.length === 0) {
            setError("Fill all required fields");
            return;
        }

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.set('description', description || `${selectedCategory.name} Split`);
            formData.set('totalAmount', amount);
            formData.set('category', selectedCategory.name);
            formData.set('participants', participants.join(','));
            formData.set('splitType', 'equal');

            const result = await addSharedExpense(formData);

            if (result?.success) {
                setSuccess(true);
                setAmount('');
                setDescription('');
                setSelectedCategory(null);
                setParticipants([]);
                setUserInput('');
            } else {
                setError(result?.error || "Failed to add expense");
            }
        } catch (error) {
            setError("Connection error");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="w-full glass-card overflow-hidden glow-effect mb-4 md:mb-8">
            <div className="p-4 md:p-6">
                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                    {/* Step 1: Amount */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none">
                            <span className="text-[var(--neon-gold)] text-xl md:text-2xl font-bold">₹</span>
                        </div>
                        <input
                            type="number"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full bg-[var(--bg-secondary)] text-3xl md:text-5xl font-bold text-white placeholder-[var(--text-muted)] pl-10 md:pl-12 pr-3 md:pr-4 py-3 md:py-4 rounded-xl border border-[var(--border)] focus:outline-none focus:border-[var(--neon-gold)] focus:ring-2 focus:ring-[var(--neon-gold)]/20 transition-all"
                            required
                            inputMode="decimal"
                        />
                    </div>

                    <AnimatePresence>
                        {parseFloat(amount) > 0 && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="space-y-6 overflow-hidden"
                            >
                                {/* Step 2: Categories (Now visible after amount) */}
                                <div>
                                    <div className="flex items-center justify-between mb-2 md:mb-3">
                                        <label className="text-[10px] md:text-xs font-bold text-[var(--neon-cyan)] uppercase tracking-wider">
                                            Category
                                        </label>
                                        <CategoryManager
                                            categories={categories}
                                            type="EXPENSE"
                                            onCategoryAdded={async () => {
                                                const response = await fetch('/api/money/categories', { cache: 'no-store' });
                                                if (response.ok) {
                                                    const updatedCategories = await response.json();
                                                    setCategories(updatedCategories);
                                                }
                                            }}
                                            onCategoryDeleted={async () => {
                                                const response = await fetch('/api/money/categories', { cache: 'no-store' });
                                                if (response.ok) {
                                                    const updatedCategories = await response.json();
                                                    setCategories(updatedCategories);
                                                    if (selectedCategory && !updatedCategories.find((c: Category) => c.id === selectedCategory.id)) {
                                                        setSelectedCategory(null);
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="grid grid-cols-5 md:grid-cols-4 gap-1.5 md:gap-2">
                                        {categories.filter(c => c.type === 'EXPENSE').map(cat => (
                                            <button
                                                key={cat.id}
                                                type="button"
                                                onClick={() => setSelectedCategory(cat)}
                                                className={cn(
                                                    "p-2 md:p-3 rounded-lg md:rounded-xl border text-[10px] md:text-xs font-medium transition-all duration-200 flex flex-col items-center justify-center gap-1 h-16 md:h-20 active:scale-95 md:hover:scale-105 touch-manipulation",
                                                    selectedCategory?.id === cat.id
                                                        ? "bg-gradient-to-br from-[var(--neon-purple)] to-[var(--neon-blue)] text-white border-transparent shadow-lg shadow-purple-500/50"
                                                        : "bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--neon-purple)]"
                                                )}
                                            >
                                                <Tag size={12} className="md:w-4 md:h-4" />
                                                <span className="truncate w-full text-center leading-tight">{cat.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Step 3: Participants Dropdown */}
                                <div className="relative" ref={dropdownRef}>
                                    <label className="text-[10px] md:text-xs font-bold text-[var(--neon-purple)] uppercase tracking-wider mb-2 md:mb-3 block">
                                        Split With
                                    </label>

                                    <div className="flex flex-wrap gap-1.5 md:gap-2 mb-2 md:mb-3">
                                        {participants.map(p => (
                                            <span key={p} className="flex items-center gap-1 px-2 md:px-3 py-1 bg-[var(--neon-purple)]/20 text-[var(--neon-purple)] rounded-full text-xs md:text-sm font-bold border border-[var(--neon-purple)]/30 group">
                                                <span className="truncate max-w-[80px] md:max-w-none">{p}</span>
                                                <button type="button" onClick={() => toggleParticipant(p)} className="hover:text-white transition-colors flex-shrink-0">
                                                    <X size={12} className="md:w-[14px] md:h-[14px]" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>

                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none">
                                            <Users size={16} className="md:w-[18px] md:h-[18px] text-[var(--text-muted)]" />
                                        </div>
                                        <input
                                            value={userInput}
                                            onChange={(e) => {
                                                setUserInput(e.target.value);
                                                setShowUserDropdown(true);
                                                setError(null);
                                            }}
                                            onFocus={() => setShowUserDropdown(true)}
                                            placeholder="Type or select users..."
                                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl pl-10 md:pl-12 pr-3 md:pr-4 py-2.5 md:py-3 text-sm md:text-base text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--neon-purple)] transition-all"
                                        />
                                        <ChevronDown className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
                                    </div>

                                    <AnimatePresence>
                                        {showUserDropdown && filteredUsers.length > 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="absolute z-50 w-full mt-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl shadow-2xl max-h-60 overflow-y-auto backdrop-blur-xl"
                                            >
                                                {filteredUsers.map(u => (
                                                    <button
                                                        key={u.id}
                                                        type="button"
                                                        onClick={() => toggleParticipant(u.username)}
                                                        className="w-full text-left px-4 py-3 hover:bg-[var(--bg-tertiary)] transition-colors flex items-center justify-between group"
                                                    >
                                                        <span className="text-white font-medium">{u.username}</span>
                                                        <Plus size={16} className="text-[var(--neon-blue)] opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <input
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="What's this for? (optional)"
                                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--neon-purple)]"
                                />

                                <AnimatePresence>
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="text-red-500 text-xs font-bold flex items-center gap-2 px-2"
                                        >
                                            <AlertCircle size={14} />
                                            {error}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <button
                                    type="submit"
                                    disabled={!selectedCategory || !amount || participants.length === 0 || isSubmitting}
                                    className={cn(
                                        "w-full font-bold py-3 md:py-4 rounded-xl transition-all flex items-center justify-center gap-2 overflow-hidden relative text-sm md:text-base touch-manipulation",
                                        success
                                            ? "bg-green-500 text-white"
                                            : "bg-gradient-to-r from-[var(--neon-gold)] to-[var(--neon-purple)] text-white hover:shadow-lg hover:shadow-gold-500/20 active:scale-[0.98] md:hover:scale-[1.02]"
                                    )}
                                >
                                    {isSubmitting ? (
                                        <>Processing...</>
                                    ) : success ? (
                                        <>
                                            <Check size={16} className="md:w-[18px] md:h-[18px]" />
                                            <span>Split Created!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Zap size={16} className="md:w-[18px] md:h-[18px]" />
                                            <span>Split with {participants.length} {participants.length === 1 ? 'person' : 'people'}</span>
                                        </>
                                    )}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {!amount && (
                        <div className="text-center text-[var(--text-muted)] text-sm py-3 animate-pulse">
                            Enter an amount to start splitting →
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
