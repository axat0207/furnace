'use client';

import { useState, useEffect } from 'react';
import { FURNACE_HABITS } from '@/lib/furnace-constants';
import { HabitCard } from './HabitCard';
import { motion } from 'framer-motion';
import { toggleHabit, getTodayHabits, getStreaks } from '@/app/furnace-actions';

export function HabitGrid() {
  const [completedHabits, setCompletedHabits] = useState<string[]>([]);
  const [streaks, setStreaks] = useState<Record<string, number>>({});

  useEffect(() => {
    getTodayHabits().then(setCompletedHabits);
    getStreaks().then(setStreaks);
  }, []);

  const handleToggle = async (id: string) => {
    // Optimistic update
    setCompletedHabits(prev =>
      prev.includes(id)
        ? prev.filter(h => h !== id)
        : [...prev, id]
    );

    await toggleHabit(id);
    // Refresh streaks in background
    getStreaks().then(setStreaks);
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <span className="w-1 h-6 bg-furnace-primary rounded-full" />
        Daily Protocol
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {FURNACE_HABITS.map((habit, index) => (
          <motion.div
            key={habit.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <HabitCard
              id={habit.id}
              label={habit.label}
              iconName={habit.icon}
              completed={completedHabits.includes(habit.id)}
              onClick={() => handleToggle(habit.id)}
              streak={streaks[habit.id] || 0}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
