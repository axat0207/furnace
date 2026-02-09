import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/practice
export async function GET() {
    try {
        const user = await prisma.user.findFirst();
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const entries = await prisma.practiceEntry.findMany({
            where: { userId: user.id },
            orderBy: { date: 'desc' },
        });

        return NextResponse.json(entries);
    } catch (error) {
        console.error('Error fetching practice entries:', error);
        return NextResponse.json({ error: 'Failed to fetch practice entries' }, { status: 500 });
    }
}

// POST /api/practice
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { type, content } = body;

        const user = await prisma.user.findFirst();
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const entry = await prisma.practiceEntry.create({
            data: {
                userId: user.id,
                type,
                content,
            },
        });

        return NextResponse.json(entry);
    } catch (error) {
        console.error('Error creating practice entry:', error);
        return NextResponse.json({ error: 'Failed to create practice entry' }, { status: 500 });
    }
}
