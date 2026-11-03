export type Level = "A0" | "A1" | "A2" | "B1" | "B2" | "C1";
export type FontScale = "normal" | "large" | "xlarge";

export type LessonWord = {
  word: string;
  meaning: string;
  example: string;
};

export type Lesson = {
  id: string;
  level: Level;
  title: string;
  category: string;
  minutes: number;
  explanation: string;
  example: string;
  translation: string;
  tip: string;
  question: string;
  options: string[];
  answer: string;
  feedback: string;
  words: LessonWord[];
  etymology?: string;
  contextExamples?: { en: string; fa: string }[];
  objective?: string;
};

export type SavedState = {
  userName: string;
  dailyGoal: string;
  completedLessons: string[];
  reviewedWords: string[];
  reviewDates: Record<string, number>;
  currentLessonId: string;
  level: Level;
  placementHistory: string[][];
  placementResult: Level | null;
  lastStudyDate: string;
  studiedToday: number;
  skillProgress: Record<string, number>;
  studyStreak: number;
  fontScale: FontScale;
  updatedAt?: number;
  version?: number;
};

export const LEVELS: Level[] = ["A0", "A1", "A2", "B1", "B2", "C1"];

export const STORAGE_KEY = "vazheno-progress-v3";
export const PROGRESS_VERSION = 1;
