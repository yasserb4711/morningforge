
import { SavedRoutine, Streak, User, AppSettings } from "../types";

const USERS_KEY = 'mf_users_db';
const CURRENT_USER_KEY = 'mf_current_user_session';

// --- AUTH / USER MANAGEMENT ---

// Helper: Get all users "DB"
const getUsersDB = (): User[] => {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
};

// Helper: Save all users "DB"
const saveUsersDB = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Simple Hash Simulation (Not secure for production, fine for demo)
const hashPassword = (password: string): string => {
  return btoa(password).split('').reverse().join('');
};

export const registerUser = (name: string, email: string, password: string): User => {
  const users = getUsersDB();
  if (users.find(u => u.email === email)) {
    throw new Error("User already exists with this email.");
  }

  const newUser: User = {
    id: crypto.randomUUID(),
    name,
    email,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
    isPro: false,
    trialStartDate: null
  };

  users.push(newUser);
  saveUsersDB(users);
  return newUser;
};

export const authenticateUser = (email: string, password: string): User => {
  const users = getUsersDB();
  const user = users.find(u => u.email === email && u.passwordHash === hashPassword(password));
  
  if (!user) {
    throw new Error("Invalid email or password.");
  }
  
  return checkAndExpireTrial(user);
};

export const updateUserRecord = (updatedUser: User) => {
  const users = getUsersDB();
  const index = users.findIndex(u => u.id === updatedUser.id);
  if (index !== -1) {
    users[index] = updatedUser;
    saveUsersDB(users);
    
    // If updating current logged in user session
    const currentUser = getCurrentUserSession();
    if (currentUser && currentUser.id === updatedUser.id) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
    }
  }
};

export const getCurrentUserSession = (): User | null => {
  const data = localStorage.getItem(CURRENT_USER_KEY);
  if (!data) return null;
  
  const user = JSON.parse(data);
  return checkAndExpireTrial(user);
};

export const setCurrentUserSession = (user: User) => {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

export const clearCurrentUserSession = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

// Logic to check if trial has expired (7 days)
export const checkAndExpireTrial = (user: User): User => {
  if (user.trialStartDate) {
    const start = new Date(user.trialStartDate).getTime();
    const now = new Date().getTime();
    const daysPassed = (now - start) / (1000 * 3600 * 24);

    // If trial expired but user is still marked as Pro (and hasn't paid - assuming logic here is strictly trial management)
    if (daysPassed > 7 && user.isPro) {
       const expiredUser = { ...user, isPro: false };
       // Update in DB (but don't cause infinite loop if called from updateUserRecord)
       // We'll just return the correct state and let the app handle saving if needed, 
       // or we explicitly save to DB here.
       
       const users = getUsersDB();
       const index = users.findIndex(u => u.id === user.id);
       if (index !== -1) {
         users[index] = expiredUser;
         saveUsersDB(users);
       }
       
       // Update session if it matches
       const currentSession = localStorage.getItem(CURRENT_USER_KEY);
       if (currentSession) {
          const s = JSON.parse(currentSession);
          if (s.id === user.id) {
             localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(expiredUser));
          }
       }
       
       return expiredUser;
    }
  }
  return user;
};

// --- DATA ISOLATION (Per User) ---

// Saved Routines Helpers
export const getSavedRoutines = (userId: string): SavedRoutine[] => {
  const key = `mf_data_${userId}_routines`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

export const saveRoutine = (userId: string, routine: SavedRoutine) => {
  const key = `mf_data_${userId}_routines`;
  const current = getSavedRoutines(userId);
  const updated = [routine, ...current];
  localStorage.setItem(key, JSON.stringify(updated));
};

export const deleteRoutine = (userId: string, routineId: string) => {
  const key = `mf_data_${userId}_routines`;
  const current = getSavedRoutines(userId);
  const updated = current.filter(r => r.id !== routineId);
  localStorage.setItem(key, JSON.stringify(updated));
};

export const updateRoutine = (userId: string, updatedRoutine: SavedRoutine) => {
  const key = `mf_data_${userId}_routines`;
  const current = getSavedRoutines(userId);
  const updated = current.map(r => r.id === updatedRoutine.id ? updatedRoutine : r);
  localStorage.setItem(key, JSON.stringify(updated));
};

// Streak Helpers
export const getStreak = (userId: string): Streak => {
  const key = `mf_data_${userId}_streak`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : { currentStreak: 0, lastCompletedDate: '' };
};

export const updateStreak = (userId: string): { newStreak: number, message: string } => {
  const key = `mf_data_${userId}_streak`;
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

// User Settings
export const getUserSettings = (userId: string): AppSettings | null => {
    const key = `mf_data_${userId}_settings`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
};

export const saveUserSettings = (userId: string, settings: AppSettings) => {
    const key = `mf_data_${userId}_settings`;
    localStorage.setItem(key, JSON.stringify(settings));
};
