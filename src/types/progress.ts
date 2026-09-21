export interface UserProgress {
  lessonsCompleted: string[];
  quizScores: Record<string, number>;
  projectsCompleted: string[];
  streak: number;
  lastActiveDate: string;
  currentModuleId: string;
  currentLessonId: string;
  timeSpentMinutes: number;
  weakAreas: string[];
  xp: number;
  level: number;
}

export interface UserSettings {
  theme: 'dark' | 'light';
  beginnerMode: boolean;
  dailyGoalMinutes: number;
  notifications: boolean;
  fontSize: 'sm' | 'md' | 'lg';
  userName: string;
}

export interface BookmarkEntry {
  lessonId: string;
  savedAt: string;
  note?: string;
}

export interface NoteEntry {
  lessonId: string;
  content: string;
  updatedAt: string;
}
