'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PracticeEntry } from '@/types';
import { Mic, PenTool, Book, Heart, Briefcase, Coffee } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid'; // I will need a simple uuid generator or random string

// Simple ID generator since I don't have uuid package installed yet and don't want to break flow
const generateId = () => Math.random().toString(36).substr(2, 9);

export default function CommunicationPage() {
    const { state, setState } = useApp();
    const [activeTab, setActiveTab] = useState<'practice' | 'office' | 'social' | 'relationship'>('practice');
    const [practiceText, setPracticeText] = useState('');
    const [practiceType, setPracticeType] = useState<'written' | 'verbal'>('written');

    const handleLogPractice = async () => {
        if (!practiceText.trim() && practiceType === 'written') return;

        try {
            const response = await fetch('/api/practice', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: practiceType,
                    content: practiceText,
                }),
            });

            const newEntry = await response.json();

            setState(prev => ({
                ...prev,
                communication: {
                    ...prev.communication,
                    practiceLog: [newEntry, ...prev.communication.practiceLog]
                }
            }));

            setPracticeText('');
        } catch (error) {
            console.error('Error logging practice:', error);
        }
    };

    return (
        <div className="fade-in">
            <header className="mb-8">
                <h1 className="h1">Communication Playbook</h1>
                <p className="text-[var(--text-secondary)]">Mastery comes from deliberate practice.</p>
            </header>

            <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
                {[
                    { id: 'practice', label: 'Daily Practice', icon: PenTool },
                    { id: 'office', label: 'Office Patterns', icon: Briefcase },
                    { id: 'social', label: 'Casual / Social', icon: Coffee },
                    { id: 'relationship', label: 'Relationship', icon: Heart },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all whitespace-nowrap ${activeTab === tab.id
                            ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] border-transparent'
                            : 'bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--text-primary)]'
                            }`}
                    >
                        <tab.icon size={16} />
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            {activeTab === 'practice' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="card">
                        <h2 className="h2 mb-4">Micro-Practice</h2>
                        <div className="flex gap-4 mb-4">
                            <button
                                onClick={() => setPracticeType('written')}
                                className={`flex-1 p-3 rounded border text-center ${practiceType === 'written'
                                    ? 'bg-[var(--bg-tertiary)] border-[var(--text-secondary)]'
                                    : 'border-[var(--border)] text-[var(--text-muted)]'
                                    }`}
                            >
                                <PenTool className="mx-auto mb-2" size={20} />
                                <span className="text-sm">Written (150w)</span>
                            </button>
                            <button
                                onClick={() => setPracticeType('verbal')}
                                className={`flex-1 p-3 rounded border text-center ${practiceType === 'verbal'
                                    ? 'bg-[var(--bg-tertiary)] border-[var(--text-secondary)]'
                                    : 'border-[var(--border)] text-[var(--text-muted)]'
                                    }`}
                            >
                                <Mic className="mx-auto mb-2" size={20} />
                                <span className="text-sm">Verbal (3 min)</span>
                            </button>
                        </div>

                        {practiceType === 'written' ? (
                            <textarea
                                className="input h-40 resize-none mb-4"
                                placeholder="Explain a complex topic simply..."
                                value={practiceText}
                                onChange={e => setPracticeText(e.target.value)}
                            />
                        ) : (
                            <div className="p-6 bg-[var(--bg-primary)] border border-[var(--border)] rounded mb-4 text-center">
                                <p className="text-[var(--text-secondary)] mb-2">Record separate audio or practice in front of a mirror.</p>
                                <p className="text-xs text-[var(--text-muted)]">Log here when complete.</p>
                            </div>
                        )}

                        <button onClick={handleLogPractice} className="btn btn-primary w-full">
                            Log Practice
                        </button>
                    </div>

                    <div className="card max-h-[500px] overflow-y-auto">
                        <h2 className="h2 mb-4">History</h2>
                        <div className="flex flex-col gap-3">
                            {state.communication.practiceLog.length === 0 && (
                                <p className="text-[var(--text-muted)] text-sm">No practice logged yet.</p>
                            )}
                            {state.communication.practiceLog.map(entry => (
                                <div key={entry.id} className="p-3 bg-[var(--bg-primary)] rounded border border-[var(--border)]">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs text-[var(--text-muted)]">
                                            {new Date(entry.date).toLocaleDateString()}
                                        </span>
                                        <span className="text-xs font-medium uppercase px-2 py-0.5 rounded bg-[var(--bg-tertiary)]">
                                            {entry.type}
                                        </span>
                                    </div>
                                    {entry.content && (
                                        <p className="text-sm text-[var(--text-secondary)] line-clamp-3">
                                            {entry.content}
                                        </p>
                                    )}
                                    {!entry.content && (
                                        <p className="text-sm text-[var(--text-secondary)] italic">
                                            Verbal practice completed.
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab !== 'practice' && (
                <div className="card">
                    <h2 className="h2 capitalize mb-2">{activeTab} Scripts & Notes</h2>
                    <p className="text-[var(--text-muted)] mb-6">Manage your mental models for this context.</p>

                    {/* Placeholder for Note Management - MVP just shows empty state or static for now */}
                    <div className="p-8 text-center border border-dashed border-[var(--border)] rounded">
                        <Book className="mx-auto text-[var(--text-muted)] mb-3" />
                        <p className="text-[var(--text-secondary)]">No notes added for {activeTab} yet.</p>
                        <button className="btn mt-4">Add New Note</button>
                    </div>
                </div>
            )}
        </div>
    );
}
