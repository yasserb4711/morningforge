import React, { useState } from 'react';
import { AppSettings, UserFormData, GoalType, RoutineResponse, PremiumTheme } from '../types';
import { Button } from './ui/Button';
import { 
  Palette, 
  Type, 
  User, 
  Bell, 
  Shield, 
  Eye, 
  Volume2, 
  RefreshCw, 
  Trash2, 
  Download,
  Check,
  FileText,
  AlertTriangle,
  LogOut,
  Clock,
  Activity,
  Calendar,
  MessageSquare,
  Zap,
  Layout,
  Crown,
  Lock,
  Sun,
  Moon
} from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { useAuth } from '../contexts/AuthContext';

interface SettingsPageProps {
  onClose: () => void;
  userData: UserFormData | null;
  onUpdateUserData: (newData: UserFormData | null) => void;
  onRegenerate: (data: UserFormData) => Promise<void>;
  onResetApp: () => void;
  currentRoutine: RoutineResponse | null;
}

const COLORS = {
  indigo: 'bg-indigo-600',
  purple: 'bg-purple-600',
  teal: 'bg-teal-600',
  rose: 'bg-rose-600',
  amber: 'bg-amber-600',
};

const FREE_THEMES: { id: PremiumTheme; name: string; color: string; desc: string }[] = [
  { id: 'classic', name: 'Classic', color: 'bg-slate-100 border-slate-300', desc: 'Default Look' },
  { id: 'soft_dark', name: 'Soft Dark', color: 'bg-slate-700 border-slate-500', desc: 'Easy on Eyes' },
];

const PREMIUM_THEMES: { id: PremiumTheme; name: string; color: string; desc: string }[] = [
    { id: 'sunrise_gold', name: 'Sunrise Gold', color: 'bg-amber-100 border-amber-400', desc: 'Warm & Energetic' },
    { id: 'neon_focus', name: 'Neon Focus', color: 'bg-purple-900 border-purple-400', desc: 'High Contrast' },
    { id: 'minimal_white', name: 'Minimal White', color: 'bg-white border-gray-200', desc: 'Clean & Stark' },
    { id: 'midnight_deep', name: 'Midnight Deep', color: 'bg-black border-slate-700', desc: 'Pure Black' },
];

