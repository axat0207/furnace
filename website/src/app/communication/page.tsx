'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Book, User, Sparkles, Mic, Send, Bot, ArrowLeft, Briefcase, Coffee, Globe, Brain, Code, Dumbbell, Landmark, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { chatWithGemini } from '@/app/ai-actions';
import Link from 'next/link';

type Mode = 'professional' | 'casual' | 'politics' | 'geopolitics' | 'technology' | 'computer_science' | 'gym' | 'custom';

const MODES: { id: Mode; label: string; icon: any; desc: string; category: 'tone' | 'intellectual' | 'custom' }[] = [
    // Tone-based modes
    { id: 'professional', label: 'Professional', icon: Briefcase, desc: 'Business communication, formal tone.', category: 'tone' },
    { id: 'casual', label: 'Casual', icon: Coffee, desc: 'Relaxed, friendly conversations.', category: 'tone' },

    // Intellectual topics
    { id: 'politics', label: 'Politics', icon: Landmark, desc: 'Political systems, debates, current affairs.', category: 'intellectual' },
    { id: 'geopolitics', label: 'Geopolitics', icon: Globe, desc: 'International relations, global strategy.', category: 'intellectual' },
    { id: 'technology', label: 'Technology', icon: Sparkles, desc: 'Tech trends, innovations, AI, startups.', category: 'intellectual' },
    { id: 'computer_science', label: 'Computer Science', icon: Code, desc: 'Programming, algorithms, system design.', category: 'intellectual' },
    { id: 'gym', label: 'Gym & Fitness', icon: Dumbbell, desc: 'Workout routines, nutrition, health.', category: 'intellectual' },

    // Custom mode
    { id: 'custom', label: 'Custom Topic', icon: Plus, desc: 'Define your own conversation topic.', category: 'custom' },
];

