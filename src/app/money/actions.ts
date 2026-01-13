'use server'

import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getCategories() {
    const user = await getUser();
    if (!user) return [];

    return await prisma.category.findMany({
        where: { userId: user.id },
        orderBy: { isDefault: 'desc' }, // Defaults first, or maybe by name
    });
}

export async function getTransactions(limit = 10) {
    const user = await getUser();
    if (!user) return [];

    return await prisma.transaction.findMany({
        where: { userId: user.id },
        orderBy: { date: 'desc' },
        take: limit,
        include: { category: true }
    });
}

export async function addTransaction(formData: FormData) {
    const user = await getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    try {
        const amount = parseFloat(formData.get('amount') as string);
        const categoryId = formData.get('categoryId') as string;
        const type = formData.get('type') as string;
        const dateStr = formData.get('date') as string;
        const description = formData.get('description') as string;

        if (isNaN(amount) || amount <= 0) return { success: false, error: "Invalid amount" };
        if (!categoryId) return { success: false, error: "Category required" };

        const date = dateStr ? new Date(dateStr) : new Date();

        await prisma.transaction.create({
            data: {
                amount,
                type,
                categoryId,
                date,
                description,
                userId: user.id
            }
        });

        revalidatePath('/money');
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to save transaction" };
    }
}

export async function addCategory(formData: FormData) {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");

    const name = formData.get('name') as string;
    const type = formData.get('type') as string;
    const icon = formData.get('icon') as string;

    if (!name) throw new Error("Name required");

    await prisma.category.create({
        data: {
            name,
            type,
            icon,
            userId: user.id
        }
    });

    revalidatePath('/money');
}
