import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/user - Get or create user
export async function GET(request: NextRequest) {
    try {
        // For now, we'll use a single user. In production, you'd use auth.
        let user = await prisma.user.findFirst();

        if (!user) {
            // Create default user
            user = await prisma.user.create({
                data: {
                    username: 'developer', // Default username
                    name: 'Developer',
                    settings: {
                        create: {
                            minimalMode: false,
                            theme: 'dark',
                        },
                    },
                },
                include: {
                    settings: true,
                },
            });
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
        const body = await request.json();
        const { minimalMode, theme } = body;

        const user = await prisma.user.findFirst();
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