export default function CommunicationPage() {
    const [activeMode, setActiveMode] = useState<Mode>('professional');
    const [customTopic, setCustomTopic] = useState('');
    const [showCustomModal, setShowCustomModal] = useState(false);
    const [tempCustomTopic, setTempCustomTopic] = useState('');
    const [messages, setMessages] = useState<{ role: 'user' | 'model', parts: string }[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Reset chat when mode changes
    const handleModeChange = (mode: Mode) => {
        if (mode === 'custom') {
            setShowCustomModal(true);
            return;
        }
        setActiveMode(mode);
        setMessages([]);
    };

    const handleCustomTopicSubmit = () => {
        if (!tempCustomTopic.trim()) return;
        setCustomTopic(tempCustomTopic);
        setActiveMode('custom');
        setMessages([]);
        setShowCustomModal(false);
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { role: 'user' as const, parts: input }];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        const response = await chatWithGemini(newMessages, activeMode, customTopic);

        setMessages([...newMessages, { role: 'model', parts: response }]);
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-furnace-black flex flex-col md:flex-row">
            {/* Custom Topic Modal */}
            <AnimatePresence>
                {showCustomModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[70] flex items-center justify-center p-4"
                        onClick={() => setShowCustomModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-furnace-gray border border-white/10 w-full max-w-md rounded-2xl p-6 relative shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Plus className="text-furnace-primary" />
                                    Custom Topic
                                </h2>
                                <button
                                    onClick={() => setShowCustomModal(false)}
                                    className="text-white/50 hover:text-white"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-zinc-400 mb-2 block">
                                        What topic would you like to discuss?
                                    </label>
                                    <input
                                        type="text"
                                        value={tempCustomTopic}
                                        onChange={(e) => setTempCustomTopic(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleCustomTopicSubmit()}
                                        placeholder="e.g., Philosophy, History, Music Production..."
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-furnace-primary/50"
                                        autoFocus
                                    />
                                </div>

                                <div className="bg-indigo-900/20 border border-indigo-500/20 rounded-xl p-4">
                                    <h4 className="text-indigo-300 font-bold text-sm mb-2">💡 How to use:</h4>
                                    <ul className="text-xs text-indigo-100/80 space-y-1 leading-relaxed">
                                        <li>• Enter any topic you want to explore</li>
                                        <li>• The AI will become an expert on that subject</li>
                                        <li>• Have deep, meaningful conversations</li>
                                        <li>• Improve your communication skills</li>
                                    </ul>
                                </div>

                                <button
                                    onClick={handleCustomTopicSubmit}
                                    disabled={!tempCustomTopic.trim()}
                                    className="w-full bg-furnace-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-furnace-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Start Conversation
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Sidebar / Mode Selector */}
            <aside className="w-full md:w-80 border-r border-white/10 bg-black/20 p-6 flex flex-col overflow-y-auto">
                <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft size={16} />
                    Back to Dashboard
                </Link>
                <h1 className="text-2xl font-bold text-white mb-6">Speech Dojo</h1>

                <div className="space-y-6 flex-1">
                    {/* Tone Modes */}
                    <div>
                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Conversation Tone</h3>
                        <div className="space-y-2">
                            {MODES.filter(m => m.category === 'tone').map((mode) => (
                                <button
                                    key={mode.id}
                                    onClick={() => handleModeChange(mode.id)}
                                    className={cn(
                                        "w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-3",
                                        activeMode === mode.id
                                            ? "bg-furnace-primary/10 border-furnace-primary text-white"
                                            : "bg-white/5 border-transparent text-zinc-400 hover:bg-white/10 hover:text-zinc-200"
                                    )}
                                >
                                    <mode.icon size={20} className={activeMode === mode.id ? "text-furnace-primary" : "text-zinc-500"} />
                                    <div>
                                        <div className="font-medium text-sm">{mode.label}</div>
                                        <div className="text-xs opacity-60">{mode.desc}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Intellectual Topics */}
                    <div>
                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Intellectual Topics</h3>
                        <div className="space-y-2">
                            {MODES.filter(m => m.category === 'intellectual').map((mode) => (
                                <button
                                    key={mode.id}
                                    onClick={() => handleModeChange(mode.id)}
                                    className={cn(
                                        "w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-3",
                                        activeMode === mode.id
                                            ? "bg-furnace-primary/10 border-furnace-primary text-white"
                                            : "bg-white/5 border-transparent text-zinc-400 hover:bg-white/10 hover:text-zinc-200"
                                    )}
                                >
                                    <mode.icon size={20} className={activeMode === mode.id ? "text-furnace-primary" : "text-zinc-500"} />
                                    <div>
                                        <div className="font-medium text-sm">{mode.label}</div>
                                        <div className="text-xs opacity-60">{mode.desc}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Custom Mode */}
                    <div>
                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Your Topic</h3>
                        <div className="space-y-2">
                            {MODES.filter(m => m.category === 'custom').map((mode) => (
                                <button
                                    key={mode.id}
                                    onClick={() => handleModeChange(mode.id)}
                                    className={cn(
                                        "w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-3",
                                        activeMode === mode.id && customTopic
                                            ? "bg-furnace-primary/10 border-furnace-primary text-white"
                                            : "bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/30 text-purple-200 hover:border-purple-500/50"
                                    )}
                                >
                                    <mode.icon size={20} className={activeMode === mode.id && customTopic ? "text-furnace-primary" : "text-purple-400"} />
                                    <div className="flex-1">
                                        <div className="font-medium text-sm">
                                            {activeMode === 'custom' && customTopic ? customTopic : mode.label}
                                        </div>
                                        <div className="text-xs opacity-60">{mode.desc}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/10">
                    <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 p-4 rounded-xl border border-indigo-500/20">
                        <h4 className="text-indigo-300 font-bold text-sm mb-1">💡 Pro Tip</h4>
                        <p className="text-xs text-indigo-100/80 leading-relaxed">
                            Practice makes perfect. The more you engage, the better your communication skills become.
                        </p>
                    </div>
                </div>
            </aside>

            {/* Main Chat Area */}
            <main className="flex-1 flex flex-col h-[100vh]">
                {/* Chat Header */}
                <header className="h-16 border-b border-white/5 flex items-center px-6 bg-black/40 backdrop-blur-md sticky top-0 z-10">
                    <span className="w-2 h-2 rounded-full bg-furnace-primary mr-3 animate-pulse" />
                    <span className="font-mono text-sm tracking-wider text-zinc-400 uppercase">
                        Session: {activeMode === 'custom' && customTopic ? customTopic : MODES.find(m => m.id === activeMode)?.label}
                    </span>
                </header>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {messages.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center opacity-30 select-none">
                            <Sparkles size={48} className="mb-4 text-zinc-500" />
                            <p className="text-zinc-400 font-medium">Select a mode and start training.</p>
                        </div>
                    )}

                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={cn(
                                "flex gap-4 max-w-3xl",
                                msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                            )}
                        >
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center shrink-0 border",
                                msg.role === 'model'
                                    ? "bg-furnace-primary/10 border-furnace-primary/20 text-furnace-primary"
                                    : "bg-white/10 border-white/10 text-white"
                            )}>
                                {msg.role === 'model' ? <Bot size={18} /> : <User size={18} />}
                            </div>

                            <div className={cn(
                                "p-4 rounded-2xl text-base leading-relaxed max-w-[80%]",
                                msg.role === 'user'
                                    ? "bg-furnace-primary text-white rounded-tr-none"
                                    : "bg-white/5 text-zinc-100 border border-white/5 rounded-tl-none shadow-xl"
                            )}>
                                <div className="whitespace-pre-wrap">{msg.parts}</div>
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex gap-4 max-w-3xl">
                            <div className="w-10 h-10 rounded-full bg-furnace-primary/10 flex items-center justify-center shrink-0 border border-furnace-primary/20 text-furnace-primary">
                                <Bot size={18} />
                            </div>
                            <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/5 flex gap-1.5 items-center">
                                <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                                <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-6 bg-black/40 border-t border-white/5">
                    <div className="max-w-4xl mx-auto relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type your response..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-6 pr-14 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-furnace-primary/50 focus:bg-white/10 transition-all shadow-inner"
                            autoFocus
                        />
                        <button
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            className="absolute right-2 top-2 bottom-2 aspect-square bg-furnace-primary text-white rounded-xl hover:bg-furnace-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                    <p className="text-center text-zinc-600 text-xs mt-3">
                        AI can make mistakes. Trust your instincts.
                    </p>
                </div>
            </main>
        </div>
    );
}
