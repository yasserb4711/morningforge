import React, { useState } from 'react';
import { UserFormData, GoalType } from '../types';
import { Button } from './ui/Button';
import { ArrowLeft, ArrowRight, Dumbbell, Briefcase, Brain, Zap, DollarSign, Heart, AlertCircle } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

interface SetupFormProps {
  onSubmit: (data: UserFormData) => void;
  isLoading: boolean;
}

const initialData: UserFormData = {
  age: 18,
  gender: 'Prefer not to say',
  weight: 70,
  weightUnit: 'kg',
  occupation: 'School',
  startTime: '08:00',
  wakeTime: '06:00',
  sleepHours: 8,
  goals: [],
  maxDuration: 45,
  leaveTime: '07:30',
  routineStyle: 'Efficient'
};

export const SetupForm: React.FC<SetupFormProps> = ({ onSubmit, isLoading }) => {
  const { settings } = useSettings();
  const color = settings.accentColor;
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<UserFormData>(initialData);
  const [goalWarning, setGoalWarning] = useState<string | null>(null);

  const updateField = (field: keyof UserFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleGoal = (goal: GoalType) => {
    setFormData(prev => {
      // If already selected, deselect
      if (prev.goals.includes(goal)) {
         return { ...prev, goals: prev.goals.filter(g => g !== goal) };
      }
      
      // If adding, check limit
      if (prev.goals.length >= 3) {
         setGoalWarning("You can pick up to 3 goals max for better focus.");
         setTimeout(() => setGoalWarning(null), 3000);
         return prev; // No change
      }

      return { ...prev, goals: [...prev.goals, goal] };
    });
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const isGoalSelected = (goal: GoalType) => formData.goals.includes(goal);

  // Dynamic classes based on accent color
  const activeBorder = `focus:ring-${color}-500 focus:border-${color}-500`;
  const activeBg = `bg-${color}-600`;
  const activeText = `text-${color}-600`;
  const activeBorderColor = `border-${color}-500`;
  const activeLightBg = `bg-${color}-50`;
  
  // Card styles for Goals
  const cardBase = "relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer h-32 hover:scale-[1.02] active:scale-[0.98]";
  const cardSelected = `${activeBg} border-${color}-600 text-white shadow-lg shadow-${color}-200 dark:shadow-none`;
  const cardUnselected = "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 transition-colors">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        
        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5">
          <div 
            className={`${activeBg} h-1.5 transition-all duration-500 ease-out`}
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        <div className="p-4 sm:p-8">
          
          {/* STEP 1: BASIC INFO */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-1">
                <span className={`text-xs font-bold uppercase tracking-wider ${activeText}`}>Step 1 / 4</span>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Let's get the basics right.</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Age</label>
                  <input 
                    type="number" 
                    value={formData.age} 
                    onChange={e => updateField('age', parseInt(e.target.value))}
                    className={`w-full p-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 ${activeBorder} outline-none transition-shadow`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Gender</label>
                  <select 
                    value={formData.gender} 
                    onChange={e => updateField('gender', e.target.value)}
                    className={`w-full p-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 ${activeBorder} outline-none transition-shadow`}
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Prefer not to say</option>
                  </select>
                </div>
                <div className="md:col-span-2 flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Weight</label>
                    <input 
                      type="number" 
                      value={formData.weight}
                      onChange={e => updateField('weight', parseInt(e.target.value))}
                      className={`w-full p-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 ${activeBorder} outline-none transition-shadow`}
                    />
                  </div>
                  <div className="w-24">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Unit</label>
                    <select 
                      value={formData.weightUnit} 
                      onChange={e => updateField('weightUnit', e.target.value)}
                      className={`w-full p-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 ${activeBorder} outline-none transition-shadow`}
                    >
                      <option value="kg">kg</option>
                      <option value="lbs">lbs</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: SCHEDULE */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-1">
                <span className={`text-xs font-bold uppercase tracking-wider ${activeText}`}>Step 2 / 4</span>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Define your battlefield.</h2>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Occupation</label>
                <div className="flex gap-4">
                  {['School', 'Work', 'Neither'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => updateField('occupation', opt)}
                      className={`flex-1 py-3 px-4 rounded-lg border transition-all duration-200 ${
                        formData.occupation === opt 
                          ? `${activeLightBg} dark:bg-slate-800 ${activeBorderColor} ${activeText} font-bold shadow-sm ring-1 ring-${color}-500` 
                          : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Starts at</label>
                  <input 
                    type="time" 
                    value={formData.startTime}
                    onChange={e => updateField('startTime', e.target.value)}
                    className={`w-full p-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 ${activeBorder} outline-none transition-shadow`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">I usually wake up at</label>
                  <input 
                    type="time" 
                    value={formData.wakeTime}
                    onChange={e => updateField('wakeTime', e.target.value)}
                    className={`w-full p-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 ${activeBorder} outline-none transition-shadow`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Desired Sleep Hours: {formData.sleepHours}h</label>
                <input 
                  type="range" 
                  min="5" 
                  max="10" 
                  step="0.5"
                  value={formData.sleepHours}
                  onChange={e => updateField('sleepHours', parseFloat(e.target.value))}
                  className={`w-full accent-${color}-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer`}
                />
                <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
                  <span>5h (Zombie)</span>
                  <span>10h (Hibernation)</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: GOALS (UPDATED UI) */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                   <span className={`text-xs font-bold uppercase tracking-wider ${activeText}`}>Step 3 / 4</span>
                   <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Choose your mission.</h2>
                </div>
                {/* Counter Pill */}
                <div className={`text-xs font-bold px-3 py-1 rounded-full ${formData.goals.length === 3 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                    {formData.goals.length} / 3 Selected
                </div>
              </div>
              
              {/* Warning Message */}
              {goalWarning && (
                  <div className="flex items-center p-3 text-sm text-amber-700 bg-amber-50 rounded-lg border border-amber-200 animate-pulse">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {goalWarning}
                  </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { id: GoalType.MUSCLE, icon: Dumbbell, label: 'Build Muscle' },
                  { id: GoalType.WEIGHT_LOSS, icon: Heart, label: 'Lose Weight' },
                  { id: GoalType.TESTOSTERONE, icon: Zap, label: 'Boost Energy' },
                  { id: GoalType.MONEY, icon: DollarSign, label: 'Money & Biz' },
                  { id: GoalType.DISCIPLINE, icon: Briefcase, label: 'Discipline' },
                  { id: GoalType.MENTAL, icon: Brain, label: 'Mental Clarity' },
                ].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleGoal(item.id)}
                    className={`${cardBase} ${isGoalSelected(item.id) ? cardSelected : cardUnselected} ${(!isGoalSelected(item.id) && formData.goals.length >= 3) ? 'opacity-50 grayscale cursor-not-allowed hover:scale-100' : ''}`}
                  >
                    <item.icon className={`w-8 h-8 mb-3 ${isGoalSelected(item.id) ? 'text-white' : activeText}`} strokeWidth={1.5} />
                    <span className="text-sm font-semibold text-center leading-tight">{item.label}</span>
                    {isGoalSelected(item.id) && (
                        <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full shadow-sm animate-pulse"/>
                    )}
                  </div>
                ))}
              </div>

              {/* Conditional Inputs based on Goals with Fade In */}
              {(isGoalSelected(GoalType.MUSCLE) || isGoalSelected(GoalType.MONEY)) && (
                <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800 animate-fade-in">
                    
                    {isGoalSelected(GoalType.MUSCLE) && (
                    <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-xl space-y-3 border border-slate-100 dark:border-slate-700">
                        <h3 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center"><Dumbbell className="w-4 h-4 mr-2"/> Muscle Details</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <select 
                            className="w-full p-2.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                            onChange={(e) => updateField('gymAccess', e.target.value)}
                            defaultValue={formData.gymAccess || ""}
                            >
                            <option value="">Gym Access?</option>
                            <option value="Yes">Yes, in morning</option>
                            <option value="No">No / Home only</option>
                            </select>
                            <select 
                            className="w-full p-2.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                            onChange={(e) => updateField('fitnessLevel', e.target.value)}
                            defaultValue={formData.fitnessLevel || ""}
                            >
                            <option value="">Level?</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                            </select>
                        </div>
                    </div>
                    )}
                    
                    {isGoalSelected(GoalType.MONEY) && (
                    <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-xl space-y-3 border border-slate-100 dark:border-slate-700">
                        <h3 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center"><DollarSign className="w-4 h-4 mr-2"/> Hustle Details</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <select 
                            className="w-full p-2.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                            onChange={(e) => updateField('moneyFocus', e.target.value)}
                            defaultValue={formData.moneyFocus || ""}
                            >
                            <option value="">Focus?</option>
                            <option value="Business">Business</option>
                            <option value="Skill">Learning Skill</option>
                            <option value="Side hustle">Side Hustle</option>
                            </select>
                            <select 
                            className="w-full p-2.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                            onChange={(e) => updateField('workDuration', parseInt(e.target.value))}
                            defaultValue={formData.workDuration || 15}
                            >
                            <option value="15">15 mins</option>
                            <option value="30">30 mins</option>
                            <option value="45">45 mins</option>
                            <option value="60">60+ mins</option>
                            </select>
                        </div>
                    </div>
                    )}
                </div>
              )}
            </div>
          )}

          {/* STEP 4: LIMITS */}
          {step === 4 && (
            <div className="space-y-6 animate-fade-in">
               <div className="space-y-1">
                 <span className={`text-xs font-bold uppercase tracking-wider ${activeText}`}>Step 4 / 4</span>
                 <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Final adjustments.</h2>
               </div>
               
               <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Max Routine Duration</label>
                <div className="flex gap-2">
                  {[20, 30, 45, 60].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => updateField('maxDuration', mins)}
                      className={`flex-1 py-3 px-2 rounded-lg border text-sm transition-all duration-200 ${
                        formData.maxDuration === mins 
                          ? `${activeBg} border-${color}-600 text-white shadow-md ring-1 ring-${color}-400` 
                          : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
               </div>

               <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Must leave house by</label>
                  <input 
                    type="time" 
                    value={formData.leaveTime}
                    onChange={e => updateField('leaveTime', e.target.value)}
                    className={`w-full p-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 ${activeBorder} outline-none transition-shadow`}
                  />
               </div>

               <div>
                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Routine Style</label>
                 <div className="flex gap-2">
                    {['Chill', 'Efficient', 'Hardcore'].map((style) => (
                      <button
                        key={style}
                        onClick={() => updateField('routineStyle', style)}
                        className={`flex-1 py-3 px-2 rounded-lg border text-sm transition-all duration-200 ${
                          formData.routineStyle === style 
                            ? 'bg-slate-800 dark:bg-slate-700 border-slate-800 dark:border-slate-600 text-white shadow-md' 
                            : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
               </div>

               <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Injuries / Health Issues (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Bad knees, asthma"
                    value={formData.injuries || ''}
                    onChange={e => updateField('injuries', e.target.value)}
                    className={`w-full p-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 ${activeBorder} outline-none transition-shadow`}
                  />
               </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-6 bg-slate-50 dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 flex justify-between">
          {step > 1 ? (
             <Button variant="outline" onClick={prevStep} disabled={isLoading}>
               <ArrowLeft className="w-4 h-4 mr-2"/> Back
             </Button>
          ) : (
            <div/> // Spacer
          )}
          
          {step < 4 ? (
             <Button onClick={nextStep}>
               Next <ArrowRight className="w-4 h-4 ml-2"/>
             </Button>
          ) : (
            <Button onClick={() => onSubmit(formData)} disabled={isLoading} className={`${activeBg} hover:opacity-90 shadow-lg shadow-${color}-200/50 dark:shadow-none`}>
               {isLoading ? 'Forging Routine...' : 'Generate Routine'}
            </Button>
          )}
        </div>

      </div>
    </div>
  );
};