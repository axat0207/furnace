'use server'

import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getSharedExpenses() {
    const user = await getUser();
    if (!user) return [];

    // Get expenses where user either paid or is a participant
    const expenses = await prisma.sharedExpense.findMany({
        where: {
            OR: [
                { paidByUserId: user.id },
                { splits: { some: { userId: user.id } } }
            ]
        },
        include: {
            paidBy: { select: { id: true, username: true, name: true } },
            splits: {
                include: {
                    user: { select: { id: true, username: true, name: true } }
                }
            }
        },
        orderBy: { date: 'desc' }
    });

    return expenses;
}

export async function addSharedExpense(formData: FormData) {
    const user = await getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    try {
        const description = formData.get('description') as string;
        const totalAmount = parseFloat(formData.get('totalAmount') as string);
        const category = formData.get('category') as string;
        const participantUsernames = (formData.get('participants') as string)
            .split(',')
            .map(p => p.trim().toLowerCase())
            .filter(Boolean);

        if (!description) return { success: false, error: "Description is required" };
        if (isNaN(totalAmount) || totalAmount <= 0) return { success: false, error: "Valid amount is required" };
        if (participantUsernames.length === 0) return { success: false, error: "Select at least one participant" };

        const currentUsername = user.username?.toLowerCase();
        if (currentUsername && !participantUsernames.includes(currentUsername)) {
            participantUsernames.push(currentUsername);
        }

        const participants = await prisma.user.findMany({
            where: {
                username: {
                    in: participantUsernames,
                    mode: 'insensitive'
                }
            }
        });

        if (participants.length === 0) return { success: false, error: "No valid users found" };

        const shareAmount = totalAmount / participants.length;

        await prisma.sharedExpense.create({
            data: {
                description,
                totalAmount,
                category: category || null,
                paidByUserId: user.id,
                splits: {
                    create: participants.map(p => ({
                        userId: p.id,
                        shareAmount,
                        isPaid: p.id === user.id
                    }))
                }
            }
        });

        revalidatePath('/money/splits');
        return { success: true };
    } catch (error: any) {
        console.error("[SPLIT_ADD_ERROR]", error);
        return { success: false, error: "Failed to create expense" };
    }
}

export async function markSplitAsPaid(expenseId: string, splitUserId: string) {
    const user = await getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    try {
        const expense = await prisma.sharedExpense.findUnique({
            where: { id: expenseId }
        });

        if (!expense || expense.paidByUserId !== user.id) {
            return { success: false, error: "Only the payer can mark splits as paid" };
        }

        await prisma.expenseSplit.updateMany({
            where: { expenseId, userId: splitUserId },
            data: { isPaid: true }
        });

        const allSplits = await prisma.expenseSplit.findMany({
            where: { expenseId }
        });

        if (allSplits.every(s => s.isPaid)) {
            await prisma.sharedExpense.update({
                where: { id: expenseId },
                data: { isSettled: true }
            });
        }

        revalidatePath('/money/splits');
        return { success: true };
    } catch (error) {
        return { success: false, error: "Update failed" };
    }
}

export async function getBalances() {
    const user = await getUser();
    if (!user) return { owedToYou: [], youOwe: [] };

    try {
        const expensesYouPaid = await prisma.sharedExpense.findMany({
            where: { paidByUserId: user.id, isSettled: false },
            include: {
                splits: {
                    where: { isPaid: false, userId: { not: user.id } },
                    include: { user: { select: { id: true, username: true, name: true } } }
                }
            }
        });

        const owedToYou = expensesYouPaid.flatMap(exp =>
            exp.splits.map(split => ({
                user: split.user,
                amount: split.shareAmount,
                expenseDescription: exp.description,
                expenseId: exp.id,
                splitId: split.id
            }))
        );

        const expensesYouOwe = await prisma.expenseSplit.findMany({
            where: { userId: user.id, isPaid: false },
            include: {
                expense: {
                    include: {
                        paidBy: { select: { id: true, username: true, name: true } }
                    }
                }
            }
        });

        const youOwe = expensesYouOwe.map(split => ({
            user: split.expense.paidBy,
            amount: split.shareAmount,
            expenseDescription: split.expense.description,
            expenseId: split.expense.id,
            splitId: split.id
        }));

        return { owedToYou, youOwe };
    } catch (error) {
        return { owedToYou: [], youOwe: [] };
    }
}

export async function settleUp(expenseId: string) {
    const user = await getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    try {
        await prisma.expenseSplit.updateMany({
            where: { expenseId, userId: user.id },
            data: { isPaid: true }
        });

        const allSplits = await prisma.expenseSplit.findMany({
            where: { expenseId }
        });

        if (allSplits.every(s => s.isPaid)) {
            await prisma.sharedExpense.update({
                where: { id: expenseId },
                data: { isSettled: true }
            });
        }

        revalidatePath('/money/splits');
        return { success: true };
    } catch (error) {
        return { success: false, error: "Settlement failed" };
    }
}

export async function getAllUsers() {
    const user = await getUser();
    if (!user) return [];

    return prisma.user.findMany({
        where: { id: { not: user.id } },
        select: { id: true, username: true },
        orderBy: { username: 'asc' }
    });
}
