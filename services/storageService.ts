
import { SavedRoutine, Streak, User } from "../types";

// User Helpers
export const saveUser = (user: User) => {
  localStorage.setItem('mf_user', JSON.stringify(user));
};

export const getUser = (): User | null => {
  const data = localStorage.getItem('mf_user');
  return data ? JSON.parse(data) : null;
};

export const removeUser = () => {
  localStorage.removeItem('mf_user');
};

// Saved Routines Helpers
export const getSavedRoutines = (userId: string): SavedRoutine[] => {
  const key = `mf_saved_routines_${userId}`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

export const saveRoutine = (userId: string, routine: SavedRoutine) => {
  const key = `mf_saved_routines_${userId}`;
  const current = getSavedRoutines(userId);
  const updated = [routine, ...current];
  localStorage.setItem(key, JSON.stringify(updated));
};

export const deleteRoutine = (userId: string, routineId: string) => {
  const key = `mf_saved_routines_${userId}`;
  const current = getSavedRoutines(userId);
  const updated = current.filter(r => r.id !== routineId);
  localStorage.setItem(key, JSON.stringify(updated));
};

export const updateRoutine = (userId: string, updatedRoutine: SavedRoutine) => {
  const key = `mf_saved_routines_${userId}`;
  const current = getSavedRoutines(userId);
  const updated = current.map(r => r.id === updatedRoutine.id ? updatedRoutine : r);
  localStorage.setItem(key, JSON.stringify(updated));
};

// Streak Helpers
export const getStreak = (userId: string): Streak => {
  const key = `mf_streak_${userId}`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : { currentStreak: 0, lastCompletedDate: '' };
};

export const updateStreak = (userId: string): { newStreak: number, message: string } => {
  const key = `mf_streak_${userId}`;
  const current = getStreak(userId);
  
  const today = new Date().toISOString().split('T')[0];
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = yesterdayDate.toISOString().split('T')[0];

  if (current.lastCompletedDate === today) {
    return { newStreak: current.currentStreak, message: 'Already completed today!' };
  }

  let newStreak = 1;
  if (current.lastCompletedDate === yesterday) {
    newStreak = current.currentStreak + 1;
  }

  const newStreakObj: Streak = {
    currentStreak: newStreak,
    lastCompletedDate: today
  };
  
  localStorage.setItem(key, JSON.stringify(newStreakObj));
  return { newStreak, message: 'Streak updated!' };
};
