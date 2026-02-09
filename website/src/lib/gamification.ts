import { AppState, DailyLog, ProblemItem } from '@/types';

export const XP_VALUES = {
    HABIT_COMPLETE: 15,
    FOCUS_ITEM: 25,
    PRACTICE_ENTRY: 20,
    PROBLEM_SOLVED: 50,
    SYSTEM_DESIGN_TOPIC: 40,
    DETOX_SUCCESS: 30,
};

export interface LevelInfo {
    level: number;
    currentXP: number;
    nextLevelXP: number;
    progress: number; // 0-100
    title: string;
}

const TITLES = [
    "Script Kiddie",        // Lvl 1
    "Hello World",          // Lvl 2
    "Junior dev",           // Lvl 3
    "Git Pusher",           // Lvl 4
    "Bug Hunter",           // Lvl 5
    "Refactor Ranger",      // Lvl 6
    "Clean Coder",          // Lvl 7
    "System Architect",     // Lvl 8
    "Tech Lead",            // Lvl 9
    "Distinguished Engineer", // Lvl 10+
];

export function calculateStats(state: AppState): { xp: number; levelInfo: LevelInfo } {
    let xp = 0;

    // 1. Daily Logs (Habits, Focus, Detox)
    Object.values(state.dailyLogs).forEach(log => {
        // Habits
        if (log.habitsCompleted) {
            xp += log.habitsCompleted.length * XP_VALUES.HABIT_COMPLETE;
        }
        // Focus Items (Assume filled items count, logic is loose here as we don't have "checked" state for focus, just existence)
        // Actually, focus items don't have a "done" state in the current model, just text.
        // Let's assume if they persist, they are valuable. But better to reward Habits mainly.
        // We'll skip Focus Items XP for now unless we add a "done" toggle.

        // Detox
        if (log.detoxLog) {
            log.detoxLog.forEach(entry => {
                if (entry.outcome === 'Success') xp += XP_VALUES.DETOX_SUCCESS;
            });
        }
    });

    // 2. Learning
    // System Design
    state.learning.systemDesign.forEach(item => {
        if (item.status === 'internalized') xp += XP_VALUES.SYSTEM_DESIGN_TOPIC;
        else if (item.status === 'in_progress') xp += 10;
    });

    // Problems
    state.learning.problems.forEach(problem => {
        if (problem.solved) xp += XP_VALUES.PROBLEM_SOLVED;
    });

    // 3. Communication
    xp += state.communication.practiceLog.length * XP_VALUES.PRACTICE_ENTRY;

    // Calculate Level
    // Curve: 0 -> 100 -> 300 -> 600 -> 1000 ... (Quadratic or generic)
    // Let's use simple constant growth for MVP: Level * 500

    // Better formula: 
    // XP = 100 * (Level ^ 2) / 2 maybe? 
    // Let's use linear steps + slight curve. 
    // Lvl 1: 0-200
    // Lvl 2: 200-500
    // Lvl 3: 500-900

    // Simple: Level = Floor(Sqrt(XP / 50)) + 1
    // If XP = 0, Lvl = 1
    // XP = 50, Sqrt(1)=1 -> Lvl 2. Too fast.
    // XP = 500, Sqrt(10)=3.1 -> Lvl 4.
    // XP = 5000, Sqrt(100)=10 -> Lvl 11.

    // Let's go with: Level = Math.floor(Math.sqrt(xp / 100)) + 1;
    const level = Math.floor(Math.sqrt(xp / 100)) + 1;

    // Calculate Progress to Next Level
    // XP for current level start: (level-1)^2 * 100
    // XP for next level start: level^2 * 100
    const currentLevelStartXp = Math.pow(level - 1, 2) * 100;
    const nextLevelStartXp = Math.pow(level, 2) * 100;

    const xpInLevel = xp - currentLevelStartXp;
    const xpNeeded = nextLevelStartXp - currentLevelStartXp;

    const progress = Math.min(100, Math.max(0, (xpInLevel / xpNeeded) * 100));

    const titleIndex = Math.min(level - 1, TITLES.length - 1);

    return {
        xp,
        levelInfo: {
            level,
            currentXP: xp,
            nextLevelXP: nextLevelStartXp,
            progress,
            title: TITLES[titleIndex]
        }
    };
}
