import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppSettings, DEFAULT_SETTINGS } from '../types';

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: AppSettings) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: DEFAULT_SETTINGS,
  updateSettings: () => {},
  resetSettings: () => {},
});

// Fixed: Use explicit props type for children instead of React.FC to ensure compatibility
export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('morningForgeSettings');
      try {
        if (saved) {
           const parsed = JSON.parse(saved);
           // Deep merge to ensure new keys in notifications are present if they didn't exist in saved data
           return {
             ...DEFAULT_SETTINGS,
             ...parsed,
             notifications: {
               ...DEFAULT_SETTINGS.notifications,
               ...(parsed.notifications || {})
             }
           };
        }
        return DEFAULT_SETTINGS;
      } catch (e) {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  const updateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.setItem('morningForgeSettings', JSON.stringify(newSettings));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.setItem('morningForgeSettings', JSON.stringify(DEFAULT_SETTINGS));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
export default SettingsContext;