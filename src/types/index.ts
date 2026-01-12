export interface HabitConfig {
  id: string;
  label: string;
  category: 'physical' | 'mental' | 'detox';
  requiredInMinimalMode: boolean;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  focusItems: string[]; // max 3
  habitsCompleted: string[]; // IDs of completed habits
  mood?: number;
  notes?: string;
  detoxLog?: {
    trigger: string;
    response: string;
    outcome: string;
  }[];
}

export interface LearningItem {
  id: string;
  topic: string;
  status: 'not_started' | 'in_progress' | 'internalized';
  explanation?: string;
  realWorldMapping?: string;
}

export interface ProblemItem {
  id: string;
  name: string;
  type: 'dsa' | 'debugging' | 'real_world';
  difficulty: 'easy' | 'medium' | 'hard';
  solved: boolean;
  explanation?: string; // Mandatory for solved=true
}

export interface Note {
  id: string;
  category: 'office' | 'casual' | 'relationship';
  content: string;
}

export interface PracticeEntry {
  id: string;
  date: string;
  type: 'written' | 'verbal';
  content?: string; // For written
}

export interface AppState {
  userProfile: {
    name: string;
    startDate: string; // ISO Date
  };
  settings: {
    minimalMode: boolean;
    theme: 'dark' | 'light';
  };
  dailyLogs: Record<string, DailyLog>;
  habits: HabitConfig[];
  learning: {
    systemDesign: LearningItem[];
    problems: ProblemItem[];
  };
  communication: {
    notes: Note[];
    practiceLog: PracticeEntry[];
  };
}
