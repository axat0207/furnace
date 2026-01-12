'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { LearningItem, ProblemItem } from '@/types';
import { BookOpen, Code, Plus, CheckCircle, Circle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const generateId = () => Math.random().toString(36).substr(2, 9);

const SYSTEM_DESIGN_TOPICS = [
    'Load Balancing', 'Caching & CDNs', 'Database Sharding',
    'Replication', 'CAP Theorem', 'API Gateways',
    'Distributed Queues', 'Consistent Hashing'
];

export default function LearningPage() {
    const { state, setState } = useApp();
    const [activeTab, setActiveTab] = useState<'system' | 'problems'>('system');

    // Problem Form State
    const [newProblem, setNewProblem] = useState<Partial<ProblemItem>>({
        name: '', type: 'dsa', difficulty: 'medium'
    });

    const handleAddProblem = async () => {
        if (!newProblem.name) return;

        try {
            const response = await fetch('/api/problems', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newProblem.name,
                    type: newProblem.type,
                    difficulty: newProblem.difficulty,
                    solved: false,
                    explanation: '',
                }),
            });

            const item = await response.json();

            setState(prev => ({
                ...prev,
                learning: {
                    ...prev.learning,
                    problems: [item, ...prev.learning.problems]
                }
            }));
            setNewProblem({ name: '', type: 'dsa', difficulty: 'medium' });
        } catch (error) {
            console.error('Error adding problem:', error);
        }
    };

    const updateProblem = async (id: string, updates: Partial<ProblemItem>) => {
        try {
            await fetch('/api/problems', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, ...updates }),
            });

            setState(prev => ({
                ...prev,
                learning: {
                    ...prev.learning,
                    problems: prev.learning.problems.map(p =>
                        p.id === id ? { ...p, ...updates } : p
                    )
                }
            }));
        } catch (error) {
            console.error('Error updating problem:', error);
        }
    };

    // Helper for System Design Logic (using local state if not persistent enough, but mapped to AppState)
    // Initially AppState.learning.systemDesign is empty. We should probably populate it or just track overrides?
    // For simplicity, let's treat the AppState as the source of truth for STATUS.

    const getTopicStatus = (topic: string) => {
        const item = state.learning.systemDesign.find(i => i.topic === topic);
        return item ? item.status : 'not_started';
    };

    const updateTopicStatus = async (topic: string, status: LearningItem['status']) => {
        try {
            const existing = state.learning.systemDesign.find(i => i.topic === topic);

            if (existing) {
                await fetch('/api/learning', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: existing.id, topic, status }),
                });

                setState(prev => ({
                    ...prev,
                    learning: {
                        ...prev.learning,
                        systemDesign: prev.learning.systemDesign.map(i =>
                            i.topic === topic ? { ...i, status } : i
                        )
                    }
                }));
            } else {
                const response = await fetch('/api/learning', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ topic, status }),
                });

                const newItem = await response.json();

                setState(prev => ({
                    ...prev,
                    learning: {
                        ...prev.learning,
                        systemDesign: [...prev.learning.systemDesign, newItem]
                    }
                }));
            }
        } catch (error) {
            console.error('Error updating topic status:', error);
        }
    };

    return (
        <div className="fade-in">
            <header className="mb-8">
                <h1 className="h1">Engineering Competence</h1>
                <p className="text-[var(--text-secondary)]">Deep understanding, not just surface knowledge.</p>
            </header>

            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => setActiveTab('system')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${activeTab === 'system'
                        ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] border-transparent'
                        : 'bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-secondary)]'
                        }`}
                >
                    <BookOpen size={18} /> <span>System Design</span>
                </button>
                <button
                    onClick={() => setActiveTab('problems')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${activeTab === 'problems'
                        ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] border-transparent'
                        : 'bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-secondary)]'
                        }`}
                >
                    <Code size={18} /> <span>Problem Solving</span>
                </button>
            </div>

            {activeTab === 'system' && (
                <div className="grid grid-cols-1 gap-4">
                    {SYSTEM_DESIGN_TOPICS.map(topic => {
                        const status = getTopicStatus(topic);
                        return (
                            <div key={topic} className="card flex items-center justify-between p-4">
                                <span className="font-medium">{topic}</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => updateTopicStatus(topic, 'not_started')}
                                        className={`px-3 py-1 rounded text-xs border ${status === 'not_started' ? 'bg-[var(--bg-tertiary)] border-[var(--text-secondary)]' : 'border-transparent text-[var(--text-muted)]'}`}
                                    >
                                        TODO
                                    </button>
                                    <button
                                        onClick={() => updateTopicStatus(topic, 'in_progress')}
                                        className={`px-3 py-1 rounded text-xs border ${status === 'in_progress' ? 'bg-blue-900 border-blue-500 text-blue-200' : 'border-transparent text-[var(--text-muted)]'}`}
                                    >
                                        Doing
                                    </button>
                                    <button
                                        onClick={() => updateTopicStatus(topic, 'internalized')}
                                        className={`px-3 py-1 rounded text-xs border ${status === 'internalized' ? 'bg-[var(--success)] text-black border-transparent' : 'border-transparent text-[var(--text-muted)]'}`}
                                    >
                                        Done
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {activeTab === 'problems' && (
                <div className="grid grid-cols-1 gap-6">
                    {/* Add New */}
                    <div className="card border-[var(--text-muted)] border-dashed">
                        <h3 className="h3 text-sm font-medium mb-3">Log New Problem</h3>
                        <div className="flex flex-col md:flex-row gap-2">
                            <input
                                className="input"
                                placeholder="Problem Name (e.g., LeetCode 102)"
                                value={newProblem.name}
                                onChange={e => setNewProblem({ ...newProblem, name: e.target.value })}
                            />
                            <select
                                className="input md:w-32"
                                value={newProblem.difficulty}
                                onChange={e => setNewProblem({ ...newProblem, difficulty: e.target.value as any })}
                            >
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                            <button onClick={handleAddProblem} className="btn btn-primary whitespace-nowrap">
                                <Plus size={16} className="inline mr-1" /> Add
                            </button>
                        </div>
                    </div>

                    {/* List */}
                    <div className="flex flex-col gap-3">
                        {state.learning.problems.map(problem => (
                            <div key={problem.id} className="card">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${problem.solved ? 'bg-[var(--success)]' : 'bg-[var(--warning)]'}`} />
                                        <span className="font-medium">{problem.name}</span>
                                        <span className="ml-2 text-xs px-2 py-0.5 rounded bg-[var(--bg-primary)] border border-[var(--border)] uppercase">{problem.difficulty}</span>
                                    </div>
                                    <button
                                        onClick={() => updateProblem(problem.id, { solved: !problem.solved })}
                                        className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                    >
                                        {problem.solved ? <CheckCircle className="text-[var(--success)]" /> : <Circle />}
                                    </button>
                                </div>

                                {/* Explanation Field - Mandatory logic visualization */}
                                <div className="mt-3">
                                    <p className="text-xs text-[var(--text-muted)] mb-1">EL5 Explanation {problem.solved && !problem.explanation && <span className="text-[var(--danger)]">(Required)</span>}</p>
                                    <textarea
                                        className="input text-sm bg-[var(--bg-primary)]"
                                        rows={2}
                                        placeholder="Explain the solution logic simply..."
                                        value={problem.explanation || ''}
                                        onChange={e => updateProblem(problem.id, { explanation: e.target.value })}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
