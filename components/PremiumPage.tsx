import React, { useState, useEffect } from 'react';
import { Check, Crown, X, LogIn, Sparkles, Zap, Infinity as InfinityIcon, Clock, Palette, ShieldCheck, AlertTriangle, CreditCard, Lock } from 'lucide-react';
import { Button } from './ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from './AuthModal';

interface PremiumPageProps {
  onClose: () => void;
  onNavigate: (view: string) => void;
}

// Payment Modal Component
const PaymentModal = ({ onClose, onConfirm }: { onClose: () => void, onConfirm: () => void }) => {
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [agreed, setAgreed] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !number || !expiry || !cvc) {
            alert("Please fill in all card details.");
            return;
        }
        if (!agreed) {
            alert("You must agree to the trial terms.");
            return;
        }
        
        setIsProcessing(true);
        // Simulate API call
        setTimeout(() => {
            setIsProcessing(false);
            onConfirm();
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                <div className="p-6 relative">
                    <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                    
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Enter card details to start your trial</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">No charge until trial ends. Cancel anytime.</p>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cardholder Name</label>
                            <input 
                                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
                                value={name} onChange={e => setName(e.target.value)} placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Card Number</label>
                            <div className="relative">
                                <input 
                                    className="w-full p-2.5 pl-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
                                    value={number} onChange={e => setNumber(e.target.value)} placeholder="0000 0000 0000 0000"
                                />
                                <CreditCard className="absolute left-3 top-2.5 w-4 h-4 text-slate-400"/>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Expiry</label>
                                <input 
                                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
                                    value={expiry} onChange={e => setExpiry(e.target.value)} placeholder="MM/YY"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">CVC</label>
                                <div className="relative">
                                    <input 
                                        className="w-full p-2.5 pl-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
                                        value={cvc} onChange={e => setCvc(e.target.value)} placeholder="123"
                                    />
                                    <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400"/>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2 pt-2">
                            <input 
                                type="checkbox" 
                                id="terms" 
                                checked={agreed} 
                                onChange={e => setAgreed(e.target.checked)}
                                className="w-4 h-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                            />
                            <label htmlFor="terms" className="text-xs text-slate-600 dark:text-slate-400">
                                I agree to the <span className="underline cursor-pointer">trial terms</span>.
                            </label>
                        </div>

                        <Button fullWidth disabled={isProcessing} className="bg-amber-500 hover:bg-amber-600 text-white mt-4 font-bold">
                            {isProcessing ? 'Verifying...' : 'Start 7-Day Trial'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export const PremiumPage: React.FC<PremiumPageProps> = ({ onClose, onNavigate }) => {
  const { user, activateTrial, isTrialUsed } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [authTriggeredTrial, setAuthTriggeredTrial] = useState(false);
  
  // State 1: Trial Active (Already Pro)
  const isTrialActive = user?.isPro;
  // State 2: Trial Used & Expired (Not Pro, but has start date)
  const isTrialExpired = !user?.isPro && isTrialUsed;

  // Calculate Days Left
  const getDaysLeft = () => {
      if (!user?.trialStartDate) return 0;
      const start = new Date(user.trialStartDate).getTime();
      const now = new Date().getTime();
      // Calculate full days passed
      const daysPassed = Math.floor((now - start) / (1000 * 3600 * 24));
      return Math.max(0, 7 - daysPassed);
  };

  const daysLeft = getDaysLeft();

  const handleStartTrialClick = () => {
    // Case 1: Not Logged In -> Redirect to Signup
    if (!user) {
        setAuthTriggeredTrial(true);
        setShowAuthModal(true);
        return;
    }

    // Case 2: Already Pro
    if (user.isPro) {
        alert("You are already a Pro member!");
        return;
    }

    // Case 3: Used/Expired
    if (isTrialUsed) {
        alert("You’ve already used your free trial. Upgrade to Pro to continue using premium features.");
        return;
    }

    // Case 4: Eligible -> Open Payment Modal
    setShowPaymentModal(true);
  };

  const handlePaymentConfirm = () => {
      try {
          activateTrial();
          setShowPaymentModal(false);
          alert("Your 7-day MorningForge Pro trial is now active.");
          onNavigate('dashboard');
      } catch (e) {
          console.error(e);
          alert("Something went wrong activating your trial.");
      }
  };

  const onAuthSuccess = () => {
      if (authTriggeredTrial) {
          // User just signed up to start trial, open payment modal
          setShowPaymentModal(true);
      }
  };

  const proBenefits = [
    { icon: Sparkles, text: "Access to ALL advanced goals (Skin Care, Productivity Boost, Meditation)" },
    { icon: Palette, text: "All premium themes (Sunrise Gold, Neon Focus, Minimal White, Midnight Deep)" },
    { icon: InfinityIcon, text: "Unlimited routine generations" },
    { icon: Zap, text: "Smart AI routine booster (improves your routine every day)" },
    { icon: Clock, text: "Remove all limits and waiting times" },
    { icon: ShieldCheck, text: "Priority updates and early feature access" },
  ];

  return (
    <>
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20 px-4 pb-12 animate-fade-in">
       <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-10">
             <div className="inline-flex items-center justify-center p-4 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-6">
                <Crown className="w-10 h-10 text-amber-500 fill-amber-500" />
             </div>
             <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6">
                MorningForge <span className="text-amber-500">Pro</span>
             </h1>
             <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Join the top 1% of morning achievers. Unlock everything.
             </p>
          </div>
          
          {/* TRIAL STATUS BOX */}
          {isTrialActive && user?.trialStartDate && (
              <div className="max-w-md mx-auto mb-10 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 text-center animate-fade-in shadow-sm">
                  <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-400 font-bold text-lg mb-1">
                      <Check className="w-5 h-5" /> Your MorningForge Pro trial is active
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-300">
                      Days left: <span className="font-bold">{daysLeft}</span>
                  </div>
              </div>
          )}

          {/* EXPIRED STATUS BOX */}
          {isTrialExpired && (
             <div className="max-w-md mx-auto mb-10 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-center animate-fade-in shadow-sm">
                 <div className="flex items-center justify-center gap-2 text-red-700 dark:text-red-400 font-bold text-lg mb-1">
                     <AlertTriangle className="w-5 h-5" /> Your trial has ended.
                 </div>
                 <div className="text-sm text-red-600 dark:text-red-300">
                     Upgrade to continue using MorningForge Pro.
                 </div>
             </div>
          )}

          <div className="grid md:grid-cols-5 gap-8 mb-16 items-start">
             {/* Benefits List (Left) */}
             <div className="md:col-span-3 space-y-6">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">What you get:</h3>
                <div className="space-y-4">
                   {proBenefits.map((b, i) => (
                      <div key={i} className="flex items-start bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                         <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-amber-600 mr-4 shrink-0">
                            <b.icon className="w-5 h-5"/>
                         </div>
                         <span className="text-slate-700 dark:text-slate-200 font-medium pt-1">{b.text}</span>
                      </div>
                   ))}
                </div>
             </div>

             {/* Pricing Card (Right) */}
             <div className="md:col-span-2 bg-slate-900 dark:bg-white rounded-3xl shadow-2xl p-8 flex flex-col relative overflow-hidden transform md:sticky md:top-24">
                <div className="absolute top-0 right-0 bg-amber-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl">BEST VALUE</div>
                
                <div className="mb-6">
                    <h3 className="text-2xl font-bold text-white dark:text-slate-900">Total Access</h3>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-4xl font-extrabold text-white dark:text-slate-900">$4.99</span>
                        <span className="text-slate-400 dark:text-slate-500 font-medium">/ month</span>
                    </div>
                </div>
                
                <div className="space-y-4 mb-8">
                   <div className="flex items-center text-slate-300 dark:text-slate-600 text-sm">
                      <Check className="w-4 h-4 mr-2 text-amber-500"/> Cancel anytime
                   </div>
                   {!isTrialUsed && (
                       <div className="flex items-center text-slate-300 dark:text-slate-600 text-sm">
                          <Check className="w-4 h-4 mr-2 text-amber-500"/> 7-day free trial included
                       </div>
                   )}
                </div>

                <div className="mt-auto space-y-4">
                   {isTrialActive ? (
                       <Button 
                          fullWidth 
                          size="lg"
                          className="bg-green-600 hover:bg-green-700 text-white border-none font-bold py-4 cursor-default"
                       >
                          Pro Active
                       </Button>
                   ) : isTrialExpired ? (
                       <Button 
                          onClick={() => alert("Redirecting to payment processor...")} 
                          fullWidth 
                          size="lg"
                          className="bg-amber-500 hover:bg-amber-600 text-white border-none font-bold py-4"
                       >
                          Upgrade Now
                       </Button>
                   ) : (
                       <Button 
                          onClick={handleStartTrialClick} 
                          fullWidth 
                          size="lg"
                          className="bg-amber-500 hover:bg-amber-600 text-white border-none font-bold py-4"
                       >
                          Start 7-Day Trial
                       </Button>
                   )}
                </div>
             </div>
          </div>
          
          <div className="text-center">
             <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 font-medium transition-colors">
                Maybe later, I'll stick to free plan
             </button>
          </div>

       </div>
    </div>
    
    {showAuthModal && (
        <AuthModal 
            onClose={() => setShowAuthModal(false)} 
            initialMode="signup" 
            onAuthSuccess={onAuthSuccess}
        />
    )}

    {showPaymentModal && (
        <PaymentModal 
            onClose={() => setShowPaymentModal(false)}
            onConfirm={handlePaymentConfirm}
        />
    )}
    </>
  );
};