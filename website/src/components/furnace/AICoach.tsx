'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Bot, User } from 'lucide-react';
import { chatWithGemini } from '@/app/ai-actions';
import { cn } from '@/lib/utils';

export function AICoach() {
    const [isOpen, setIsOpen] = useState(false);
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

    const handleSend = async () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { role: 'user' as const, parts: input }];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        const response = await chatWithGemini(newMessages);

        setMessages([...newMessages, { role: 'model', parts: response }]);
        setIsLoading(false);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 left-6 p-4 rounded-full bg-furnace-gray border border-furnace-primary/50 text-furnace-primary hover:bg-furnace-primary hover:text-white transition-all shadow-[0_0_20px_rgba(255,85,0,0.2)] z-50 group"
            >
                <Bot size={24} className="group-hover:animate-bounce" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-24 left-6 w-96 h-[600px] max-h-[80vh] bg-furnace-gray/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-50"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/40">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-furnace-primary/20 rounded-lg">
                                    <Bot size={20} className="text-furnace-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm">Furnace Coach</h3>
                                    <p className="text-xs text-zinc-400">Online • Ready to train</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-zinc-500 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.length === 0 && (
                                <div className="text-center text-zinc-500 mt-20 text-sm">
                                    <p>Ask me to roleplay a conversation,</p>
                                    <p>critique your English,</p>
                                    <p>or keep you disciplined.</p>
                                </div>
                            )}

                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={cn(
                                        "flex gap-3 max-w-[85%]",
                                        msg.role === 'user' ? "ml-auto" : ""
                                    )}
                                >
                                    {msg.role === 'model' && (
                                        <div className="w-8 h-8 rounded-full bg-furnace-primary/10 flex items-center justify-center shrink-0 border border-furnace-primary/20">
                                            <Bot size={14} className="text-furnace-primary" />
                                        </div>
                                    )}

                                    <div className={cn(
                                        "p-3 rounded-2xl text-sm leading-relaxed",
                                        msg.role === 'user'
                                            ? "bg-furnace-primary text-white rounded-br-none"
                                            : "bg-white/5 text-zinc-200 border border-white/5 rounded-bl-none"
                                    )}>
                                        {msg.parts}
                                    </div>

                                    {msg.role === 'user' && (
                                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                            <User size={14} className="text-white" />
                                        </div>
                                    )}
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-furnace-primary/10 flex items-center justify-center shrink-0 border border-furnace-primary/20">
                                        <Bot size={14} className="text-furnace-primary" />
                                    </div>
                                    <div className="bg-white/5 p-3 rounded-2xl rounded-bl-none border border-white/5 flex gap-1 items-center">
                                        <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                                        <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                        <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-black/40 border-t border-white/10">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-furnace-primary/50 placeholder:text-zinc-600"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={isLoading || !input.trim()}
                                    className="bg-furnace-primary text-white p-2 rounded-xl hover:bg-furnace-primary/90 disabled:opacity-50 transition-colors"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
