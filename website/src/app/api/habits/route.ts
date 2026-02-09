import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/habits
export async function GET() {
    try {
        const user = await prisma.user.findFirst();
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const habits = await prisma.habit.findMany({
            where: { userId: user.id },
        });

        return NextResponse.json(habits);
    } catch (error) {
        console.error('Error fetching habits:', error);
        return NextResponse.json({ error: 'Failed to fetch habits' }, { status: 500 });
    }
}

// POST /api/habits - Create or update habits
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { habits } = body; // Array of habit configs

        const user = await prisma.user.findFirst();
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Upsert all habits
        const promises = habits.map((habit: any) =>
            prisma.habit.upsert({
                where: {
                    userId_habitId: {
                        userId: user.id,
                        habitId: habit.id,
                    },
                },
                update: {
                    label: habit.label,
                    category: habit.category,
                    requiredInMinimalMode: habit.requiredInMinimalMode,
                },
                create: {
                    userId: user.id,
                    habitId: habit.id,
                    label: habit.label,
                    category: habit.category,
                    requiredInMinimalMode: habit.requiredInMinimalMode,
                },
            })
        );

        const result = await Promise.all(promises);
        return NextResponse.json(result);
    } catch (error) {
        console.error('Error saving habits:', error);
        return NextResponse.json({ error: 'Failed to save habits' }, { status: 500 });
    }
}

// DELETE /api/habits - Delete a habit
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const habitId = searchParams.get('id');

        if (!habitId) {
            return NextResponse.json({ error: 'Habit ID required' }, { status: 400 });
        }

        const user = await prisma.user.findFirst();
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        await prisma.habit.delete({
            where: {
                userId_habitId: {
                    userId: user.id,
                    habitId: habitId,
                },
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting habit:', error);
        return NextResponse.json({ error: 'Failed to delete habit' }, { status: 500 });
    }
}
