import { getUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AnalyticsChart from '@/components/money/AnalyticsChart'; // We need to build this

// Server Component for Analytics
export default async function AnalyticsPage() {
    const user = await getUser();
    if (!user) redirect('/login');

    // Fetch data for the current month
    const start = startOfMonth(new Date());
    const end = endOfMonth(new Date());

    const transactions = await prisma.transaction.findMany({
        where: {
            userId: user.id,
            date: { gte: start, lte: end }
        },
        include: { category: true },
        orderBy: { date: 'asc' }
    });

    const income = transactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);

    return (
        <div className="min-h-screen bg-black text-white pb-20">
            <header className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-white/10 p-4">
                <div className="max-w-md mx-auto flex items-center gap-4">
                    <Link href="/money" className="p-2 rounded-full hover:bg-zinc-800 transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-xl font-bold">Analytics</h1>
                </div>
            </header>

            <main className="max-w-md mx-auto p-4 space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                        <p className="text-zinc-500 text-xs font-bold uppercase">Income</p>
                        <p className="text-2xl font-bold text-green-500">+${income.toFixed(2)}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                        <p className="text-zinc-500 text-xs font-bold uppercase">Expenses</p>
                        <p className="text-2xl font-bold text-red-500">-${expense.toFixed(2)}</p>
                    </div>
                </div>

                {/* Charts */}
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 min-h-[300px]">
                    <h2 className="text-zinc-400 text-sm font-bold mb-4">Daily Activity</h2>
                    <AnalyticsChart transactions={transactions} />
                </div>

                {/* Category Breakdown (Simple List for now) */}
                <div className="space-y-3">
                    <h2 className="text-zinc-400 text-sm font-bold uppercase tracking-wider">Top Categories</h2>
                    {/* Placeholder for category breakdown */}
                    <p className="text-zinc-600 text-sm">Category breakdown coming soon...</p>
                </div>
            </main>
        </div>
    );
}
