import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import { Button } from './ui/Button';
import { Settings, LogOut, LayoutDashboard, Save, User as UserIcon, Menu, X, ArrowLeft, Crown } from 'lucide-react';
import { AuthModal } from './AuthModal';

interface NavbarProps {
  onNavigate: (view: any) => void;
  onBack: () => void;
  currentView: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, onBack, currentView }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { settings } = useSettings();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const color = settings.accentColor;
  const textColors: Record<string, string> = {
    indigo: 'text-indigo-600',
    purple: 'text-purple-600',
    teal: 'text-teal-600',
    rose: 'text-rose-600',
    amber: 'text-amber-600',
  };
  const textAccent = textColors[color];

  const handleNav = (view: string) => {
    onNavigate(view);
    setIsMobileMenuOpen(false);
  };

  const showBackButton = currentView !== 'home' && currentView !== 'dashboard';

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Left Side: Back Button & Logo */}
            <div className="flex items-center gap-2 md:gap-4">
               {showBackButton && (
                  <button 
                    onClick={onBack}
                    className="p-2 md:p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                    aria-label="Go Back"
                  >
                     <ArrowLeft className="w-5 h-5 md:w-5 md:h-5"/>
                  </button>
               )}

               {/* Logo */}
               <div 
                 className="flex items-center cursor-pointer" 
                 onClick={() => handleNav(isAuthenticated ? 'dashboard' : 'home')}
               >
                 <span className={`font-bold text-xl tracking-tight ${textAccent}`}>MORNING FORGE</span>
                 {user?.isPro && <span className="ml-2 text-[10px] font-bold bg-amber-500 text-white px-1.5 py-0.5 rounded uppercase">Pro</span>}
               </div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <button 
                    onClick={() => handleNav('premium')}
                    className={`flex items-center text-sm font-bold transition-colors ${currentView === 'premium' ? 'text-amber-500' : 'text-slate-600 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400'}`}
                  >
                    <Crown className="w-4 h-4 mr-1.5" /> {user?.isPro ? 'Pro Active' : 'Go Premium'}
                  </button>

                  <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-2" />

                  <button 
                    onClick={() => handleNav('dashboard')}
                    className={`text-sm font-medium transition-colors ${currentView === 'dashboard' ? textAccent : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'}`}
                  >
                    Dashboard
                  </button>
                  <button 
                    onClick={() => handleNav('saved')}
                    className={`text-sm font-medium transition-colors ${currentView === 'saved' ? textAccent : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'}`}
                  >
                    Saved Routines
                  </button>
                  
                  <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2" />
                  
                  <div className="flex items-center gap-2 group relative">
                    <div className={`w-8 h-8 rounded-full bg-${color}-100 dark:bg-slate-800 flex items-center justify-center ${textAccent} font-bold ring-2 ${user?.isPro ? 'ring-amber-400' : 'ring-transparent'}`}>
                      {user?.name.charAt(0).toUpperCase()}
                    </div>
                    
                    {/* Dropdown */}
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800 py-1 hidden group-hover:block hover:block">
                        <button onClick={() => handleNav('settings')} className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center">
                            <Settings className="w-4 h-4 mr-2"/> Settings
                        </button>
                        <button onClick={() => { logout(); handleNav('home'); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center">
                            <LogOut className="w-4 h-4 mr-2"/> Log out
                        </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <button 
                      onClick={() => handleNav('premium')}
                      className={`flex items-center text-sm font-medium transition-colors mr-2 ${currentView === 'premium' ? 'text-amber-500' : 'text-slate-600 dark:text-slate-300 hover:text-amber-500'}`}
                    >
                      Pricing
                  </button>
                  <Button size="sm" onClick={() => setIsAuthModalOpen(true)}>Log in / Sign up</Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center">
               <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600 dark:text-slate-300">
                  {isMobileMenuOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
               </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-4 space-y-3">
             {isAuthenticated ? (
               <>
                 <div className="flex items-center gap-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                    <div className={`w-10 h-10 rounded-full bg-${color}-100 dark:bg-slate-800 flex items-center justify-center ${textAccent} font-bold`}>
                      {user?.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-white">{user?.name}</span>
                    {user?.isPro && <span className="bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded font-bold">PRO</span>}
                 </div>
                 <button onClick={() => handleNav('premium')} className="block w-full text-left py-2 font-bold text-amber-500">Go Premium</button>
                 <button onClick={() => handleNav('dashboard')} className="block w-full text-left py-2 font-medium text-slate-700 dark:text-slate-200">Dashboard</button>
                 <button onClick={() => handleNav('saved')} className="block w-full text-left py-2 font-medium text-slate-700 dark:text-slate-200">Saved Routines</button>
                 <button onClick={() => handleNav('settings')} className="block w-full text-left py-2 font-medium text-slate-700 dark:text-slate-200">Settings</button>
                 <button onClick={() => { logout(); handleNav('home'); }} className="block w-full text-left py-2 font-medium text-red-600">Log Out</button>
               </>
             ) : (
               <>
                 <button onClick={() => handleNav('premium')} className="block w-full text-left py-2 font-bold text-amber-500">Pricing</button>
                 <Button fullWidth onClick={() => { setIsAuthModalOpen(true); setIsMobileMenuOpen(false); }}>Log in / Sign up</Button>
               </>
             )}
          </div>
        )}
      </nav>
      
      {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}
    </>
  );
};