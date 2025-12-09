import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SetupForm } from './components/SetupForm';
import { RoutineDisplay } from './components/RoutineDisplay';
import { SettingsPage } from './components/SettingsPage';
import { Dashboard } from './components/Dashboard';
import { SavedRoutines } from './components/SavedRoutines';
import { AIAssistant } from './components/AIAssistant';
import { generateRoutine } from './services/geminiService';
import { UserFormData, RoutineResponse, SavedRoutine } from './types';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MotivationalPopup } from './components/MotivationalPopup';

const DEMO_ROUTINE: RoutineResponse = {
  title: "The CEO Morning Demo",
  summary: {
    wakeTime: "06:00",
    sleepTarget: "10:00 PM - 06:00 AM",
    duration: "45 Minutes",
    focus: "Mental Clarity & Strategy"
  },
  blocks: [
    {
      timeRange: "06:00 - 06:05",
      title: "Hydrate & Sunlight",
      activities: ["Drink 500ml water with salt", "Get direct sunlight/bright light"],
      explanation: "Kickstarts cortisol to wake you up.",
      icon: "wake"
    },
    {
      timeRange: "06:05 - 06:25",
      title: "Deep Work / Strategy",
      activities: ["Review top 3 goals", "Journal or plan day"],
      explanation: "Brain is freshest. Do not check phone.",
      icon: "mind"
    },
    {
      timeRange: "06:25 - 06:45",
      title: "Movement",
      activities: ["Kettlebell swings", "Stretching"],
      explanation: "Raises body temp and energy.",
      icon: "move"
    }
  ]
};

function AppContent() {
  const { settings } = useSettings();
  const { isAuthenticated } = useAuth();
  
  // Views: 'home' | 'dashboard' | 'setup' | 'result' | 'settings' | 'saved'
  const [view, setView] = useState<string>('home');
  
  // Profile State
  const [formData, setFormData] = useState<UserFormData | null>(() => {
    const saved = localStorage.getItem('morningForgeProfile');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [routine, setRoutine] = useState<RoutineResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-redirect if logged in on load
  useEffect(() => {
    if (isAuthenticated && view === 'home') {
      setView('dashboard');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (formData) {
      localStorage.setItem('morningForgeProfile', JSON.stringify(formData));
    }
  }, [formData]);

  // Apply Global Settings
  useEffect(() => {
    const root = document.documentElement;
    const applyTheme = () => {
        const isDark = settings.theme === 'dark' || 
            (settings.theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        isDark ? root.classList.add('dark') : root.classList.remove('dark');
    };
    applyTheme();
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
       if (settings.theme === 'auto') applyTheme();
    });
    
    // Fonts & Accessibility
    const sizeMap = { sm: '14px', md: '16px', lg: '18px', xl: '20px' };
    root.style.fontSize = sizeMap[settings.fontSize];
    document.body.classList.toggle('high-contrast', settings.highContrast);
    document.body.classList.toggle('reduced-motion', settings.reducedMotion);
    document.body.style.fontFamily = settings.dyslexiaFont ? '"Comic Sans MS", "Chalkboard SE", sans-serif' : '';
  }, [settings]);

  const handleStart = () => setView('setup');
  
  const handleDemo = () => {
    setRoutine(DEMO_ROUTINE);
    setView('result');
  };

  const handleFormSubmit = async (data: UserFormData) => {
    setFormData(data);
    setIsLoading(true);
    try {
      const generatedRoutine = await generateRoutine(data);
      setRoutine(generatedRoutine);
      setView('result');
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

  // Called from Saved Routines to load one
  const handleLoadRoutine = (r: SavedRoutine) => {
    setRoutine(r);
  };

  // Protected Route Logic wrapper
  const ProtectedView = ({ children }: { children: React.ReactNode }) => {
     if (!isAuthenticated) {
       return (
         <div className="min-h-screen pt-24 flex flex-col items-center justify-center p-4 text-center">
            <h2 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Access Denied</h2>
            <p className="text-slate-500 mb-4">Please log in to access this page.</p>
            <button onClick={() => setView('home')} className="text-indigo-600 underline">Go Home</button>
         </div>
       );
     }
     return <>{children}</>;
  };

  return (
    <div className={`font-sans text-slate-900 dark:text-white transition-colors min-h-screen`}>
      <MotivationalPopup style={formData?.routineStyle} />
      
      <Navbar onNavigate={setView} currentView={view} />
      
      {view === 'settings' && (
        <SettingsPage 
          onClose={() => setView(isAuthenticated ? 'dashboard' : 'home')}
          userData={formData}
          onUpdateUserData={setFormData}
          onRegenerate={handleRegenerate}
          onResetApp={() => setView('home')}
          currentRoutine={routine}
        />
      )}

      {view === 'home' && <Hero onStart={handleStart} onDemo={handleDemo} />}
      
      {view === 'dashboard' && (
        <ProtectedView>
           <Dashboard 
             onNavigate={setView} 
             onSetRoutine={handleLoadRoutine} 
             activeRoutine={routine as SavedRoutine}
             userData={formData}
           />
        </ProtectedView>
      )}

      {view === 'saved' && (
        <ProtectedView>
           <SavedRoutines 
             onLoadRoutine={handleLoadRoutine} 
             onNavigate={setView} 
           />
        </ProtectedView>
      )}
      
      {view === 'setup' && (
        <div className="pt-16">
          <SetupForm onSubmit={handleFormSubmit} isLoading={isLoading} />
        </div>
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

      <AIAssistant currentRoutine={routine} />
    </div>
  );
}

export default function App() {
    return (
        <SettingsProvider>
            <AuthProvider>
               <AppContent />
            </AuthProvider>
        </SettingsProvider>
    )
}