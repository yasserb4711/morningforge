import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/Button';
import { X, User, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
  initialMode?: 'login' | 'signup';
  onAuthSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, initialMode = 'login', onAuthSuccess }) => {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        if (password.length < 6) throw new Error("Password must be at least 6 characters.");
        if (!name.trim()) throw new Error("Name is required.");
        await signup(name, email, password);
      } else {
        await login(email, password);
      }
      
      if (onAuthSuccess) {
          onAuthSuccess();
      }
      onClose();
    } catch (err: any) {
      setError(err.message || "Authentication failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
      setMode(mode === 'login' ? 'signup' : 'login');
      setError(null);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
        <div className="p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="text-center mb-6">
            <h2 className={`text-2xl font-bold text-slate-900 dark:text-white mb-2`}>
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
                {mode === 'login' ? 'Sign in to access your routine.' : 'Start building your perfect morning.'}
            </p>
          </div>

          {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
              </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {mode === 'signup' && (
                <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
                <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                    placeholder="Your Name"
                    required
                    />
                </div>
                </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                  placeholder="••••••••"
                  required
                />
                <button 
                   type="button"
                   onClick={() => setShowPassword(!showPassword)}
                   className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                    {showPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                </button>
              </div>
            </div>

            <Button fullWidth type="submit" disabled={isLoading} className="mt-4">
              {isLoading ? 'Processing...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
            </Button>
            
            <div className="text-center mt-4">
                 <p className="text-sm text-slate-500 dark:text-slate-400">
                    {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                    <button 
                        type="button" 
                        onClick={toggleMode}
                        className="ml-2 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                        {mode === 'login' ? "Sign up" : "Log in"}
                    </button>
                 </p>
                 {mode === 'login' && (
                     <button type="button" className="text-xs text-slate-400 mt-2 hover:text-slate-600 dark:hover:text-slate-300">
                         Forgot Password?
                     </button>
                 )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};