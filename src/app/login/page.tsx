'use client';

import { login, signup } from './actions';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Shield, UserPlus, LogIn, AlertCircle } from 'lucide-react';

export default function LoginPage() {
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        try {
            if (mode === 'login') {
                await login(formData);
            } else {
                await signup(formData);
            }
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)] text-[var(--text-primary)] relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-[var(--neon-gold)] opacity-[0.05] blur-[120px]" />
                <div className="absolute top-[40%] -right-[10%] w-[60%] h-[60%] rounded-full bg-[var(--neon-red)] opacity-[0.05] blur-[100px]" />
                <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] rounded-full bg-[var(--neon-purple)] opacity-[0.05] blur-[100px]" />
            </div>

            <div className="w-full max-w-md p-8 glass-panel relative z-10 m-4 glow-effect">
                <div className="text-center space-y-6 mb-10">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--neon-gold)] to-[var(--neon-red)] shadow-[0_0_30px_rgba(239,68,68,0.4)] mb-4"
                    >
                        <Flame className="text-white fill-white" size={32} />
                    </motion.div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">FURNACE OS</h1>
                        <p className="text-xs text-[var(--text-secondary)] font-bold uppercase tracking-widest opacity-60">System Access Protocol</p>
                    </div>
                </div>

                <div className="flex p-1 bg-[var(--bg-secondary)] rounded-xl mb-8 border border-[var(--border)]">
                    <button
                        onClick={() => { setMode('login'); setError(null); }}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${mode === 'login' ? 'bg-[var(--bg-tertiary)] text-[var(--neon-blue)] shadow-inner' : 'text-[var(--text-muted)] hover:text-white'}`}
                    >
                        <LogIn size={14} /> Login
                    </button>
                    <button
                        onClick={() => { setMode('signup'); setError(null); }}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${mode === 'signup' ? 'bg-[var(--bg-tertiary)] text-[var(--neon-purple)] shadow-inner' : 'text-[var(--text-muted)] hover:text-white'}`}
                    >
                        <UserPlus size={14} /> Create Account
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold flex items-center gap-2"
                            >
                                <AlertCircle size={14} />
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="space-y-2">
                        <label htmlFor="username" className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] ml-1">Identity Tag</label>
                        <div className="relative group">
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                className="w-full rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] px-4 py-4 text-white placeholder-[var(--text-muted)] focus:border-[var(--neon-blue)] focus:outline-none focus:ring-1 focus:ring-[var(--neon-blue)] transition-all font-mono group-hover:border-[var(--text-secondary)]"
                                placeholder="enter_username..."
                                autoComplete="username"
                                autoFocus
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full rounded-xl py-4 text-xs font-black uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${mode === 'login'
                                ? 'bg-white text-black hover:bg-[var(--text-primary)]'
                                : 'bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] text-white'
                            }`}
                    >
                        {loading ? 'PROCESSING...' : mode === 'login' ? 'AUTHENTICATE' : 'INITIALIZE ACCOUNT'}
                    </button>

                    <div className="flex items-center justify-center gap-2 text-[10px] text-[var(--text-muted)] uppercase tracking-widest pt-4 opacity-40">
                        <Shield size={12} />
                        End-to-End Encrypted Tunnel
                    </div>
                </form>
            </div>
        </div>
    );
}
