import React, { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { SetupForm } from './components/SetupForm';
import { RoutineDisplay } from './components/RoutineDisplay';
import { SettingsPage } from './components/SettingsPage';
import { generateRoutine } from './services/geminiService';
import { UserFormData, RoutineResponse } from './types';
import { Settings as SettingsIcon } from 'lucide-react';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import { MotivationalPopup } from './components/MotivationalPopup';

function AppContent() {
  const { settings } = useSettings();
  const [view, setView] = useState<'home' | 'setup' | 'result' | 'settings'>('home');
  const [previousView, setPreviousView] = useState<'home' | 'setup' | 'result'>('home');
  
  // Profile State with Persistence
  const [formData, setFormData] = useState<UserFormData | null>(() => {
    const saved = localStorage.getItem('morningForgeProfile');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [routine, setRoutine] = useState<RoutineResponse | null>(() => {
     const saved = localStorage.getItem('morningForgeRoutine');
     try {
       return saved ? JSON.parse(saved) : null;
     } catch {
       return null;
     }
  });

  const [isLoading, setIsLoading] = useState(false);

  // Persist Profile & Routine
  useEffect(() => {
    if (formData) {
      localStorage.setItem('morningForgeProfile', JSON.stringify(formData));
    } else {
      localStorage.removeItem('morningForgeProfile');
    }
  }, [formData]);

  useEffect(() => {
    if (routine) {
      localStorage.setItem('morningForgeRoutine', JSON.stringify(routine));
    } else {
      localStorage.removeItem('morningForgeRoutine');
    }
  }, [routine]);

  // Apply Global Settings Side Effects
  useEffect(() => {
    const root = document.documentElement;
    
    // 1. Theme Logic
    const applyTheme = () => {
        const isDark = settings.theme === 'dark' || 
            (settings.theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        
        if (isDark) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    };
    applyTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaChange = () => {
        if (settings.theme === 'auto') applyTheme();
    };
    mediaQuery.addEventListener('change', handleMediaChange);

    // 2. Font Size
    const sizeMap = { sm: '14px', md: '16px', lg: '18px', xl: '20px' };
    root.style.fontSize = sizeMap[settings.fontSize];

    // 3. High Contrast
    if (settings.highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }

    // 4. Reduced Motion
    if (settings.reducedMotion) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }

    // 5. Dyslexia Font
    if (settings.dyslexiaFont) {
      document.body.style.fontFamily = '"Comic Sans MS", "Chalkboard SE", sans-serif'; 
    } else {
      document.body.style.fontFamily = '';
    }

    return () => mediaQuery.removeEventListener('change', handleMediaChange);

  }, [settings]);

  const handleStart = () => {
    if (formData && routine) {
        setView('result'); // If they already have a routine, go there
    } else if (formData) {
        setView('setup'); // Have data but no routine? Setup.
    } else {
        setView('setup');
    }
  };

  const openSettings = () => {
    if (view !== 'settings') {
        setPreviousView(view);
        setView('settings');
    } else {
        setView(previousView);
    }
  };

  const closeSettings = () => {
    setView(previousView);
  };

  const handleFormSubmit = async (data: UserFormData) => {
    setFormData(data);
    setIsLoading(true);
    try {
      const generatedRoutine = await generateRoutine(data);
      setRoutine(generatedRoutine);
      setView('result');
      
      // Show Summary/Streak Toast Logic would go here
      if (settings.notifications.routineSummary) {
          // In a real app, trigger a toast here
      }
    } catch (error) {
      alert("Failed to generate routine. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async (data: UserFormData = formData!) => {
    if (!data) return;
    setIsLoading(true);
    try {
      const generatedRoutine = await generateRoutine(data);
      setRoutine(generatedRoutine);
    } catch (error) {
      alert("Failed to regenerate routine.");
    } finally {
      setIsLoading(false);
    }
  };

  // Called from Settings to update and regen
  const handleProfileUpdateAndRegen = async (newData: UserFormData) => {
      setFormData(newData);
      // If we are already in result view or want to go there
      await handleRegenerate(newData);
      if (view === 'settings') {
          // Stay in settings or go to result? 
          // Requirement: "Show popup... Buttons appear... When Regenerate is clicked -> instantly create"
          // This function is the action of regenerating.
      }
  };

  const handleResetApp = () => {
    setFormData(null);
    setRoutine(null);
    // Settings are reset inside SettingsPage via context
    setView('home');
  };

  return (
    <div className={`font-sans text-slate-900 dark:text-white transition-colors min-h-screen`}>
      {/* Motivational Popup (Loads on mount if enabled) */}
      <MotivationalPopup style={formData?.routineStyle} />

      {/* Header for Settings Access */}
      <div className="fixed top-4 right-4 z-50">
        <button 
          onClick={openSettings}
          className="p-2 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur shadow-sm hover:bg-white dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-600 group"
          title="Settings"
        >
          <SettingsIcon className={`w-5 h-5 text-slate-600 dark:text-slate-300 group-hover:rotate-90 transition-transform duration-500`}/>
        </button>
      </div>

      {view === 'settings' && (
        <SettingsPage 
          onClose={closeSettings}
          userData={formData}
          onUpdateUserData={(d) => setFormData(d)}
          onRegenerate={handleProfileUpdateAndRegen}
          onResetApp={handleResetApp}
          currentRoutine={routine}
        />
      )}

      {view === 'home' && <Hero onStart={handleStart} />}
      
      {view === 'setup' && (
        <SetupForm onSubmit={handleFormSubmit} isLoading={isLoading} />
      )}
      
      {view === 'result' && routine && (
        <RoutineDisplay 
          routine={routine} 
          onReset={() => setView('setup')} 
          onRegenerate={() => handleRegenerate()} 
          isLoading={isLoading} 
          simplifiedMode={settings.simplifiedMode}
        />
      )}
    </div>
  );
}

export default function App() {
    return (
        <SettingsProvider>
            <AppContent />
        </SettingsProvider>
    )
}