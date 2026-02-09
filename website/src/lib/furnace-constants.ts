
export interface FurnaceHabit {
  id: string;
  label: string;
  category: 'physical' | 'mental' | 'growth' | 'social';
  icon?: string;
  description?: string;
}

export const FURNACE_HABITS: FurnaceHabit[] = [
  // Physical
  { id: 'gym', label: 'Gym', category: 'physical', icon: 'dumbbell' },
  { id: 'diet', label: 'Diet', category: 'physical', icon: 'apple' },
  { id: 'whey', label: 'Whey', category: 'physical', icon: 'milk' },
  { id: 'creatine', label: 'Creatine', category: 'physical', icon: 'flask' },
  { id: 'multivitamin', label: 'Multivitamin', category: 'physical', icon: 'pill' },

  // Growth & Career
  { id: 'learn', label: 'Learn', category: 'growth', icon: 'book' },
  { id: 'freelance', label: 'Freelance', category: 'growth', icon: 'briefcase' },

  // Lifestyle
  { id: 'early_sleep', label: 'Early Sleep', category: 'growth', icon: 'moon' },

  // Social / Communication (Key Focus)
  { id: 'communication', label: 'Communication', category: 'social', icon: 'users' },
  { id: 'english_speaking', label: 'English Speaking', category: 'social', icon: 'mic' },
  { id: 'prof_chat', label: 'Prof. Chat', category: 'social', icon: 'message-square' },
];
