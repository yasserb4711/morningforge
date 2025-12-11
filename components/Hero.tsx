import React from 'react';
import { Button } from './ui/Button';
import { ArrowRight, CheckCircle2, Clock, Zap, Target, BookOpen, Users } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

interface HeroProps {
  onStart: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStart }) => {
  const { settings } = useSettings();
  const color = settings.accentColor;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 overflow-x-hidden pt-16 transition-colors">
      
      {/* 1. HERO SECTION */}
      <div className="relative pt-20 pb-32 overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl overflow-hidden -z-10 opacity-30 dark:opacity-20 pointer-events-none">
          <div className={`absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-${color}-400 to-purple-600 rounded-full blur-3xl opacity-30 animate-pulse`}></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-400 rounded-full blur-3xl opacity-20"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-6">
            Build Your <br/>
            <span className={`text-transparent bg-clip-text bg-gradient-to-r from-${color}-600 to-purple-600`}>Perfect Morning.</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Generate a realistic morning routine based on your schedule, goals, and energy. No fluff. Specific, timed, and actionable.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" onClick={onStart} className="shadow-xl shadow-indigo-500/20">
              Start Routine Setup <ArrowRight className="ml-2 w-5 h-5"/>
            </Button>
          </div>
        </div>
      </div>

      {/* 2. HOW IT WORKS */}
      <div className="py-20 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
             <h2 className="text-3xl font-bold text-slate-900 dark:text-white">How It Works</h2>
             <p className="mt-4 text-slate-500">Three simple steps to a better morning.</p>
           </div>

           <div className="grid md:grid-cols-3 gap-10">
              {[
                { icon: Clock, title: "1. Your Schedule", desc: "Tell us when you wake up, when you leave, and how much time you have." },
                { icon: Target, title: "2. Your Goals", desc: "Pick your focus: Muscle, Money, Mindset, or Discipline." },
                { icon: Zap, title: "3. Your Routine", desc: "Get a minute-by-minute plan tailored to your exact constraints." }
              ].map((step, i) => (
                <div key={i} className="relative p-8 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                   <div className={`w-12 h-12 rounded-xl bg-${color}-100 dark:bg-${color}-900/30 flex items-center justify-center mb-6 text-${color}-600 dark:text-${color}-400`}>
                     <step.icon className="w-6 h-6"/>
                   </div>
                   <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{step.title}</h3>
                   <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* 3. WHO IS IT FOR */}
      <div className="py-24 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-16">Who is MorningForge For?</h2>
           <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Students", text: "Balance classes, study, and fitness without burning out.", icon: BookOpen },
                { title: "Workers", text: "Reclaim your time before the 9-to-5 grind takes over.", icon: Users },
                { title: "Self-Improvers", text: "Optimize every minute for bio-hacking and deep work.", icon: Zap },
              ].map((card, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
                   <card.icon className={`w-8 h-8 text-${color}-600 mb-4`}/>
                   <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{card.title}</h3>
                   <p className="text-slate-600 dark:text-slate-400">{card.text}</p>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* 4. WHY IT WORKS */}
      <div className="py-24 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
         <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-12">Why This Works</h2>
            <div className="grid sm:grid-cols-2 gap-6 text-left">
               <div className="flex items-start">
                  <CheckCircle2 className={`w-5 h-5 text-${color}-600 mr-3 mt-1 shrink-0`}/>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">Realistic Timing</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">We don't give you a 3-hour routine if you only have 30 minutes.</p>
                  </div>
               </div>
               <div className="flex items-start">
                  <CheckCircle2 className={`w-5 h-5 text-${color}-600 mr-3 mt-1 shrink-0`}/>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">Style Adaptive</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Choose between Chill, Efficient, or Hardcore modes.</p>
                  </div>
               </div>
               <div className="flex items-start">
                  <CheckCircle2 className={`w-5 h-5 text-${color}-600 mr-3 mt-1 shrink-0`}/>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">Holistic Approach</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Combines movement, mindset, and deep work blocks.</p>
                  </div>
               </div>
               <div className="flex items-start">
                  <CheckCircle2 className={`w-5 h-5 text-${color}-600 mr-3 mt-1 shrink-0`}/>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">Zero Friction</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">No login required to start. Just build and go.</p>
                  </div>
               </div>
            </div>
         </div>
      </div>

    </div>
  );
};