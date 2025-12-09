import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import { SavedRoutine, UserFormData } from '../types';
import { getSavedRoutines, getStreak, updateStreak } from '../services/storageService';
import { generateMotivationalQuote } from '../services/geminiService';
import { Button } from './ui/Button';
import { 
  Zap, 
  Play, 
  Plus, 
  Settings, 
  CheckCircle2, 
  Clock, 
  Moon, 
  Target, 
  Check, 
  RefreshCw, 
  ChevronRight,
  List
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (view: any) => void;
  onSetRoutine: (routine: SavedRoutine) => void;
  activeRoutine: SavedRoutine | null;
  userData: UserFormData | null;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, onSetRoutine, activeRoutine, userData }) => {
  const { user } = useAuth();
  const { settings } = useSettings();
  const [streak, setStreak] = useState(getStreak(user?.id || ''));
  const [quote, setQuote] = useState("Small wins stack into big results.");
  const [isQuoteLoading, setIsQuoteLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  
  // Load data
  useEffect(() => {
    if (user) {
      setStreak(getStreak(user.id));
    }
  }, [user]);

  // Initial Quote
  useEffect(() => {
    handleRefreshQuote();
  }, []);

  const handleRefreshQuote = async () => {
    setIsQuoteLoading(true);
    const style = activeRoutine?.style || userData?.routineStyle || 'Efficient';
    try {
      const newQuote = await generateMotivationalQuote(style);
      setQuote(newQuote);
    } catch(e) {
      // Keep default
    } finally {
      setIsQuoteLoading(false);
    }
  };

  const handleMarkComplete = () => {
    if (!user) return;
    const result = updateStreak(user.id);
    setStreak({ currentStreak: result.newStreak, lastCompletedDate: new Date().toISOString().split('T')[0] });
    
    if (result.message.includes('Streak updated')) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } else {
        alert("Today is already marked as completed.");
    }
  };

  const color = settings.accentColor;
  const isCompletedToday = streak.lastCompletedDate === new Date().toISOString().split('T')[0];

  // Helper to get goals/style from active routine OR user profile fallback
  const currentGoals = (activeRoutine as any)?.goals || userData?.goals || [];
  const currentStyle = (activeRoutine as any)?.style || userData?.routineStyle || 'Standard';

  // Streak Progress
  const streakPercent = Math.min(100, Math.max(10, (streak.currentStreak / 14) * 100));
  let streakMessage = "Let's start your streak.";
  if (streak.currentStreak > 0) streakMessage = "You're starting strong.";
  if (streak.currentStreak >= 3) streakMessage = "Nice consistency.";
  if (streak.currentStreak >= 7) streakMessage = "You're on a roll.";
  if (streak.currentStreak >= 14) streakMessage = "Unstoppable.";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 px-4 sm:px-6 lg:px-8 pb-20 transition-colors">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome back, {user?.name}.</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">Let's attack the day.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Main Card: Today's Routine */}
          <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
             <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
                   <Play className={`w-5 h-5 text-${color}-600 mr-2`} /> Today's Routine
                </h2>
                {activeRoutine && (
                  <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full bg-${color}-50 text-${color}-600 dark:bg-slate-800 border border-${color}-100 dark:border-slate-700`}>
                    Active
                  </span>
                )}
             </div>

             {activeRoutine ? (
               <div className="space-y-6">
                  {/* Header Info */}
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">{activeRoutine.title}</h3>
                    
                    {/* Overview Row */}
                    <div className="flex flex-wrap gap-y-2 gap-x-4 mt-3 text-xs font-medium text-slate-500 dark:text-slate-400 items-center">
                        <span className="flex items-center bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                           <Moon className="w-3 h-3 mr-1.5"/> {activeRoutine.summary.sleepTarget.split('-')[0]} - {activeRoutine.summary.wakeTime}
                        </span>
                        <span className={`flex items-center bg-${color}-50 dark:bg-slate-800/50 text-${color}-700 dark:text-${color}-400 px-2 py-1 rounded border border-${color}-100 dark:border-slate-700`}>
                           <Zap className="w-3 h-3 mr-1.5"/> {currentStyle}
                        </span>
                        {currentGoals.slice(0, 2).map((g: string, i: number) => (
                           <span key={i} className="flex items-center bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">
                             <Target className="w-3 h-3 mr-1.5"/> {g.split(' ')[0]}
                           </span>
                        ))}
                    </div>
                  </div>

                  {/* Progress / Timeline Bar */}
                  <div className="space-y-1.5">
                     <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        <span>Timeline</span>
                        <span>{activeRoutine.summary.duration}</span>
                     </div>
                     <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full bg-${color}-500 rounded-full w-2/3`}></div>
                     </div>
                  </div>

                  {/* Key Sections List */}
                  <div className="space-y-2">
                     {activeRoutine.blocks.slice(0, 4).map((block, i) => (
                        <div key={i} className="flex items-center text-sm text-slate-700 dark:text-slate-300">
                           <div className={`w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mr-3 text-slate-500`}>
                             <div className={`w-1.5 h-1.5 rounded-full bg-${color}-500`}></div>
                           </div>
                           <span className="font-medium mr-2">{block.title}</span>
                           <span className="text-slate-400 text-xs ml-auto font-mono">{block.timeRange.split('-')[0]}</span>
                        </div>
                     ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                     <Button onClick={() => onNavigate('result')} className="flex-1">
                        Open Routine <ChevronRight className="w-4 h-4 ml-1"/>
                     </Button>
                     <Button 
                       variant="outline" 
                       onClick={handleMarkComplete} 
                       disabled={isCompletedToday}
                       className={`flex-1 ${isCompletedToday ? 'opacity-70 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' : ''}`}
                     >
                       {isCompletedToday ? (
                         <><Check className="w-4 h-4 mr-2"/> Completed</>
                       ) : (
                         'Mark Complete'
                       )}
                     </Button>
                  </div>
               </div>
             ) : (
               <div className="text-center py-12">
                 <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                    <List className="w-8 h-8"/>
                 </div>
                 <h3 className="text-lg font-bold text-slate-900 dark:text-white">No active routine</h3>
                 <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">Generate a new routine or pick one from your library to get started.</p>
                 <div className="flex justify-center gap-3">
                    <Button size="sm" onClick={() => onNavigate('setup')}>Generate New</Button>
                    <Button size="sm" variant="outline" onClick={() => onNavigate('saved')}>Pick Saved</Button>
                 </div>
               </div>
             )}
          </div>

          {/* Side Column */}
          <div className="space-y-6">
            
            {/* Streak Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 text-center hover:shadow-md transition-shadow">
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Current Streak</h3>
               
               <div className="flex items-center justify-center mb-2">
                  <span className={`text-6xl font-black text-slate-900 dark:text-white tracking-tighter`}>{streak.currentStreak}</span>
                  <Zap className={`w-8 h-8 ml-2 ${streak.currentStreak > 0 ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`}/>
               </div>
               
               {/* Streak Bar */}
               <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-3">
                  <div 
                    className="h-full bg-amber-500 transition-all duration-1000 ease-out" 
                    style={{ width: `${streakPercent}%` }}
                  ></div>
               </div>

               <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                 {streakMessage}
               </p>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-5">
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Quick Actions</h3>
               <div className="space-y-3">
                  <button 
                    onClick={() => onNavigate('setup')} 
                    className="w-full p-3 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 hover:border-indigo-200 dark:hover:border-indigo-500 hover:shadow-sm transition-all flex items-center text-sm font-medium text-slate-700 dark:text-slate-200 group"
                  >
                     <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                        <Plus className="w-5 h-5"/>
                     </div>
                     Generate New
                  </button>

                  <button 
                    onClick={() => onNavigate('saved')} 
                    className="w-full p-3 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 hover:border-purple-200 dark:hover:border-purple-500 hover:shadow-sm transition-all flex items-center text-sm font-medium text-slate-700 dark:text-slate-200 group"
                  >
                     <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                        <CheckCircle2 className="w-5 h-5"/>
                     </div>
                     Saved Routines
                  </button>

                   <button 
                    onClick={() => onNavigate('settings')} 
                    className="w-full p-3 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-500 hover:shadow-sm transition-all flex items-center text-sm font-medium text-slate-700 dark:text-slate-200 group"
                  >
                     <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                        <Settings className="w-5 h-5"/>
                     </div>
                     Settings
                  </button>
               </div>
            </div>

          </div>
        </div>

        {/* Motivation Strip */}
        <div className={`relative overflow-hidden rounded-2xl p-8 bg-gradient-to-r from-${color}-600 to-purple-700 shadow-lg text-center`}>
           {/* Background Decoration */}
           <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
           
           <div className="relative z-10">
              <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-3">Daily Focus</p>
              <h3 className="text-xl md:text-2xl font-bold text-white leading-relaxed max-w-3xl mx-auto">
                 "{quote}"
              </h3>
           </div>
           
           <button 
             onClick={handleRefreshQuote} 
             disabled={isQuoteLoading}
             className="absolute bottom-4 right-4 text-white/50 hover:text-white transition-colors p-2"
             title="New Quote"
           >
              <RefreshCw className={`w-4 h-4 ${isQuoteLoading ? 'animate-spin' : ''}`}/>
           </button>
        </div>

      </div>

      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-fade-in z-50">
           <CheckCircle2 className="w-5 h-5 text-green-500"/>
           <span className="font-medium text-sm">Nice work. Streak updated.</span>
        </div>
      )}
    </div>
  );
};
