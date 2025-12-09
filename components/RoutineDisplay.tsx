
import React, { useState } from 'react';
import { RoutineResponse, SavedRoutine, GoalType } from '../types';
import { Button } from './ui/Button';
import { Sun, Dumbbell, Brain, Briefcase, Coffee, CheckSquare, RefreshCw, Download, ChevronDown, ChevronUp, Edit2, Save, PlayCircle, Volume2, X } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { useAuth } from '../contexts/AuthContext';
import { saveRoutine } from '../services/storageService';

interface RoutineDisplayProps {
  routine: RoutineResponse;
  onReset: () => void;
  onRegenerate: () => void;
  isLoading: boolean;
  simplifiedMode?: boolean;
}

const IconMap: Record<string, React.ElementType> = {
  wake: Sun,
  move: Dumbbell,
  mind: Brain,
  money: Briefcase,
  prepare: Coffee,
  other: CheckSquare
};

export const RoutineDisplay: React.FC<RoutineDisplayProps> = ({ 
  routine, 
  onReset, 
  onRegenerate, 
  isLoading,
  simplifiedMode = false 
}) => {
  const { settings } = useSettings();
  const { user, isAuthenticated } = useAuth();
  const color = settings.accentColor;
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveName, setSaveName] = useState(routine.title);
  
  // Calculate total minutes roughly based on duration string
  const totalMinutes = parseInt(routine.summary.duration) || 60; 
  
  // Dynamic colors
  const textAccent = `text-${color}-600`;
  const bgAccentLight = `bg-${color}-50`;
  const bgAccent = `bg-${color}-600`;
  const textAccentDark = `text-${color}-400`;

  const toggleCollapse = (index: number) => {
    setCollapsed(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSave = () => {
    if (!isAuthenticated || !user) {
      alert("Please log in to save routines.");
      return;
    }
    
    const newSavedRoutine: SavedRoutine = {
      ...routine,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      goals: [], // Goals are implicit in generation, could be passed as prop if needed
      style: 'Efficient' // Default fallback
    };
    
    // Override title with custom name
    newSavedRoutine.title = saveName;

    saveRoutine(user.id, newSavedRoutine);
    setShowSaveModal(false);
    alert("Routine Saved!");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 pt-24 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className={`${textAccent} dark:${textAccentDark} font-bold uppercase tracking-wide text-sm`}>Your Plan</h2>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">{routine.title}</h1>
        </div>

        {/* Summary Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-xs text-slate-500 uppercase font-semibold">Wake Up</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">{routine.summary.wakeTime}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 uppercase font-semibold">Total Time</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">{routine.summary.duration}</div>
          </div>
           <div>
            <div className="text-xs text-slate-500 uppercase font-semibold">Sleep Window</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white">{routine.summary.sleepTarget}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 uppercase font-semibold">Main Focus</div>
            <div className={`text-sm font-bold ${textAccent} dark:${textAccentDark} truncate px-2`}>{routine.summary.focus}</div>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-4 relative">
          <div className="absolute left-6 md:left-8 top-4 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>

          {routine.blocks.map((block, index) => {
            const Icon = IconMap[block.icon] || IconMap.other;
            const isCollapsed = collapsed[index];

            return (
              <div key={index} className="relative sm:pl-20">
                <div className={`absolute left-4 top-6 w-8 h-8 rounded-full bg-white dark:bg-slate-900 border-4 border-slate-100 dark:border-slate-700 hidden sm:flex items-center justify-center z-10`}>
                  <div className={`w-3 h-3 ${bgAccent} rounded-full`}></div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-md transition-shadow">
                  <div 
                    className="p-4 sm:p-6 flex items-center justify-between cursor-pointer bg-white dark:bg-slate-900"
                    onClick={() => toggleCollapse(index)}
                  >
                     <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full ${bgAccentLight} dark:bg-slate-800 flex items-center justify-center ${textAccent} dark:${textAccentDark} flex-shrink-0`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white">{block.title}</h3>
                            <span className={`${bgAccentLight} dark:bg-slate-800 ${textAccent} dark:${textAccentDark} text-xs font-bold px-2 py-0.5 rounded`}>
                              {block.timeRange}
                            </span>
                          </div>
                          {simplifiedMode && (
                             <div className="text-xs text-slate-500 mt-1">{block.activities[0]}...</div>
                          )}
                        </div>
                     </div>
                     <div className="flex items-center gap-2">
                       {settings.ttsEnabled && (
                         <button 
                           onClick={(e) => { e.stopPropagation(); speak(`${block.title}. ${block.activities.join('. ')}. ${block.explanation}`); }} 
                           className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                         >
                           <Volume2 className="w-4 h-4"/>
                         </button>
                       )}
                       {isCollapsed ? <ChevronDown className="w-5 h-5 text-slate-400"/> : <ChevronUp className="w-5 h-5 text-slate-400"/>}
                     </div>
                  </div>
                  
                  {!isCollapsed && (
                    <div className="px-6 pb-6 pt-0 border-t border-slate-50 dark:border-slate-800 mt-2 animate-fade-in">
                      <div className="space-y-3 mt-4">
                        {block.activities.map((act, i) => (
                          <div key={i} className="flex items-start text-slate-700 dark:text-slate-300">
                            <CheckSquare className={`w-4 h-4 mr-2 mt-1 ${textAccent} dark:${textAccentDark} flex-shrink-0`} />
                            <span className="text-sm font-medium">{act}</span>
                          </div>
                        ))}
                      </div>

                      {!simplifiedMode && (
                        <p className="text-xs text-slate-500 italic border-l-2 border-slate-200 dark:border-slate-700 pl-3 mt-4">
                          Why: {block.explanation}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-8">
          <Button variant="outline" fullWidth onClick={onReset}>
            Start Over
          </Button>
          <Button variant="secondary" fullWidth onClick={onRegenerate} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Forging...' : 'Regenerate'}
          </Button>
          
          {isAuthenticated ? (
            <Button fullWidth onClick={() => setShowSaveModal(true)}>
              <Save className="w-4 h-4 mr-2" /> Save Routine
            </Button>
          ) : (
            <Button fullWidth variant="ghost" disabled title="Log in to save">
               Log in to Save
            </Button>
          )}
        </div>

      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
           <div className="bg-white dark:bg-slate-900 rounded-xl p-6 w-full max-w-sm shadow-xl">
              <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Save Routine</h3>
              <input 
                value={saveName} 
                onChange={(e) => setSaveName(e.target.value)} 
                className="w-full p-2 border rounded mb-4 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                placeholder="Routine Name"
              />
              <div className="flex justify-end gap-2">
                 <Button variant="outline" onClick={() => setShowSaveModal(false)}>Cancel</Button>
                 <Button onClick={handleSave}>Save</Button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
