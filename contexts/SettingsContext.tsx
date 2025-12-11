import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppSettings, DEFAULT_SETTINGS } from '../types';
import { useAuth } from './AuthContext';
import { getUserSettings, saveUserSettings } from '../services/storageService';

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

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  // Load settings when User changes or App mounts
  useEffect(() => {
    if (user) {
        // Load User Settings
        const userSettings = getUserSettings(user.id);
        if (userSettings) {
            setSettings({
                 ...DEFAULT_SETTINGS,
                 ...userSettings,
                 notifications: { ...DEFAULT_SETTINGS.notifications, ...userSettings.notifications }
            });
        } else {
            // If user has no settings, save default for them
            saveUserSettings(user.id, DEFAULT_SETTINGS);
            setSettings(DEFAULT_SETTINGS);
        }
    } else {
        // Guest / Default Settings
        setSettings(DEFAULT_SETTINGS);
    }
  }, [user]);

  const updateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    if (user) {
        saveUserSettings(user.id, newSettings);
    }
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    if (user) {
        saveUserSettings(user.id, DEFAULT_SETTINGS);
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
export default SettingsContext;