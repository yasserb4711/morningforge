import React from 'react';
import { Button } from './ui/Button';
import { ArrowRight, CheckCircle2, Brain, Zap, Clock, Dumbbell, Wallet, Briefcase, GraduationCap, Trophy, BarChart3, Settings, Moon, Shield, Download } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

interface HeroProps {
  onStart: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStart }) => {
  const { settings } = useSettings();
  const color = settings.accentColor;

  const textColors: Record<string, string> = {
    indigo: 'text-indigo-600',
    purple: 'text-purple-600',
    teal: 'text-teal-600',
    rose: 'text-rose-600',
    amber: 'text-amber-600',
  };
  
  const textAccent = textColors[color];
  // Simple mapping for background blobs (using generic colors for simplicity as tailwind arbitrary values can be complex)
  const blobColor = color === 'teal' ? 'bg-teal-50' : color === 'rose' ? 'bg-rose-50' : 'bg-indigo-50';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 overflow-x-hidden transition-colors">
      
      {/* 1. HERO MAIN */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-900 pt-16 pb-20 lg:pb-32 transition-colors">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className={`absolute -top-40 -right-40 w-96 h-96 ${blobColor} rounded-full blur-3xl opacity-50 dark:opacity-20`}></div>
          <div className="absolute top-20 -left-20 w-72 h-72 bg-blue-50 dark:bg-slate-800 rounded-full blur-3xl opacity-50 dark:opacity-20"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className={`${textAccent} font-bold tracking-wide uppercase text-sm mb-4`}>Morning Forge</h2>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
            Build Your Perfect <br className="hidden sm:block" />
            <span className={`${textAccent}`}>Morning Routine.</span>
          </h1>
          <p className="mt-4 text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10">
            Tell us your schedule and goals. We’ll forge a morning routine that actually fits your life. No fluff. Specific, timed, and actionable.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" onClick={onStart} className={`shadow-lg shadow-${color}-200 dark:shadow-none`}>
              Start Free Routine Setup
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-6 text-slate-400 dark:text-slate-500 text-sm font-medium">
             <div className="flex items-center"><CheckCircle2 className={`w-4 h-4 mr-2 ${textAccent}`}/> Scientific Habits</div>
             <div className="flex items-center"><CheckCircle2 className={`w-4 h-4 mr-2 ${textAccent}`}/> Schedule Adaptive</div>
             <div className="flex items-center"><CheckCircle2 className={`w-4 h-4 mr-2 ${textAccent}`}/> Realistic Growth</div>
          </div>
        </div>
      </div>

      {/* 2. WHAT IS MORNING FORGE */}
      <div className="py-20 bg-slate-50 dark:bg-slate-950 transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-12">
             <h2 className="text-3xl font-bold text-slate-900 dark:text-white">What is MorningForge?</h2>
             <div className={`w-16 h-1 bg-${color}-600 mx-auto mt-4 rounded-full`}></div>
           </div>
           <p className="text-lg text-slate-600 dark:text-slate-300 text-center max-w-3xl mx-auto leading-relaxed">
             MorningForge is an intelligent morning routine generator that builds <strong>personalized, realistic routines</strong> based on your schedule, age, goals, and lifestyle.
             It adapts to students, workers, athletes, and anyone who wants structure. Unlike generic "5 AM Club" advice, we calculate the best plan for <em>your</em> specific wake-up time and constraints.
           </p>
        </div>
      </div>

      {/* 3. WHY THIS WORKS */}
      <div className="py-20 bg-white dark:bg-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
             <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Why This Works</h2>
             <p className="mt-4 text-slate-600 dark:text-slate-400">Small consistent habits beat massive unrealistic changes.</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
             {[
               { icon: Brain, title: "Brain Priming", text: "Your brain follows structure better in the morning, setting the tone for the day." },
               { icon: Clock, title: "Time Boxing", text: "Routines based on YOUR schedule are sustainable. We don't force 4 AM wakeups." },
               { icon: Zap, title: "Momentum", text: "Winning the first hour creates a domino effect of productivity." },
               { icon: Dumbbell, title: "Physique", text: "Consistent morning movement, even for 15 mins, compounds over a year." }
             ].map((item, i) => (
               <div key={i} className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-shadow">
                 <div className={`w-12 h-12 bg-white dark:bg-slate-700 rounded-xl shadow-sm flex items-center justify-center ${textAccent} mb-4`}>
                   <item.icon className="w-6 h-6"/>
                 </div>
                 <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                 <p className="text-slate-600 dark:text-slate-400">{item.text}</p>
               </div>
             ))}
           </div>
        </div>
      </div>

      {/* 4. WHO IS THIS FOR? */}
      <div className="py-20 bg-slate-900 dark:bg-slate-950 text-white transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
             <h2 className="text-3xl font-bold">Who is this for?</h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[
               { icon: GraduationCap, title: "Students", text: "Balance early classes with study time and fitness. Stop sleeping through alarms." },
               { icon: Briefcase, title: "Workers", text: "Maximize the time before the 9-to-5 grind. Squeeze in side-hustles or workouts." },
               { icon: Trophy, title: "High Performers", text: "Optimize every minute for bio-hacking, meditation, and deep work." }
             ].map((item, i) => (
               <div key={i} className="bg-slate-800 dark:bg-slate-900 p-8 rounded-2xl border border-slate-700">
                  <item.icon className={`w-10 h-10 ${textAccent} mb-4`}/>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-slate-300">{item.text}</p>
               </div>
             ))}
           </div>
        </div>
      </div>

      {/* 5. FEATURES OVERVIEW */}
      <div className="py-20 bg-white dark:bg-slate-900 transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
             <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Everything You Need</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: BarChart3, label: "Progress Tracking" },
              { icon: Wallet, label: "Money Blocks" },
              { icon: Moon, label: "Sleep Optimization" },
              { icon: Settings, label: "Full Customization" },
              { icon: Shield, label: "Privacy Focused" },
              { icon: Download, label: "PDF Export" },
              { icon: Trophy, label: "Streak Mode" },
              { icon: Brain, label: "Mindset Training" },
            ].map((feat, i) => (
              <div key={i} className="flex flex-col items-center p-4">
                <feat.icon className={`w-8 h-8 ${textAccent} mb-3`} />
                <span className="font-semibold text-slate-700 dark:text-slate-300">{feat.label}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
             <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Ready to forge your morning?</h3>
             <Button size="lg" onClick={onStart}>Start Now - It's Free</Button>
          </div>
        </div>
      </div>

    </div>
  );
};