import { Category, Transaction as PrismaTransaction } from '@prisma/client';

export type TransactionWithCategory = PrismaTransaction & {
    category: Category;
};
