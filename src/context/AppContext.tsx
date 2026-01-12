'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppState, DailyLog } from '@/types';
import { INITIAL_STATE } from '@/lib/constants';
import { LoadingScreen } from '@/components/ui/LoadingScreen';

interface AppContextType {
    state: AppState;
    updateDailyLog: (date: string, updates: Partial<DailyLog>) => Promise<void>;
    addHabit: (habit: AppState['habits'][0]) => Promise<void>;
    deleteHabit: (habitId: string) => Promise<void>;
    toggleMinimalMode: () => Promise<void>;
    setState: React.Dispatch<React.SetStateAction<AppState>>;
    loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<AppState>(INITIAL_STATE);
    const [loading, setLoading] = useState(true);
    const [isClient, setIsClient] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Load initial data from API
    useEffect(() => {
        if (!isClient) return;

        async function loadData() {
            try {
                // Fetch user and settings
                const userRes = await fetch('/api/user');
                const user = await userRes.json();

                // Fetch habits
                const habitsRes = await fetch('/api/habits');
                let habits = await habitsRes.json();

                // If no habits exist, initialize with defaults
                if (!habits || habits.length === 0) {
                    await fetch('/api/habits', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ habits: INITIAL_STATE.habits }),
                    });
                    habits = INITIAL_STATE.habits;
                }

                // Fetch daily logs
                const logsRes = await fetch('/api/daily-logs');
                const logsArray = await logsRes.json();
                const dailyLogs: Record<string, DailyLog> = {};
                logsArray.forEach((log: any) => {
                    dailyLogs[log.date] = {
                        date: log.date,
                        focusItems: log.focusItems || [],
                        habitsCompleted: log.habitsCompleted || [],
                        mood: log.mood,
                        notes: log.notes,
                        detoxLog: log.detoxLog,
                    };
                });

                // Fetch learning items
                const learningRes = await fetch('/api/learning');
                const systemDesign = await learningRes.json();

                // Fetch problems
                const problemsRes = await fetch('/api/problems');
                const problems = await problemsRes.json();

                // Fetch practice log
                const practiceRes = await fetch('/api/practice');
                const practiceLog = await practiceRes.json();

                setState({
                    userProfile: {
                        name: user.name,
                        startDate: user.startDate,
                    },
                    settings: {
                        minimalMode: user.settings?.minimalMode || false,
                        theme: user.settings?.theme || 'dark',
                    },
                    dailyLogs,
                    habits: habits.map((h: any) => ({
                        id: h.habitId,
                        label: h.label,
                        category: h.category,
                        requiredInMinimalMode: h.requiredInMinimalMode,
                    })),
                    learning: {
                        systemDesign,
                        problems,
                    },
                    communication: {
                        notes: [],
                        practiceLog: practiceLog.map((p: any) => ({
                            id: p.id,
                            date: p.date,
                            type: p.type,
                            content: p.content,
                        })),
                    },
                });
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [isClient]);

    const updateDailyLog = async (date: string, updates: Partial<DailyLog>) => {
        const currentLog = state.dailyLogs[date] || {
            date,
            focusItems: [],
            habitsCompleted: [],
        };

        const updatedLog = { ...currentLog, ...updates };

        // Optimistic update
        setState((prev) => ({
            ...prev,
            dailyLogs: {
                ...prev.dailyLogs,
                [date]: updatedLog,
            },
        }));

        // Persist to API
        try {
            await fetch('/api/daily-logs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedLog),
            });
        } catch (error) {
            console.error('Error saving daily log:', error);
        }
    };

    const addHabit = async (habit: AppState['habits'][0]) => {
        // Optimistic update
        setState((prev) => ({
            ...prev,
            habits: [...prev.habits, habit],
        }));

        try {
            await fetch('/api/habits', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ habits: [habit] }),
            });
        } catch (error) {
            console.error('Error adding habit:', error);
            // Revert on error? For now, we trust.
        }
    };

    const deleteHabit = async (habitId: string) => {
        // Optimistic update
        setState((prev) => ({
            ...prev,
            habits: prev.habits.filter((h) => h.id !== habitId),
        }));

        try {
            await fetch(`/api/habits?id=${habitId}`, {
                method: 'DELETE',
            });
        } catch (error) {
            console.error('Error deleting habit:', error);
        }
    };

    const toggleMinimalMode = async () => {
        const newMode = !state.settings.minimalMode;

        // Optimistic update
        setState((prev) => ({
            ...prev,
            settings: {
                ...prev.settings,
                minimalMode: newMode,
            },
        }));

        // Persist to API
        try {
            await fetch('/api/user', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    minimalMode: newMode,
                    theme: state.settings.theme,
                }),
            });
        } catch (error) {
            console.error('Error updating settings:', error);
        }
    };

    if (!isClient || loading) {
        return <LoadingScreen />;
    }

    return (
        <AppContext.Provider value={{ state, updateDailyLog, addHabit, deleteHabit, toggleMinimalMode, setState, loading }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}
