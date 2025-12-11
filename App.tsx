import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SetupForm } from './components/SetupForm';
import { RoutineDisplay } from './components/RoutineDisplay';
import { SettingsPage } from './components/SettingsPage';
import { Dashboard } from './components/Dashboard';
import { SavedRoutines } from './components/SavedRoutines';
import { PremiumPage } from './components/PremiumPage';
import { AIAssistant } from './components/AIAssistant';
import { generateRoutine } from './services/geminiService';
import { UserFormData, RoutineResponse, SavedRoutine } from './types';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MotivationalPopup } from './components/MotivationalPopup';
import { PageTransition } from './components/ui/PageTransition';

function AppContent() {
  const { settings } = useSettings();
  const { isAuthenticated } = useAuth();
  
  // Navigation History State
  const [history, setHistory] = useState<string[]>(['home']);
  const view = history[history.length - 1];

  const handleNavigate = (newView: string) => {
    setHistory(prev => {
      // Prevent pushing duplicate views consecutively
      if (prev[prev.length - 1] === newView) return prev;
      return [...prev, newView];
    });
  };

  const handleBack = () => {
    setHistory(prev => {
      if (prev.length <= 1) return prev;
      return prev.slice(0, -1);
    });
  };
  
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
      // Replace history with dashboard
      setHistory(['dashboard']);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (formData) {
      localStorage.setItem('morningForgeProfile', JSON.stringify(formData));
    }
  }, [formData]);

  // Apply Global Settings & Premium Themes
  useEffect(() => {
    const root = document.documentElement;
    
    // 1. Determine Dark Mode State
    let isDark = false;
    
    // Check "Classic" mode logic first
    if (settings.premiumTheme === 'classic') {
       if (settings.theme === 'dark') isDark = true;
       if (settings.theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches) isDark = true;
    } else {
       // Forced Modes for Themes
       if (['soft_dark', 'neon_focus', 'midnight_deep'].includes(settings.premiumTheme)) {
           isDark = true;
       }
       // sunrise_gold, minimal_white force Light mode (default false)
    }

    // Apply Dark Class
    isDark ? root.classList.add('dark') : root.classList.remove('dark');
    
    // 2. Apply Theme Class
    // Remove old theme classes
    root.classList.remove(
        'theme-classic', 
        'theme-soft_dark', 
        'theme-sunrise_gold', 
        'theme-neon_focus', 
        'theme-minimal_white', 
        'theme-midnight_deep'
    );
    // Add new theme class
    root.classList.add(`theme-${settings.premiumTheme}`);

    // 3. Fonts & Accessibility
    const sizeMap = { sm: '14px', md: '16px', lg: '18px', xl: '20px' };
    root.style.fontSize = sizeMap[settings.fontSize];
    document.body.classList.toggle('high-contrast', settings.highContrast);
    document.body.classList.toggle('reduced-motion', settings.reducedMotion);
    document.body.style.fontFamily = settings.dyslexiaFont ? '"Comic Sans MS", "Chalkboard SE", sans-serif' : '';
    
  }, [settings]);

  const handleStart = () => handleNavigate('setup');
  
  const handleFormSubmit = async (data: UserFormData) => {
    setFormData(data);
    setIsLoading(true);
    try {
      const generatedRoutine = await generateRoutine(data);
      setRoutine(generatedRoutine);
      handleNavigate('result');
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

  const handleLoadRoutine = (r: SavedRoutine) => {
    setRoutine(r);
  };

  const ProtectedView: React.FC<{ children: React.ReactNode }> = ({ children }) => {
     if (!isAuthenticated) {
       return (
         <div className="min-h-screen pt-24 flex flex-col items-center justify-center p-4 text-center">
            <h2 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Access Denied</h2>
            <p className="text-slate-500 mb-4">Please log in to access this page.</p>
            <button onClick={() => handleNavigate('home')} className="text-indigo-600 underline">Go Home</button>
         </div>
       );
     }
     return <>{children}</>;
  };

  return (
    <div className={`font-sans text-slate-900 dark:text-white transition-colors min-h-screen`}>
      <MotivationalPopup style={formData?.routineStyle} />
      
      <Navbar 
        onNavigate={handleNavigate} 
        onBack={handleBack}
        currentView={view} 
      />
      
      {view === 'premium' && (
        <PageTransition>
          <PremiumPage onClose={handleBack} onNavigate={handleNavigate} />
        </PageTransition>
      )}

      {view === 'settings' && (
        <PageTransition>
          <SettingsPage 
            onClose={() => handleNavigate(isAuthenticated ? 'dashboard' : 'home')}
            userData={formData}
            onUpdateUserData={setFormData}
            onRegenerate={handleRegenerate}
            onResetApp={() => handleNavigate('home')}
            currentRoutine={routine}
          />
        </PageTransition>
      )}

      {view === 'home' && (
        <PageTransition>
          <Hero onStart={handleStart} />
        </PageTransition>
      )}
      
      {view === 'dashboard' && (
        <ProtectedView>
           <PageTransition>
             <Dashboard 
               onNavigate={handleNavigate} 
               onSetRoutine={handleLoadRoutine} 
               activeRoutine={routine as SavedRoutine}
               userData={formData}
             />
           </PageTransition>
        </ProtectedView>
      )}

      {view === 'saved' && (
        <ProtectedView>
           <PageTransition>
             <SavedRoutines 
               onLoadRoutine={handleLoadRoutine} 
               onNavigate={handleNavigate} 
             />
           </PageTransition>
        </ProtectedView>
      )}
      
      {view === 'setup' && (
        <PageTransition>
          <div className="pt-16">
            <SetupForm onSubmit={handleFormSubmit} isLoading={isLoading} onNavigate={handleNavigate} />
          </div>
        </PageTransition>
      )}
      
      {view === 'result' && routine && (
        <PageTransition>
          <RoutineDisplay 
            routine={routine} 
            onReset={() => handleNavigate('setup')} 
            onRegenerate={() => handleRegenerate()} 
            isLoading={isLoading} 
            simplifiedMode={settings.simplifiedMode}
          />
        </PageTransition>
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