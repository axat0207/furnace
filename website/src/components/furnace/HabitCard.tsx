'use client';

import { motion } from 'framer-motion';
import { LucideIcon, Dumbbell, Apple, Milk, FlaskConical, Pill, Book, Briefcase, Moon, Users, Mic, MessageSquare, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<string, LucideIcon> = {
  dumbbell: Dumbbell,
  apple: Apple,
  milk: Milk,
  flask: FlaskConical,
  pill: Pill,
  book: Book,
  briefcase: Briefcase,
  moon: Moon,
  users: Users,
  mic: Mic,
  'message-square': MessageSquare,
  activity: Activity,
};

interface HabitCardProps {
  id: string;
  label: string;
  iconName?: string;
  completed: boolean;
  onClick: () => void;
  streak?: number;
}

export function HabitCard({ id, label, iconName, completed, onClick, streak = 0 }: HabitCardProps) {
  const Icon = iconName ? iconMap[iconName] || Activity : Activity;

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "relative group flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 w-full aspect-square",
        completed
          ? "bg-furnace-primary/10 border-furnace-primary shadow-[0_0_15px_rgba(255,85,0,0.3)]"
          : "bg-furnace-gray/40 border-white/5 hover:border-white/10 hover:bg-furnace-gray/60"
      )}
    >
      {/* Glow Effect when Completed */}
      {completed && (
        <div className="absolute inset-0 rounded-2xl bg-furnace-primary/20 blur-xl -z-10" />
      )}

      <div className={cn(
        "p-3 rounded-full mb-3 transition-colors duration-300",
        completed ? "bg-furnace-primary text-white" : "bg-white/5 text-furnace-accent/70 group-hover:text-furnace-accent"
      )}>
        <Icon size={24} />
      </div>

      <span className={cn(
        "font-medium text-sm tracking-wide",
        completed ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"
      )}>
        {label}
      </span>

      {streak > 0 && (
        <div className="absolute top-2 right-2 text-[10px] font-bold text-furnace-accent bg-black/40 px-1.5 py-0.5 rounded-full border border-furnace-accent/20">
          🔥 {streak}
        </div>
      )}
    </motion.button>
  );
}
