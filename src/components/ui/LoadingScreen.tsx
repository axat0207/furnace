'use client';

import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

export function LoadingScreen() {
    return (
        <div className="fixed inset-0 bg-[var(--bg-primary)] flex flex-col items-center justify-center z-[100]">
            <div className="relative">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-t-2 border-[var(--neon-gold)] opacity-50 blur-sm"
                    style={{ width: '80px', height: '80px', top: '-24px', left: '-24px' }}
                />
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                >
                    <Flame size={32} className="text-[var(--neon-red)] fill-[var(--neon-red)]" />
                </motion.div>
            </div>
            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 text-[var(--neon-gold)] font-mono text-xs tracking-[0.2em] uppercase"
            >
                Igniting Furnace...
            </motion.p>
        </div>
    );
}
