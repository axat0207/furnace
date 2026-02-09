import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/problems
export async function GET() {
    try {
        const user = await prisma.user.findFirst();
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const problems = await prisma.problem.findMany({
            where: { userId: user.id },
            orderBy: { id: 'desc' },
        });

        return NextResponse.json(problems);
    } catch (error) {
        console.error('Error fetching problems:', error);
        return NextResponse.json({ error: 'Failed to fetch problems' }, { status: 500 });
    }
}

// POST /api/problems
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, type, difficulty, solved, explanation } = body;

        const user = await prisma.user.findFirst();
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const problem = await prisma.problem.create({
            data: {
                userId: user.id,
                name,
                type,
                difficulty,
                solved: solved || false,
                explanation,
            },
        });

        return NextResponse.json(problem);
    } catch (error) {
        console.error('Error creating problem:', error);
        return NextResponse.json({ error: 'Failed to create problem' }, { status: 500 });
    }
}

// PUT /api/problems
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, name, type, difficulty, solved, explanation } = body;

        const problem = await prisma.problem.update({
            where: { id },
            data: {
                name,
                type,
                difficulty,
                solved,
                explanation,
            },
        });

        return NextResponse.json(problem);
    } catch (error) {
        console.error('Error updating problem:', error);
        return NextResponse.json({ error: 'Failed to update problem' }, { status: 500 });
    }
}
