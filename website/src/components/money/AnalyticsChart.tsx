'use client'

import { TransactionWithCategory } from '@/types/money';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { format } from 'date-fns';

export default function AnalyticsChart({ transactions }: { transactions: TransactionWithCategory[] }) {
    // Group by day
    const data = transactions.reduce((acc, t) => {
        const dateKey = format(new Date(t.date), 'dd');
        if (!acc[dateKey]) acc[dateKey] = { date: dateKey, income: 0, expense: 0 };
        if (t.type === 'INCOME') acc[dateKey].income += t.amount;
        else acc[dateKey].expense += t.amount;
        return acc;
    }, {} as Record<string, { date: string, income: number, expense: number }>);

    const chartData = (Object.values(data) as { date: string, income: number, expense: number }[]).sort((a, b) => parseInt(a.date) - parseInt(b.date));

    return (
        <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
                <BarChart data={chartData}>
                    <XAxis dataKey="date" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                        itemStyle={{ color: '#fff' }}
                        cursor={{ fill: '#27272a' }}
                    />
                    <Bar dataKey="income" fill="#22c55e" radius={[4, 4, 0, 0]} stackId="a" />
                    <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} stackId="a" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
