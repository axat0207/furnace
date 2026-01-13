'use server'

import { encrypt } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
    const username = (formData.get('username') as string)?.trim().toLowerCase();

    if (!username) {
        throw new Error('Username required');
    }

    // Find User - LOGIN ONLY
    const user = await prisma.user.findUnique({
        where: { username },
    });

    if (!user) {
        throw new Error('User does not exist. Please create an account first.');
    }

    // Create Session
    const expires = new Date(Date.now() + 31536000 * 1000); // 1 year
    const session = await encrypt({ user: { id: user.id, username: user.username }, expires });

    (await cookies()).set('session', session, { expires, httpOnly: true });

    redirect('/');
}

export async function signup(formData: FormData) {
    const username = (formData.get('username') as string)?.trim().toLowerCase();

    if (!username) {
        throw new Error('Username required');
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({
        where: { username },
    });

    if (existing) {
        throw new Error('Username already taken');
    }

    // Create User
    const user = await prisma.user.create({
        data: {
            username,
            name: username,
            settings: {
                create: {
                    minimalMode: false,
                    theme: 'dark'
                }
            }
        },
    });

    // Seed default categories
    const defaults = [
        { name: 'Travel', type: 'EXPENSE', icon: 'plane' },
        { name: 'Food', type: 'EXPENSE', icon: 'utensils' },
        { name: 'Rent', type: 'EXPENSE', icon: 'home' },
        { name: 'Shopping', type: 'EXPENSE', icon: 'shopping-bag' },
        { name: 'Salary', type: 'INCOME', icon: 'dollar-sign' },
        { name: 'Entertainment', type: 'EXPENSE', icon: 'film' },
        { name: 'Health', type: 'EXPENSE', icon: 'heart' },
    ];

    await prisma.category.createMany({
        data: defaults.map(d => ({ ...d, userId: user.id, isDefault: true }))
    });

    console.log(`[AUTH] New user created: ${username} (${user.id})`);

    // Log in after signup
    const expires = new Date(Date.now() + 31536000 * 1000); // 1 year
    const session = await encrypt({ user: { id: user.id, username: user.username }, expires });

    (await cookies()).set('session', session, { expires, httpOnly: true });

    redirect('/');
}

export async function logout() {
    (await cookies()).delete('session');
    redirect('/login');
}
