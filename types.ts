
export enum GoalType {
  MUSCLE = 'Build muscle / better physique',
  WEIGHT_LOSS = 'Lose weight / get lean',
  TESTOSTERONE = 'Boost testosterone naturally',
  DISCIPLINE = 'Build discipline & focus',
  MONEY = 'Make money / work on business',
  MENTAL = 'Improve mental health & calmness'
}

export interface UserFormData {
  // Step 1: Basic
  age: number;
  gender: 'Male' | 'Female' | 'Prefer not to say';
  weight: number;
  weightUnit: 'kg' | 'lbs';
  height?: string;

  // Step 2: Schedule
  occupation: 'School' | 'Work' | 'Neither';
  startTime: string; // HH:MM
  wakeTime: string; // HH:MM
  sleepHours: number;
  sleepTime?: string; // HH:MM

  // Step 3: Goals & Details
  goals: GoalType[];
  
  // Goal Specific Details
  gymAccess?: 'Yes' | 'No' | 'Later';
  homeEquipment?: string;
  fitnessLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
  
  intensityPreference?: 'Easy' | 'Medium' | 'Hard';
  canWalk?: boolean;
  dietQuality?: 'Bad' | 'Average' | 'Clean';
  
  canGoOutside?: boolean;
  coldExposure?: 'Yes' | 'No' | 'Maybe';
  
  moneyFocus?: 'Business' | 'Skill' | 'Side hustle' | 'Unknown';
  workDuration?: number; // minutes
  deviceAccess?: 'PC' | 'Phone' | 'Both';
  
  morningVibe?: 'Calm' | 'Balanced' | 'Intense';
  disciplinePriority?: 'Consistency' | 'Focus' | 'Confidence' | 'Reduced overthinking';

  // Step 4: Limits
  maxDuration: number; // minutes
  leaveTime: string; // HH:MM
  injuries?: string;
  routineStyle: 'Chill' | 'Efficient' | 'Hardcore';
}

export interface RoutineBlock {
  timeRange: string;
  title: string;
  activities: string[];
  explanation: string;
  icon: 'wake' | 'move' | 'mind' | 'money' | 'prepare' | 'other';
}

export interface RoutineResponse {
  title: string;
  summary: {
    wakeTime: string;
    sleepTarget: string;
    duration: string;
    focus: string;
  };
  blocks: RoutineBlock[];
}

export interface User {
  id: string;
  name: string;
  email?: string;
  createdAt: string;
}

export interface SavedRoutine extends RoutineResponse {
  id: string;
  createdAt: string;
  goals: GoalType[];
  style: 'Chill' | 'Efficient' | 'Hardcore';
}

export interface Streak {
  currentStreak: number;
  lastCompletedDate: string; // YYYY-MM-DD
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  accentColor: 'indigo' | 'purple' | 'teal' | 'rose' | 'amber';
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  highContrast: boolean;
  reducedMotion: boolean;
  dyslexiaFont: boolean;
  simplifiedMode: boolean; // For routine display
  ttsEnabled: boolean;
  notifications: {
    email: boolean;
    motivation: boolean; // "Motivational Reminders"
    streak: boolean; // "Streak Messages"
    reminderTime: string;
    welcomeQuote: boolean; // "Motivational Quote Pop-Up"
    routineSummary: boolean; // "Routine Summary"
  };
}

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light',
  accentColor: 'indigo',
  fontSize: 'md',
  highContrast: false,
  reducedMotion: false,
  dyslexiaFont: false,
  simplifiedMode: false,
  ttsEnabled: false,
  notifications: {
    email: false,
    motivation: true,
    streak: true,
    reminderTime: '06:00',
    welcomeQuote: true,
    routineSummary: true
  }
};
