'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Book, User, Sparkles, Mic, Send, Bot, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { chatWithGemini } from '@/app/ai-actions';
import Link from 'next/link';

type Mode = 'general' | 'vocab' | 'grammar' | 'confidence' | 'roleplay';

const MODES: { id: Mode; label: string; icon: any; desc: string }[] = [
    { id: 'vocab', label: 'Vocabulary Builder', icon: Book, desc: 'Learn high-impact words.' },
    { id: 'grammar', label: 'Grammar Drill', icon: Mic, desc: 'Strict syntax correction.' },
    { id: 'roleplay', label: 'Roleplay', icon: User, desc: 'Practice real scenarios.' },
    { id: 'confidence', label: 'Confidence & Charisma', icon: Sparkles, desc: 'Tone, vibe, and mindset.' },
];

export default function CommunicationPage() {
    const [activeMode, setActiveMode] = useState<Mode>('vocab');
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
        setActiveMode(mode);
        setMessages([]);
        // Optional: Send an initial prompt to the AI to start the session context
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { role: 'user' as const, parts: input }];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        const response = await chatWithGemini(newMessages, activeMode);

        setMessages([...newMessages, { role: 'model', parts: response }]);
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-furnace-black flex flex-col md:flex-row">
            {/* Sidebar / Mode Selector */}
            <aside className="w-full md:w-80 border-r border-white/10 bg-black/20 p-6 flex flex-col">
                <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft size={16} />
                    Back to Dashboard
                </Link>
                <h1 className="text-2xl font-bold text-white mb-6">Mastery Hub</h1>

                <div className="space-y-3">
                    {MODES.map((mode) => (
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

                <div className="mt-auto pt-6 border-t border-white/10">
                    <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 p-4 rounded-xl border border-indigo-500/20">
                        <h4 className="text-indigo-300 font-bold text-sm mb-1">Tip of the Day</h4>
                        <p className="text-xs text-indigo-100/80 leading-relaxed">
                            "Pause before answering tough questions. It signals confidence, not confusion."
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
                        Session: {MODES.find(m => m.id === activeMode)?.label}
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
