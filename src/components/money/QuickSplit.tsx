'use client';

import { useState, useEffect, useRef } from 'react';
import { addSharedExpense } from '@/app/money/splits/actions';
import { Category } from '@prisma/client';
import { Plus, Users, Zap, Tag, X, ChevronDown, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface UserOption {
    id: string;
    username: string;
}

export default function QuickSplit({
    categories,
    allUsers
}: {
    categories: Category[];
    allUsers: UserOption[]
}) {
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
        <div className="w-full glass-card overflow-hidden glow-effect mb-8">
            <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Step 1: Amount */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <span className="text-[var(--neon-gold)] text-2xl font-bold">₹</span>
                        </div>
                        <input
                            type="number"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full bg-[var(--bg-secondary)] text-5xl font-bold text-white placeholder-[var(--text-muted)] pl-12 pr-4 py-4 rounded-xl border border-[var(--border)] focus:outline-none focus:border-[var(--neon-gold)] focus:ring-2 focus:ring-[var(--neon-gold)]/20 transition-all"
                            required
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
                                    <label className="text-xs font-bold text-[var(--neon-cyan)] uppercase tracking-wider mb-3 block">
                                        Category
                                    </label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {categories.filter(c => c.type === 'EXPENSE').map(cat => (
                                            <button
                                                key={cat.id}
                                                type="button"
                                                onClick={() => setSelectedCategory(cat)}
                                                className={cn(
                                                    "p-3 rounded-xl border text-xs font-medium transition-all duration-200 flex flex-col items-center justify-center gap-1 h-20",
                                                    selectedCategory?.id === cat.id
                                                        ? "bg-gradient-to-br from-[var(--neon-purple)] to-[var(--neon-blue)] text-white border-transparent shadow-lg shadow-purple-500/50"
                                                        : "bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--neon-purple)]"
                                                )}
                                            >
                                                <Tag size={16} />
                                                <span className="truncate w-full text-center">{cat.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Step 3: Participants Dropdown */}
                                <div className="relative" ref={dropdownRef}>
                                    <label className="text-xs font-bold text-[var(--neon-purple)] uppercase tracking-wider mb-3 block">
                                        Split With
                                    </label>

                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {participants.map(p => (
                                            <span key={p} className="flex items-center gap-1 px-3 py-1 bg-[var(--neon-purple)]/20 text-[var(--neon-purple)] rounded-full text-sm font-bold border border-[var(--neon-purple)]/30 group">
                                                {p}
                                                <button type="button" onClick={() => toggleParticipant(p)} className="hover:text-white transition-colors">
                                                    <X size={14} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>

                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Users size={18} className="text-[var(--text-muted)]" />
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
                                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl pl-12 pr-4 py-3 text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--neon-purple)] transition-all"
                                        />
                                        <ChevronDown className="absolute right-4 top-3 text-[var(--text-muted)]" size={18} />
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
                                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3 text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--neon-purple)]"
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
                                        "w-full font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 overflow-hidden relative",
                                        success
                                            ? "bg-green-500 text-white"
                                            : "bg-gradient-to-r from-[var(--neon-gold)] to-[var(--neon-purple)] text-white hover:shadow-lg hover:shadow-gold-500/20 hover:scale-[1.02] active:scale-[0.98]"
                                    )}
                                >
                                    {isSubmitting ? (
                                        <>Processing...</>
                                    ) : success ? (
                                        <>
                                            <Check size={18} />
                                            Split Successfully Created!
                                        </>
                                    ) : (
                                        <>
                                            <Zap size={18} />
                                            Split with {participants.length} {participants.length === 1 ? 'person' : 'people'}
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
