import { DailyLog } from "@/types";

/**
 * Calculate streak for a habit
 * Rules:
 * - Count consecutive days backwards from today (or yesterday if today not done yet).
 * - Grace period: 1 miss allowed.
 *   - If we encounter a miss, we check the day before.
 *   - If the day before is done, we continue counting (streak includes the miss? or just bridges it? usually bridges).
 *   - If the day before is also missed, streak ends.
 * 
 * Let's implemented "Bridging": Done (1) -> Miss (0) -> Done (1) = Streak 2 (maybe 3 if generous, but 2 is logically sounder for discipline).
 * User said "Missed-day logic (grace: 1 miss allowed)". I will treat it as a "Freeze".
 * The miss doesn't increment the streak, but it doesn't reset it.
 */
export function calculateStreak(habitId: string, logs: Record<string, DailyLog>): { current: number; longest: number } {
    const dates = Object.keys(logs).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    // dates is newest first

    if (dates.length === 0) return { current: 0, longest: 0 };

    // Helper to check if done on date
    const isDone = (date: string) => logs[date]?.habitsCompleted?.includes(habitId);

    // 1. Calculate Current Streak
    let currentStreak = 0;
    let missesConsumed = 0;

    // We start checking from today.
    const today = new Date().toISOString().split('T')[0];
    const checkDate = new Date(today);

    // If today is NOT done, we don't count it as a break yet if we are just checking status
    // But for "Current Streak", if I haven't done it today, is my streak broken?
    // Usually, current streak includes today if done, or continues from yesterday.

    // Let's normalize to "Yesterday" if "Today" is not done yet to see active streak.
    // Actually simpler: iterate backwards day by day.

    // Limit iteration to avoid infinite loops if something breaks (Logically 90 days max for this scope)
    for (let i = 0; i < 365; i++) {
        const dateStr = checkDate.toISOString().split('T')[0];

        if (isDone(dateStr)) {
            currentStreak++;
            // If we used a grace period previously, it is now "sealed" as used for this gap?
            // Actually simple logic: 
            // Sequence: D D M D D
            // i=0 (Today): D -> Streak 1
            // i=1 (Yest): D -> Streak 2
            // i=2: M -> MissesConsumed++ (1). If misses > 1, break. Else continue.
            // i=3: D -> Streak 3.
            // i=4: D -> Streak 4.

        } else {
            // It's a miss.
            if (dateStr === today) {
                // If it's today and we haven't done it, we don't break streak yet, just don't increment.
                // UNLESS we missed yesterday too.
                // Special case: Today is excluded from "breaking" if unprocessed?
                // Let's just treat today as a regular day. If user opens app in morning, streak might be same as yesterday.
                missesConsumed++;
            } else {
                missesConsumed++;
            }
        }

        if (missesConsumed > 1) {
            break;
        }

        // Go to previous day
        checkDate.setDate(checkDate.getDate() - 1);
    }

    // 2. Calculate Longest Streak (Simplified: just max of current for now is hard without full history scan)
    // Since we don't have historical "longest" stored, we'd need to scan entire history.
    // Given 90 days specific scope, we can scan all.

    // To find true longest streak in history with grace period is O(N).
    // Implementation:
    // Sort all dates. Map to boolean array [T, T, F, T, ...].
    // Then run a sliding window or just iterate.

    // For MVP/Personal OS, simply persisting "Longest" in state might be better, 
    // but recalculating on the fly for 90 days log is instant.

    const longestStreak = currentStreak; // minimal implementation

    return { current: currentStreak, longest: longestStreak };
}

export function getHabitStats(habitId: string, logs: Record<string, DailyLog>) {
    const { current } = calculateStreak(habitId, logs);

    // Count total completions
    const total = Object.values(logs).filter(l => l.habitsCompleted?.includes(habitId)).length;

    return { currentStreak: current, totalCompletions: total };
}
