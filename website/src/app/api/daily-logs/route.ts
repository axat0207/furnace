import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/daily-logs?date=YYYY-MM-DD
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const date = searchParams.get('date');

        const user = await prisma.user.findFirst();
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (date) {
            const log = await prisma.dailyLog.findUnique({
                where: {
                    userId_date: {
                        userId: user.id,
                        date,
                    },
                },
            });
            return NextResponse.json(log || null);
        }

        // Get all logs for the user
        const logs = await prisma.dailyLog.findMany({
            where: { userId: user.id },
            orderBy: { date: 'desc' },
        });

        return NextResponse.json(logs);
    } catch (error) {
        console.error('Error fetching daily logs:', error);
        return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
    }
}

// POST /api/daily-logs - Create or update daily log
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { date, focusItems, habitsCompleted, mood, notes, detoxLog } = body;

        const user = await prisma.user.findFirst();
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const log = await prisma.dailyLog.upsert({
            where: {
                userId_date: {
                    userId: user.id,
                    date,
                },
            },
            update: {
                focusItems,
                habitsCompleted,
                mood,
                notes,
                detoxLog,
            },
            create: {
                userId: user.id,
                date,
                focusItems: focusItems || [],
                habitsCompleted: habitsCompleted || [],
                mood,
                notes,
                detoxLog,
            },
        });

        return NextResponse.json(log);
    } catch (error) {
        console.error('Error saving daily log:', error);
        return NextResponse.json({ error: 'Failed to save log' }, { status: 500 });
    }
}
