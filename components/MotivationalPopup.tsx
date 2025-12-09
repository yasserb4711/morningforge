import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { generateMotivationalQuote } from '../services/geminiService';

interface MotivationalPopupProps {
  style?: 'Chill' | 'Efficient' | 'Hardcore';
}

export const MotivationalPopup: React.FC<MotivationalPopupProps> = ({ style }) => {
  const { settings, updateSettings } = useSettings();
  const [visible, setVisible] = useState(false);
  const [quote, setQuote] = useState('');
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    // Check if enabled or if user wants "Silent" mode (implied if disabled)
    if (!settings.notifications.welcomeQuote) return;
    
    // Explicit Silent check if style was passed as Silent (though strictly it's Chill/Efficient/Hardcore in types, logic reserved for future)
    if (style === ('Silent' as any)) return;

    let isMounted = true;

    const fetchQuote = async () => {
        try {
            const lastQuote = localStorage.getItem('lastMotivationalQuote') || undefined;
            
            // Call AI service
            const newQuote = await generateMotivationalQuote(style || 'Efficient', lastQuote);
            
            if (isMounted) {
                setQuote(newQuote);
                setHasLoaded(true);
                localStorage.setItem('lastMotivationalQuote', newQuote);
                
                // Show popup
                setVisible(true);
                
                // Auto Hide after 4 seconds of visibility
                setTimeout(() => {
                    if (isMounted) setVisible(false);
                }, 5000);
            }
        } catch (error) {
            console.error("Failed to fetch quote");
        }
    };

    // Small delay to not block initial render paint
    const initialTimer = setTimeout(() => {
        fetchQuote();
    }, 500);

    return () => {
      isMounted = false;
      clearTimeout(initialTimer);
    };
  }, [settings.notifications.welcomeQuote, style]);

  if (!visible || !hasLoaded) return null;

  const handleDisable = () => {
    setVisible(false);
    updateSettings({
      ...settings,
      notifications: { ...settings.notifications, welcomeQuote: false }
    });
  };

  const color = settings.accentColor;
  // Dynamic border color map
  const borderColors: Record<string, string> = {
    indigo: 'border-indigo-500',
    purple: 'border-purple-500',
    teal: 'border-teal-500',
    rose: 'border-rose-500',
    amber: 'border-amber-500',
  };

  const textColors: Record<string, string> = {
    indigo: 'text-indigo-600',
    purple: 'text-purple-600',
    teal: 'text-teal-600',
    rose: 'text-rose-600',
    amber: 'text-amber-600',
  };

  return (
    <div className="fixed top-0 left-0 w-full flex justify-center z-[60] pointer-events-none pt-24">
      <div className={`max-w-xs w-full animate-[slideInFade_4s_ease-in-out_forwards] pointer-events-auto mx-4`}>
        <div className={`bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl border-l-4 ${borderColors[color]} relative overflow-hidden`}>
          <div className="flex justify-between items-start mb-2">
              <span className={`text-[10px] font-bold ${textColors[color]} uppercase tracking-wider`}>Morning Forge</span>
              <button 
                  onClick={() => setVisible(false)} 
                  className="text-slate-300 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                  <X className="w-3 h-3" />
              </button>
          </div>
          <p className="text-slate-700 dark:text-slate-200 font-medium italic text-sm mb-3">"{quote}"</p>
          <button 
              onClick={handleDisable}
              className="text-[10px] text-slate-400 hover:text-slate-500 underline decoration-dotted transition-colors"
          >
              Disable in Settings
          </button>
        </div>
      </div>
    </div>
  );
};