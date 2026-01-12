import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/learning
export async function GET() {
    try {
        const user = await prisma.user.findFirst();
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const items = await prisma.learningItem.findMany({
            where: { userId: user.id },
        });

        return NextResponse.json(items);
    } catch (error) {
        console.error('Error fetching learning items:', error);
        return NextResponse.json({ error: 'Failed to fetch learning items' }, { status: 500 });
    }
}

// POST /api/learning
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { topic, status, explanation, realWorldMapping } = body;

        const user = await prisma.user.findFirst();
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const item = await prisma.learningItem.create({
            data: {
                userId: user.id,
                topic,
                status,
                explanation,
                realWorldMapping,
            },
        });

        return NextResponse.json(item);
    } catch (error) {
        console.error('Error creating learning item:', error);
        return NextResponse.json({ error: 'Failed to create learning item' }, { status: 500 });
    }
}

// PUT /api/learning/:id
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, topic, status, explanation, realWorldMapping } = body;

        const item = await prisma.learningItem.update({
            where: { id },
            data: {
                topic,
                status,
                explanation,
                realWorldMapping,
            },
        });

        return NextResponse.json(item);
    } catch (error) {
        console.error('Error updating learning item:', error);
        return NextResponse.json({ error: 'Failed to update learning item' }, { status: 500 });
    }
}
