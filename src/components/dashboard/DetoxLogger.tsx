'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Shield, AlertTriangle, CheckCircle, XCircle, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';

export function DetoxLogger() {
    const { state, updateDailyLog } = useApp();
    const today = new Date().toISOString().split('T')[0];
    const currentLog = state.dailyLogs[today] || { detoxLog: [] };

    const [isLogging, setIsLogging] = useState(false);
    const [trigger, setTrigger] = useState('');
    const [mode, setMode] = useState<'Fog' | 'Impulse'>('Fog');

    const handleLog = async (outcome: 'Success' | 'Failure') => {
        if (!trigger) return;

        const newEntry = {
            id: uuidv4(),
            timestamp: new Date().toISOString(),
            trigger,
            response: mode === 'Fog' ? 'Deep Work / Walk' : 'Pushups / Cold Water', // Default responses
            outcome
        };

        const newLog = [...(currentLog.detoxLog || []), newEntry];
        await updateDailyLog(today, { detoxLog: newLog });

        setIsLogging(false);
        setTrigger('');
    };

    const successCount = currentLog.detoxLog?.filter(l => l.outcome === 'Success').length || 0;
    const failureCount = currentLog.detoxLog?.filter(l => l.outcome === 'Failure').length || 0;

    return (
        <motion.div
            className="glass-panel p-6 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg border flex items-center justify-center transition-colors ${failureCount > 0 ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-[var(--bg-tertiary)] border-[var(--border)] text-[var(--neon-blue)]'
                        }`}>
                        <Shield size={24} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold">Defense System</h2>
                        <div className="flex gap-2 text-xs font-mono">
                            <span className="text-[var(--neon-green)]">{successCount} DEFLECTED</span>
                            <span className="text-[var(--text-muted)]">|</span>
                            <span className={failureCount > 0 ? "text-red-500" : "text-[var(--text-muted)]"}>{failureCount} BREACHES</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => setIsLogging(true)}
                    className="relative overflow-hidden bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-primary)] px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:border-[var(--neon-blue)] hover:text-[var(--neon-blue)] text-xs flex items-center gap-2"
                >
                    <AlertTriangle size={14} />
                    <span>LOG THREAT</span>
                </button>
            </div>

            {/* Recent Logs Viz */}
            <div className="flex gap-1 h-2 w-full bg-[var(--bg-tertiary)] rounded-full overflow-hidden mb-4">
                {currentLog.detoxLog?.map((log, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, scaleY: 0 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        className={`h-full flex-1 ${log.outcome === 'Success' ? 'bg-[var(--neon-green)]' : 'bg-red-500'}`}
                        title={`${log.trigger} - ${log.outcome}`}
                    />
                ))}
            </div>

            <AnimatePresence>
                {isLogging && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-[var(--bg-tertiary)] rounded-lg p-4 border border-[var(--border)] mb-2">
                            <div className="flex gap-2 mb-3">
                                <button
                                    onClick={() => setMode('Fog')}
                                    className={`flex-1 py-1 text-xs rounded border transition-colors ${mode === 'Fog' ? 'bg-[var(--bg-secondary)] border-[var(--text-primary)]' : 'border-transparent text-[var(--text-muted)]'}`}
                                >
                                    FOG HABIT
                                </button>
                                <button
                                    onClick={() => setMode('Impulse')}
                                    className={`flex-1 py-1 text-xs rounded border transition-colors ${mode === 'Impulse' ? 'bg-[var(--bg-secondary)] border-[var(--text-primary)]' : 'border-transparent text-[var(--text-muted)]'}`}
                                >
                                    IMPULSE LOOP
                                </button>
                            </div>

                            <input
                                type="text"
                                autoFocus
                                value={trigger}
                                onChange={(e) => setTrigger(e.target.value)}
                                placeholder="Identify the trigger..."
                                className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded p-2 text-sm mb-3 focus:border-[var(--neon-blue)] outline-none"
                            />

                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleLog('Success')}
                                    disabled={!trigger}
                                    className="flex-1 bg-[var(--neon-green)]/10 text-[var(--neon-green)] border border-[var(--neon-green)] rounded py-2 text-xs font-bold hover:bg-[var(--neon-green)] hover:text-black transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <CheckCircle size={14} /> DEFLECTED
                                </button>
                                <button
                                    onClick={() => handleLog('Failure')}
                                    disabled={!trigger}
                                    className="flex-1 bg-red-500/10 text-red-500 border border-red-500 rounded py-2 text-xs font-bold hover:bg-red-500 hover:text-black transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <XCircle size={14} /> BREACHED
                                </button>
                            </div>
                        </div>

                        <button onClick={() => setIsLogging(false)} className="w-full text-center text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)]">
                            Cancel
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {!isLogging && currentLog.detoxLog && currentLog.detoxLog.length === 0 && (
                <div className="text-center text-xs text-[var(--text-muted)] py-2 italic opacity-50">
                    System Quiet. No threats detected.
                </div>
            )}
        </motion.div>
    );
}