export const SettingsPage: React.FC<SettingsPageProps> = ({ 
  onClose,
  userData,
  onUpdateUserData,
  onRegenerate,
  onResetApp,
  currentRoutine
}) => {
  const { settings, updateSettings, resetSettings } = useSettings();
  const { user, togglePro } = useAuth();
  const [activeTab, setActiveTab] = React.useState<'appearance' | 'access' | 'profile' | 'notify' | 'data'>('appearance');
  
  // Local state for profile editing to avoid constant re-renders/saves until "Save"
  const [localProfile, setLocalProfile] = useState<UserFormData | null>(userData);
  const [isProfileDirty, setIsProfileDirty] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    updateSettings({ ...settings, [key]: value });
  };

  const updateNotify = (key: keyof AppSettings['notifications'], value: any) => {
    updateSettings({
      ...settings,
      notifications: { ...settings.notifications, [key]: value }
    });
  };

  const handleProfileChange = (field: keyof UserFormData, value: any) => {
    if (!localProfile) return;
    setLocalProfile({ ...localProfile, [field]: value });
    setIsProfileDirty(true);
  };

  const toggleProfileGoal = (goal: GoalType) => {
    if (!localProfile) return;
    const currentGoals = localProfile.goals;
    const newGoals = currentGoals.includes(goal) 
        ? currentGoals.filter(g => g !== goal)
        : [...currentGoals, goal];
    setLocalProfile({ ...localProfile, goals: newGoals });
    setIsProfileDirty(true);
  };

  const handleSaveProfile = async () => {
    if (localProfile) {
        onUpdateUserData(localProfile);
        setIsProfileDirty(false);
        alert("Profile updated successfully.");
    }
  };

  const handleRegenerateClick = async () => {
     if (localProfile) {
         setIsRegenerating(true);
         await onRegenerate(localProfile);
         setIsRegenerating(false);
         onClose(); // Go to result view
     }
  };

  const handleResetAll = () => {
      if (confirm("Are you sure? This will reset all settings and delete your profile.")) {
          resetSettings();
          onResetApp();
          alert("Reset complete. Your settings are now at default.");
      }
  };

  const handleExportText = () => {
    if (!currentRoutine) return alert("No routine to export.");
    const lines = [
        `MORNING FORGE ROUTINE: ${currentRoutine.title}`,
        `Summary: ${currentRoutine.summary.duration} | Wake: ${currentRoutine.summary.wakeTime}`,
        '----------------------------------------',
        ...currentRoutine.blocks.map(b => `${b.timeRange} - ${b.title}\n* ${b.activities.join('\n* ')}\n`)
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'morning-routine.txt';
    a.click();
  };

  const handleExportPDF = () => {
    if (!currentRoutine) return alert("No routine to export.");
    window.print();
  };

  const TabButton: React.FC<{ id: typeof activeTab, icon: any, label: string }> = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center p-3 rounded-lg mb-2 transition-colors ${
        activeTab === id 
          ? `bg-${settings.accentColor}-50 text-${settings.accentColor}-700 font-medium dark:bg-slate-800 dark:text-${settings.accentColor}-400` 
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
      }`}
    >
      <Icon className="w-5 h-5 mr-3" />
      {label}
    </button>
  );

  const ThemeCard: React.FC<{ theme: { id: PremiumTheme, name: string, color: string, desc: string }, isLocked: boolean }> = ({ theme, isLocked }) => (
    <button
      onClick={() => !isLocked && updateSetting('premiumTheme', theme.id)}
      disabled={isLocked}
      className={`relative w-full p-3 rounded-xl border flex items-center gap-3 transition-all ${
        settings.premiumTheme === theme.id 
          ? 'border-indigo-500 ring-1 ring-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300'
      } ${isLocked ? 'opacity-60 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
    >
      <div className={`w-10 h-10 rounded-full border shadow-sm ${theme.color}`}></div>
      <div className="text-left">
          <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center">
             {theme.name}
             {isLocked && <Lock className="w-3 h-3 ml-2 text-amber-500"/>}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400">{theme.desc}</div>
      </div>
      {settings.premiumTheme === theme.id && (
          <div className="ml-auto text-indigo-600 dark:text-indigo-400">
             <Check className="w-5 h-5"/>
          </div>
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-8 transition-colors pt-20">
      <div className="max-w-5xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden min-h-[600px] flex flex-col md:flex-row">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 p-4 flex-shrink-0">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 px-3">Settings</h2>
          <nav>
            <TabButton id="appearance" icon={Palette} label="Appearance" />
            <TabButton id="access" icon={Eye} label="Accessibility" />
            <TabButton id="profile" icon={User} label="My Profile" />
            <TabButton id="notify" icon={Bell} label="Notifications" />
            <TabButton id="data" icon={Shield} label="Data & Privacy" />
          </nav>
          
          {/* Demo Toggle for Reviewers */}
          <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800">
             <div className="px-3 text-xs uppercase text-slate-400 font-bold mb-2">Demo Controls</div>
             <button 
                onClick={togglePro}
                className={`w-full text-xs p-2 rounded border flex items-center justify-center ${user?.isPro ? 'bg-amber-100 text-amber-700 border-amber-300' : 'bg-slate-100 text-slate-600 border-slate-300'}`}
             >
                {user?.isPro ? 'Pro Active (Click to downgrade)' : 'Free Plan (Click to upgrade)'}
             </button>
          </div>

          <div className="mt-4 px-3 space-y-2">
             <Button variant="outline" fullWidth onClick={onClose}>Close</Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto max-h-[800px] bg-white dark:bg-slate-900 transition-colors">
          
          {/* APPEARANCE */}
          {activeTab === 'appearance' && (
            <div className="space-y-8 animate-fade-in">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Appearance</h3>
              
              {/* Mode Selection (Only visible for Classic theme usually, but kept for control) */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                   <span>Interface Mode</span>
                   {settings.premiumTheme !== 'classic' && (
                       <span className="text-xs font-normal text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Controlled by active theme</span>
                   )}
                </label>
                <div className="flex gap-2">
                  {['light', 'dark', 'auto'].map((mode) => {
                     const isEffective = settings.premiumTheme === 'classic';
                     return (
                        <button
                        key={mode}
                        onClick={() => updateSetting('theme', mode as any)}
                        disabled={!isEffective}
                        className={`px-4 py-2 rounded-lg border capitalize transition-all ${
                            settings.theme === mode && isEffective
                            ? 'bg-slate-800 dark:bg-white text-white dark:text-slate-900 border-slate-800 dark:border-white shadow-md' 
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        } ${!isEffective ? 'opacity-50 cursor-not-allowed' : 'hover:border-slate-300'}`}
                        >
                        {mode}
                        </button>
                    )
                  })}
                </div>
              </div>

              {/* Themes Grid */}
              <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                 
                 {/* Free Themes */}
                 <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center">
                        <Palette className="w-4 h-4 mr-2"/> Free Themes
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-3">
                        {FREE_THEMES.map(theme => (
                            <ThemeCard key={theme.id} theme={theme} isLocked={false} />
                        ))}
                    </div>
                 </div>

                 {/* Premium Themes */}
                 <div>
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center">
                            <Crown className="w-4 h-4 mr-2 text-amber-500"/> Premium Themes
                        </h4>
                        {!user?.isPro && (
                            <span className="text-[10px] font-bold text-white bg-amber-500 px-2 py-0.5 rounded-full">PRO ONLY</span>
                        )}
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                        {PREMIUM_THEMES.map(theme => (
                            <ThemeCard key={theme.id} theme={theme} isLocked={!user?.isPro} />
                        ))}
                    </div>
                 </div>
              </div>

              {/* Accent Color */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Accent Color</label>
                <div className="flex gap-3">
                  {(Object.keys(COLORS) as Array<keyof typeof COLORS>).map((color) => (
                    <button
                      key={color}
                      onClick={() => updateSetting('accentColor', color)}
                      className={`w-10 h-10 rounded-full ${COLORS[color]} flex items-center justify-center transition-transform hover:scale-110 ring-offset-2 ${
                        settings.accentColor === color ? 'ring-2 ring-slate-400 dark:ring-slate-500 scale-110' : ''
                      }`}
                      title={color}
                    >
                      {settings.accentColor === color && <Check className="text-white w-5 h-5" />}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Text Size */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                  <Type className="w-4 h-4 mr-2" /> Text Size
                </label>
                <input 
                  type="range" 
                  min="0" max="3" 
                  value={['sm', 'md', 'lg', 'xl'].indexOf(settings.fontSize)}
                  onChange={(e) => {
                    const sizes = ['sm', 'md', 'lg', 'xl'] as const;
                    updateSetting('fontSize', sizes[parseInt(e.target.value)]);
                  }}
                  className={`w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-${settings.accentColor}-600`}
                />
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <span>Small</span>
                  <span>Normal</span>
                  <span>Large</span>
                  <span>Extra Large</span>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                 <div className="flex items-center justify-between">
                    <div>
                        <div className="font-semibold text-slate-900 dark:text-white">High Contrast Mode</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">Increases contrast and text weight</div>
                    </div>
                    <button
                      onClick={() => updateSetting('highContrast', !settings.highContrast)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${
                        settings.highContrast ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-700'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${
                        settings.highContrast ? 'left-7' : 'left-1'
                      }`} />
                    </button>
                 </div>
              </div>
            </div>
          )}

          {/* ACCESSIBILITY */}
          {activeTab === 'access' && (
            <div className="space-y-8 animate-fade-in">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Accessibility</h3>
              
              <div className="space-y-6">
                {[
                  { key: 'ttsEnabled', label: 'Text-to-Speech Ready', desc: 'Adds play buttons to read your routine aloud.' },
                  { key: 'simplifiedMode', label: 'Simplified Mode', desc: 'Hides detailed explanations for reduced cognitive load.' },
                  { key: 'dyslexiaFont', label: 'Dyslexia Friendly Font', desc: 'Changes font to Comic Sans / Chalkboard for readability.' },
                  { key: 'reducedMotion', label: 'Reduced Motion', desc: 'Disables most animations and transitions.' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-slate-800">
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">{item.label}</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</div>
                    </div>
                    <button
                      onClick={() => updateSetting(item.key as keyof AppSettings, !settings[item.key as keyof AppSettings])}
                      className={`w-12 h-6 rounded-full transition-colors relative ${
                        settings[item.key as keyof AppSettings] ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-700'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${
                        settings[item.key as keyof AppSettings] ? 'left-7' : 'left-1'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex items-center justify-between">
                 <h3 className="text-2xl font-bold text-slate-900 dark:text-white">User Profile</h3>
                 {localProfile && isProfileDirty && (
                     <span className="text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded border border-amber-200">Unsaved Changes</span>
                 )}
              </div>
              
              {localProfile ? (
                <div className="space-y-8">
                  
                  {/* Bio Stats */}
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl space-y-4">
                     <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center">
                        <User className="w-4 h-4 mr-2"/> Bio Stats
                     </h4>
                     <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Age</label>
                        <input 
                          type="number" 
                          value={localProfile.age} 
                          onChange={e => handleProfileChange('age', parseInt(e.target.value))}
                          className="w-full mt-1 p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Weight ({localProfile.weightUnit})</label>
                        <input 
                          type="number" 
                          value={localProfile.weight}
                          onChange={e => handleProfileChange('weight', parseInt(e.target.value))}
                          className="w-full mt-1 p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Height</label>
                         <input 
                          type="text" 
                          value={localProfile.height || ''} 
                          placeholder="e.g. 5'11"
                          onChange={e => handleProfileChange('height', e.target.value)}
                          className="w-full mt-1 p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-white text-sm"
                        />
                      </div>
                     </div>
                  </div>

                  {/* Schedule */}
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl space-y-4">
                     <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center">
                        <Clock className="w-4 h-4 mr-2"/> Schedule
                     </h4>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                       <div className="md:col-span-2">
                          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Occupation</label>
                          <select 
                            value={localProfile.occupation}
                            onChange={e => handleProfileChange('occupation', e.target.value)}
                            className="w-full mt-1 p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-white text-sm"
                          >
                             <option value="School">School</option>
                             <option value="Work">Work</option>
                             <option value="Neither">Neither</option>
                          </select>
                       </div>
                       <div className="md:col-span-2">
                          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Starts At</label>
                          <input 
                            type="time" 
                            value={localProfile.startTime} 
                            onChange={e => handleProfileChange('startTime', e.target.value)}
                            className="w-full mt-1 p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-white text-sm"
                          />
                       </div>
                       <div>
                          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Wake Up</label>
                          <input 
                            type="time" 
                            value={localProfile.wakeTime} 
                            onChange={e => handleProfileChange('wakeTime', e.target.value)}
                            className="w-full mt-1 p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-white text-sm"
                          />
                       </div>
                       <div>
                          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Leave By</label>
                          <input 
                            type="time" 
                            value={localProfile.leaveTime} 
                            onChange={e => handleProfileChange('leaveTime', e.target.value)}
                            className="w-full mt-1 p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-white text-sm"
                          />
                       </div>
                     </div>
                  </div>

                  {/* Routine Strategy */}
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl space-y-4">
                     <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center">
                        <Activity className="w-4 h-4 mr-2"/> Strategy & Limits
                     </h4>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Max Duration</label>
                           <select 
                             value={localProfile.maxDuration}
                             onChange={e => handleProfileChange('maxDuration', parseInt(e.target.value))}
                             className="w-full mt-1 p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-white text-sm"
                           >
                              <option value="20">20 Minutes</option>
                              <option value="30">30 Minutes</option>
                              <option value="45">45 Minutes</option>
                              <option value="60">60 Minutes</option>
                           </select>
                        </div>
                        <div>
                           <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Style</label>
                           <select 
                             value={localProfile.routineStyle}
                             onChange={e => handleProfileChange('routineStyle', e.target.value)}
                             className="w-full mt-1 p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-white text-sm"
                           >
                              <option value="Chill">Chill</option>
                              <option value="Efficient">Efficient</option>
                              <option value="Hardcore">Hardcore</option>
                           </select>
                        </div>
                     </div>
                     <div>
                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Injuries / Limitations</label>
                        <input 
                           type="text" 
                           value={localProfile.injuries || ''} 
                           onChange={e => handleProfileChange('injuries', e.target.value)}
                           placeholder="e.g. Bad knees, asthma"
                           className="w-full mt-1 p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-white text-sm"
                        />
                     </div>
                  </div>

                   {/* Fitness Details */}
                   <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl space-y-4">
                     <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center">
                        <Activity className="w-4 h-4 mr-2"/> Equipment
                     </h4>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Gym Access</label>
                           <select 
                             value={localProfile.gymAccess || ''}
                             onChange={e => handleProfileChange('gymAccess', e.target.value)}
                             className="w-full mt-1 p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-white text-sm"
                           >
                              <option value="">None / Select</option>
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                           </select>
                        </div>
                         <div>
                           <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Fitness Level</label>
                           <select 
                             value={localProfile.fitnessLevel || ''}
                             onChange={e => handleProfileChange('fitnessLevel', e.target.value)}
                             className="w-full mt-1 p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-white text-sm"
                           >
                              <option value="">None / Select</option>
                              <option value="Beginner">Beginner</option>
                              <option value="Intermediate">Intermediate</option>
                              <option value="Advanced">Advanced</option>
                           </select>
                        </div>
                     </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-bold text-slate-900 dark:text-white mb-2 block flex items-center"><Check className="w-4 h-4 mr-2"/> Active Goals</label>
                    <div className="flex flex-wrap gap-2">
                        {Object.values(GoalType).map((goal) => (
                             <button
                                key={goal}
                                onClick={() => toggleProfileGoal(goal)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                                    localProfile.goals.includes(goal)
                                    ? `bg-${settings.accentColor}-600 text-white border-${settings.accentColor}-600`
                                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600'
                                }`}
                             >
                                {goal}
                             </button>
                        ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 sticky bottom-0 bg-white dark:bg-slate-900 pb-2">
                      <Button onClick={handleSaveProfile} disabled={!isProfileDirty} className="w-full">
                         <Check className="w-4 h-4 mr-2"/> Save Profile
                      </Button>
                      <Button 
                        onClick={handleRegenerateClick} 
                        disabled={isProfileDirty || isRegenerating} 
                        variant="secondary" 
                        className="w-full"
                      >
                         <RefreshCw className={`w-4 h-4 mr-2 ${isRegenerating ? 'animate-spin' : ''}`}/> Regenerate Routine
                      </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-slate-500">
                  <User className="w-12 h-12 mx-auto mb-3 opacity-50"/>
                  <p>No profile data yet. Complete the setup wizard first.</p>
                </div>
              )}
            </div>
          )}

          {/* NOTIFICATIONS */}
          {activeTab === 'notify' && (
            <div className="space-y-8 animate-fade-in">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Notifications</h3>
              
              <div className="space-y-6 text-slate-700 dark:text-slate-300">
                <div className="p-4 bg-indigo-50 dark:bg-slate-800 rounded-lg mb-4 text-sm">
                   <AlertTriangle className="w-4 h-4 inline mr-2 text-indigo-600"/>
                   Note: As this is a demo, notifications are simulated in the UI.
                </div>

                {/* 1. Motivational Quote Pop-Up */}
                <div className="flex items-start justify-between py-4 border-b border-slate-50 dark:border-slate-800">
                   <div className="pr-4">
                       <div className="font-medium flex items-center text-slate-900 dark:text-white">
                           <MessageSquare className="w-4 h-4 mr-2 text-purple-500"/> Motivational Quote Pop-Up
                       </div>
                       <div className="text-xs text-slate-500 mt-1">Show a floating motivational quote when I open MorningForge.</div>
                   </div>
                   <input 
                       type="checkbox" 
                       checked={settings.notifications.welcomeQuote} 
                       onChange={e => updateNotify('welcomeQuote', e.target.checked)} 
                       className={`w-5 h-5 accent-${settings.accentColor}-600 mt-1 cursor-pointer`}
                   />
                </div>

                 {/* 2. Streak Messages */}
                <div className="flex items-start justify-between py-4 border-b border-slate-50 dark:border-slate-800">
                   <div className="pr-4">
                       <div className="font-medium flex items-center text-slate-900 dark:text-white">
                           <Zap className="w-4 h-4 mr-2 text-amber-500"/> Streak Messages
                       </div>
                       <div className="text-xs text-slate-500 mt-1">Show achievements for 3, 7, 14, 30 day streaks.</div>
                   </div>
                   <input 
                       type="checkbox" 
                       checked={settings.notifications.streak} 
                       onChange={e => updateNotify('streak', e.target.checked)} 
                       className={`w-5 h-5 accent-${settings.accentColor}-600 mt-1 cursor-pointer`}
                   />
                </div>

                 {/* 3. Motivational Reminders */}
                <div className="flex items-start justify-between py-4 border-b border-slate-50 dark:border-slate-800">
                   <div className="pr-4">
                       <div className="font-medium flex items-center text-slate-900 dark:text-white">
                           <Bell className="w-4 h-4 mr-2 text-rose-500"/> Motivational Reminders
                       </div>
                       <div className="text-xs text-slate-500 mt-1">Occasional small reminders in-app (e.g. "Discipline beats talent").</div>
                   </div>
                   <input 
                       type="checkbox" 
                       checked={settings.notifications.motivation} 
                       onChange={e => updateNotify('motivation', e.target.checked)} 
                       className={`w-5 h-5 accent-${settings.accentColor}-600 mt-1 cursor-pointer`}
                   />
                </div>

                 {/* 4. Routine Summaries */}
                 <div className="flex items-start justify-between py-4 border-b border-slate-50 dark:border-slate-800">
                   <div className="pr-4">
                       <div className="font-medium flex items-center text-slate-900 dark:text-white">
                           <Layout className="w-4 h-4 mr-2 text-teal-500"/> Routine Summaries
                       </div>
                       <div className="text-xs text-slate-500 mt-1">Show a summary breakdown after generating a new routine.</div>
                   </div>
                   <input 
                       type="checkbox" 
                       checked={settings.notifications.routineSummary} 
                       onChange={e => updateNotify('routineSummary', e.target.checked)} 
                       className={`w-5 h-5 accent-${settings.accentColor}-600 mt-1 cursor-pointer`}
                   />
                </div>
                
                {/* Email (Legacy/Existing) */}
                <div className="flex items-center justify-between py-4">
                   <div>
                       <div className="font-medium text-slate-900 dark:text-white">Email Daily Reminder</div>
                       <div className="text-xs text-slate-500 mt-1">Get your routine emailed to you every morning.</div>
                   </div>
                   <input type="checkbox" checked={settings.notifications.email} onChange={e => updateNotify('email', e.target.checked)} className={`w-5 h-5 accent-${settings.accentColor}-600`}/>
                </div>
                {settings.notifications.email && (
                  <div className="ml-6 p-4 border-l-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-r-lg">
                    <label className="text-sm text-slate-600 dark:text-slate-400 block mb-1">Time to send email:</label>
                    <input type="time" value={settings.notifications.reminderTime} onChange={e => updateNotify('reminderTime', e.target.value)} className="p-2 border rounded bg-white dark:bg-slate-900 dark:text-white dark:border-slate-600"/>
                    <div className="text-xs text-green-600 mt-2 font-medium">✓ Reminder set for {settings.notifications.reminderTime}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* DATA */}
          {activeTab === 'data' && (
             <div className="space-y-8 animate-fade-in">
             <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Data & Privacy</h3>
             
             <div className="space-y-4">
               <Button variant="outline" fullWidth onClick={handleExportPDF} disabled={!currentRoutine}>
                 <FileText className="w-4 h-4 mr-2"/> Export Routine as PDF
               </Button>
               <Button variant="outline" fullWidth onClick={handleExportText} disabled={!currentRoutine}>
                 <Download className="w-4 h-4 mr-2"/> Export Routine as Text
               </Button>
               
               <div className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-6">
                 <h4 className="font-bold text-red-600 mb-2 flex items-center"><AlertTriangle className="w-4 h-4 mr-2"/> Danger Zone</h4>
                 <div className="space-y-3">
                    <Button variant="ghost" className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full justify-start border border-red-100 dark:border-red-900" onClick={() => { onUpdateUserData(null); alert("Profile deleted."); }}>
                        <Trash2 className="w-4 h-4 mr-2"/> Delete Profile Data
                    </Button>
                    <Button variant="ghost" className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full justify-start border border-red-100 dark:border-red-900" onClick={handleResetAll}>
                        <LogOut className="w-4 h-4 mr-2"/> Reset App to Default
                    </Button>
                 </div>
               </div>
             </div>
           </div>
          )}
        </div>
      </div>
    </div>
  );
};