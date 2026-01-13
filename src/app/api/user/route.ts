import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth';

// GET /api/user - Get authenticated user
export async function GET(request: NextRequest) {
    try {
        const sessionUser = await getUser();
        
        if (!sessionUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: sessionUser.id },
            include: {
                settings: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
    }
}

// PUT /api/user - Update user settings
export async function PUT(request: NextRequest) {
    try {
        const sessionUser = await getUser();
        
        if (!sessionUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { minimalMode, theme } = body;

        const user = await prisma.user.findUnique({
            where: { id: sessionUser.id },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const updatedSettings = await prisma.settings.update({
            where: { userId: user.id },
            data: {
                minimalMode,
                theme,
            },
        });

        return NextResponse.json(updatedSettings);
    } catch (error) {
        console.error('Error updating settings:', error);
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
