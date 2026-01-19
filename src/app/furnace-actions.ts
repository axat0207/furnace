'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { startOfDay, format } from 'date-fns';

export async function toggleHabit(habitId: string) {
    // Hardcoded for now, but we will use the actual auth later
    // We need to fetch the current user. Since there's no auth setup in the provided context yet (or at least no getSession),
    // I'll assume we grab the first user or create a strict "demo" user for now to unblock.
    // Ideally, we should use the actual logged-in user.

    // FIX: Fetch the first user for dev purposes if no auth system is fully active
    const user = await prisma.user.findFirst();

    if (!user) {
        throw new Error("No user found");
    }

    const today = format(new Date(), 'yyyy-MM-dd');

    let dailyLog = await prisma.dailyLog.findUnique({
        where: {
            userId_date: {
                userId: user.id,
                date: today,
            },
        },
    });

    if (!dailyLog) {
        dailyLog = await prisma.dailyLog.create({
            data: {
                userId: user.id,
                date: today,
                habitsCompleted: [],
            },
        });
    }

    const habits = dailyLog.habitsCompleted || [];
    const isCompleted = habits.includes(habitId);

    let newHabits = [];
    if (isCompleted) {
        newHabits = habits.filter((id) => id !== habitId);
    } else {
        newHabits = [...habits, habitId];
    }

    await prisma.dailyLog.update({
        where: { id: dailyLog.id },
        data: { habitsCompleted: newHabits },
    });

    revalidatePath('/');
    return newHabits;
}

export async function getTodayHabits() {
    const user = await prisma.user.findFirst();
    if (!user) return [];

    const today = format(new Date(), 'yyyy-MM-dd');
    const dailyLog = await prisma.dailyLog.findUnique({
        where: {
            userId_date: {
                userId: user.id,
                date: today,
            },
        },
    });

    return dailyLog?.habitsCompleted || [];
}

export async function getStreaks() {
    const user = await prisma.user.findFirst();
    if (!user) return {};

    // Fetch last 365 days of logs
    const logs = await prisma.dailyLog.findMany({
        where: {
            userId: user.id,
        },
        orderBy: {
            date: 'desc',
        },
        take: 365,
    });

    const streaks: Record<string, number> = {};

    // We need to define the set of all known habit IDs from our constants (or DB if dynamic)
    // For now we assume dynamic based on what's in logs, or better, strictly checking known habits.
    // Let's iterate over known logs.

    // To make this efficient:
    // 1. Create a Set of "date-habit" strings for easy lookup: "YYYY-MM-DD:habitId"
    const completedSet = new Set<string>();
    logs.forEach(log => {
        log.habitsCompleted.forEach(habitId => {
            completedSet.add(`${log.date}:${habitId}`);
        });
    });

    // 2. For each known habit (we can actually just iterate over the habits present in the latest logs, 
    //    or better, import the constants. But server actions shouldn't depend on client constants if avoidable.
    //    Let's just calculate for ALL habits found in the logs, or pass the list of IDs we care about.)

    // Simplification: We will calculate for all unique habit IDs found in the last 30 days of logs + today's.
    const allHabitIds = new Set<string>();
    logs.forEach(l => l.habitsCompleted.forEach(h => allHabitIds.add(h)));

    Array.from(allHabitIds).forEach(habitId => {
        let streak = 0;
        let currentDate = new Date();

        // Check today
        const todayStr = format(currentDate, 'yyyy-MM-dd');
        if (completedSet.has(`${todayStr}:${habitId}`)) {
            streak++;
        } else {
            // If not done today, checking yesterday to see if streak is still valid to continue
            // If yesterday is missing, streak is 0.
        }

        // Iterate backwards
        while (true) {
            currentDate = new Date(currentDate.setDate(currentDate.getDate() - 1));
            const dateStr = format(currentDate, 'yyyy-MM-dd');
            if (completedSet.has(`${dateStr}:${habitId}`)) {
                streak++;
            } else {
                // If we didn't count today (streak is 0) and yesterday is missing, it stays 0.
                // If we counted today (streak is 1) and yesterday is missing, it stays 1.
                // Break on first miss.
                break;
            }
        }
        streaks[habitId] = streak;
    });

    return streaks;
}
