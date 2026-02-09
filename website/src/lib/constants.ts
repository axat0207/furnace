import { AppState, HabitConfig } from '@/types';

export const DEFAULT_HABITS: HabitConfig[] = [
    { id: 'gym', label: 'Gym', category: 'physical', requiredInMinimalMode: true },
    { id: 'cold_shower', label: 'Cold Shower', category: 'physical', requiredInMinimalMode: false },
    { id: 'skincare', label: 'Skincare', category: 'physical', requiredInMinimalMode: false },
    { id: 'problem_solving', label: 'Problem Solving', category: 'mental', requiredInMinimalMode: true }, // Mapped to Deep Work
    { id: 'system_design', label: 'System Design', category: 'mental', requiredInMinimalMode: false },
    { id: 'comm_practice', label: 'Communication Practice', category: 'mental', requiredInMinimalMode: false },
    { id: 'fog_habit', label: 'Fog Habit Clean', category: 'detox', requiredInMinimalMode: true },
    { id: 'impulse_loop', label: 'Impulse Loop Clean', category: 'detox', requiredInMinimalMode: false }, // User said Clean Day in minimal mode, assuming Fog + Impulse? 
    // Correction: User said "Clean Day" in Minimal Mode. Usually implies avoiding the "bad" things.
    // Re-reading requirements: Minimal Mode tracking: Gym, Deep Work, Clean Day.
    // Clean Day usually aggregates Fog + Impulse. I'll clarify logic later.
    { id: 'sleep', label: 'Sleep >= 7hrs', category: 'physical', requiredInMinimalMode: false },
];

export const INITIAL_STATE: AppState = {
    userProfile: {
        name: 'Developer',
        startDate: new Date().toISOString(),
    },
    settings: {
        minimalMode: false,
        theme: 'dark',
    },
    dailyLogs: {},
    habits: DEFAULT_HABITS,
    learning: {
        systemDesign: [],
        problems: [],
    },
    communication: {
        notes: [],
        practiceLog: [],
    },
};
