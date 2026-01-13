'use client';

import { useState } from 'react';
import { Category } from '@prisma/client';
import { Plus, X, Tag, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { addCategory, deleteCategory } from '@/app/money/actions';
import { cn } from '@/lib/utils';

interface CategoryManagerProps {
    categories: Category[];
    type: 'EXPENSE' | 'INCOME';
    onCategoryAdded?: () => void;
    onCategoryDeleted?: () => void;
}

export function CategoryManager({ categories, type, onCategoryAdded, onCategoryDeleted }: CategoryManagerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const filteredCategories = categories.filter(c => c.type === type);
    const canDelete = (cat: Category) => !cat.isDefault; // Can't delete default categories

    async function handleAddCategory(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (!newCategoryName.trim()) {
            setError('Category name is required');
            return;
        }

        // Check if category already exists
        if (filteredCategories.some(c => c.name.toLowerCase() === newCategoryName.trim().toLowerCase())) {
            setError('Category already exists');
            return;
        }

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.set('name', newCategoryName.trim());
            formData.set('type', type);
            formData.set('icon', 'tag'); // Default icon

            await addCategory(formData);
            setNewCategoryName('');
            setIsOpen(false);
            onCategoryAdded?.();
        } catch (err: any) {
            setError(err.message || 'Failed to add category');
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleDeleteCategory(categoryId: string) {
        if (!confirm('Delete this category? Transactions using it will remain but you won\'t be able to select it for new transactions.')) {
            return;
        }

        try {
            await deleteCategory(categoryId);
            onCategoryDeleted?.();
        } catch (err: any) {
            alert(err.message || 'Failed to delete category');
        }
    }

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-[var(--neon-cyan)] hover:text-[var(--neon-blue)] border border-[var(--neon-cyan)]/30 hover:border-[var(--neon-cyan)] rounded-lg transition-all hover:bg-[var(--neon-cyan)]/10"
            >
                <Plus size={14} />
                <span className="hidden sm:inline">Manage Categories</span>
                <span className="sm:hidden">+</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full right-0 md:left-0 mt-2 w-[calc(100vw-2rem)] md:w-80 max-w-sm bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl shadow-2xl z-50 backdrop-blur-xl"
                    >
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-bold text-[var(--text-primary)]">
                                    {type === 'EXPENSE' ? 'Expense' : 'Income'} Categories
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="p-1 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-white transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            {/* Existing Categories */}
                            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                                {filteredCategories.length === 0 ? (
                                    <p className="text-xs text-[var(--text-muted)] text-center py-4">
                                        No categories yet. Add one below!
                                    </p>
                                ) : (
                                    filteredCategories.map(cat => (
                                        <div
                                            key={cat.id}
                                            className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] group hover:border-[var(--neon-purple)] transition-colors"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Tag size={14} className="text-[var(--neon-purple)]" />
                                                <span className="text-sm text-[var(--text-secondary)]">{cat.name}</span>
                                                {cat.isDefault && (
                                                    <span className="text-[10px] text-[var(--text-muted)] bg-[var(--bg-tertiary)] px-1.5 py-0.5 rounded">
                                                        Default
                                                    </span>
                                                )}
                                            </div>
                                            {canDelete(cat) && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteCategory(cat.id)}
                                                    className="p-1 rounded hover:bg-red-500/20 text-[var(--text-muted)] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                                    title="Delete category"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Add New Category */}
                            <form onSubmit={handleAddCategory} className="space-y-2">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newCategoryName}
                                        onChange={(e) => {
                                            setNewCategoryName(e.target.value);
                                            setError(null);
                                        }}
                                        placeholder="New category name..."
                                        className="flex-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--neon-cyan)] focus:ring-1 focus:ring-[var(--neon-cyan)]/20"
                                        maxLength={30}
                                    />
                                    <button
                                        type="submit"
                                        disabled={!newCategoryName.trim() || isSubmitting}
                                        className={cn(
                                            "px-4 py-2 rounded-lg text-sm font-bold transition-all",
                                            "bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-blue)] text-white",
                                            "hover:shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        )}
                                    >
                                        {isSubmitting ? '...' : 'Add'}
                                    </button>
                                </div>
                                {error && (
                                    <p className="text-xs text-red-500 font-medium">{error}</p>
                                )}
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
