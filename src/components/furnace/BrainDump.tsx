'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Trash2, Brain, Loader2 } from 'lucide-react';
import { chatWithGemini } from '@/app/ai-actions';

export function BrainDump() {
    const [isOpen, setIsOpen] = useState(false);
    const [text, setText] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState<string | null>(null);

    const handleAnalyze = async () => {
        if (!text.trim()) return;
        setIsAnalyzing(true);
        setAnalysis(null);

        // Construct a specific prompt for brain dump analysis
        const response = await chatWithGemini([
            { role: 'user', parts: `Here is my brain dump: "${text}". Please analyze this and give me 3 clear, actionable steps or insights to clear my mind.` }
        ]);

        setAnalysis(response);
        setIsAnalyzing(false);
    };

    const handleClear = () => {
        setText('');
        setAnalysis(null);
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 p-4 rounded-full bg-furnace-primary text-white shadow-[0_0_20px_rgba(255,85,0,0.4)] hover:scale-110 transition-transform z-50"
            >
                <Brain size={24} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-furnace-gray border border-white/10 w-full max-w-2xl rounded-2xl p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Brain className="text-furnace-accent" />
                                    Mental Clearance
                                </h2>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-white/50 hover:text-white"
                                >
                                    Close
                                </button>
                            </div>

                            {!analysis ? (
                                <>
                                    <textarea
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        placeholder="Dump everything on your mind here. Tasks, worries, ideas..."
                                        className="w-full h-64 bg-black/50 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-furnace-primary/50 resize-none font-mono text-sm leading-relaxed"
                                    />
                                    <div className="flex justify-between mt-4">
                                        <button
                                            onClick={handleClear}
                                            className="flex items-center gap-2 text-red-400 hover:text-red-300 px-4 py-2 hover:bg-white/5 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={16} />
                                            Clear
                                        </button>
                                        <button
                                            onClick={handleAnalyze}
                                            disabled={isAnalyzing || !text.trim()}
                                            className="bg-white text-black font-bold px-6 py-2 rounded-lg hover:bg-furnace-accent transition-colors flex items-center gap-2 disabled:opacity-50"
                                        >
                                            {isAnalyzing ? <Loader2 className="animate-spin" /> : <Send size={16} />}
                                            {isAnalyzing ? 'Analyzing...' : 'Archive & Analyze'}
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-4">
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-gray-300 italic text-sm">
                                        "{text}"
                                    </div>
                                    <div className="prose prose-invert max-w-none">
                                        <h3 className="text-furnace-accent font-bold text-lg mb-2">Analysis:</h3>
                                        <div className="whitespace-pre-wrap text-white/90 leading-relaxed font-medium">
                                            {analysis}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => { setAnalysis(null); setText(''); }}
                                        className="w-full py-3 bg-furnace-primary/20 text-furnace-primary border border-furnace-primary/50 rounded-lg hover:bg-furnace-primary/30 transition-colors font-bold mt-4"
                                    >
                                        Start New Session
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
