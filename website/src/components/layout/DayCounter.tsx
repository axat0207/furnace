'use client';

import { useEffect, useState } from 'react';

export function DayCounter() {
    const [dayCount, setDayCount] = useState<number | null>(null);
    const [totalDays, setTotalDays] = useState<number | null>(null);

    useEffect(() => {
        async function fetchDayInfo() {
            try {
                const res = await fetch('/api/user', {
                    credentials: 'include',
                    cache: 'no-store',
                });
                if (res.ok) {
                    const user = await res.json();
                    if (user?.startDate) {
                        const startDate = new Date(user.startDate);
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        startDate.setHours(0, 0, 0, 0);
                        
                        const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
                        const currentDay = daysSinceStart + 1; // Day 1 is the start date
                        
                        setDayCount(currentDay);
                        setTotalDays(currentDay); // Total days = current day (no end date)
                    }
                }
            } catch (error) {
                console.error('Error fetching day info:', error);
            }
        }
        fetchDayInfo();
    }, []);

    if (dayCount === null || totalDays === null) {
        return (
            <div className="text-[10px] text-[var(--text-muted)] text-center md:text-left mt-2 px-2 hidden md:block font-mono">
                DAY ...
            </div>
        );
    }

    return (
        <div className="text-[10px] text-[var(--text-muted)] text-center md:text-left mt-2 px-2 hidden md:block font-mono">
            DAY {dayCount}
        </div>
    );
}
