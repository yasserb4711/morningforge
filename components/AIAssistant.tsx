
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, ChevronDown } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { chatWithAssistant } from '../services/geminiService';
import { RoutineResponse, ChatMessage } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface AIAssistantProps {
  currentRoutine: RoutineResponse | null;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ currentRoutine }) => {
  const { settings } = useSettings();
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const color = settings.accentColor;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const context = {
      routine: currentRoutine || undefined,
      goals: isAuthenticated ? undefined : [] // Pass auth context if needed later
    };

    const responseText = await chatWithAssistant(text, messages, context);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsTyping(false);
  };

  const handleQuickAction = (action: string) => {
    handleSend(action);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-${color}-500 to-purple-600 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center z-[50] text-white`}
      >
        {isOpen ? <ChevronDown className="w-8 h-8"/> : <MessageSquare className="w-7 h-7"/>}
      </button>

      {/* Chat Panel */}
      <div 
        className={`fixed bottom-24 right-4 sm:right-6 w-[90vw] sm:w-[380px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300 transform origin-bottom-right z-[50] ${isOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none'}`}
        style={{ height: '500px', maxHeight: '70vh' }}
      >
        {/* Header */}
        <div className={`p-4 bg-${color}-600 rounded-t-2xl flex items-center justify-between text-white`}>
           <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4"/>
              <h3 className="font-bold">Assistant</h3>
           </div>
           <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 rounded p-1">
             <X className="w-4 h-4"/>
           </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950">
           {messages.length === 0 && (
             <div className="text-center mt-8 space-y-4">
                <p className="text-sm text-slate-500">Ask me anything about your routine or habits.</p>
                <div className="flex flex-col gap-2">
                   <button onClick={() => handleQuickAction("How can I make this routine shorter?")} className="text-xs bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-400 transition-colors text-left">
                     Make it shorter ⏱
                   </button>
                   <button onClick={() => handleQuickAction("Make this routine more hardcore.")} className="text-xs bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-400 transition-colors text-left">
                     Make it hardcore 🔥
                   </button>
                   <button onClick={() => handleQuickAction("Explain the science behind the first step.")} className="text-xs bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-400 transition-colors text-left">
                     Explain step-by-step 🧠
                   </button>
                </div>
             </div>
           )}

           {messages.map((m, i) => (
             <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                  m.role === 'user' 
                    ? `bg-${color}-600 text-white rounded-tr-sm` 
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-sm shadow-sm'
                }`}>
                   {m.text}
                </div>
             </div>
           ))}
           
           {isTyping && (
             <div className="flex justify-start">
               <div className="bg-white dark:bg-slate-800 rounded-2xl px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-tl-sm">
                 <div className="flex space-x-1">
                   <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                   <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                   <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                 </div>
               </div>
             </div>
           )}
           <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 rounded-b-2xl">
           <form 
             onSubmit={(e) => { e.preventDefault(); handleSend(); }}
             className="flex gap-2"
           >
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isTyping}
                className={`w-9 h-9 rounded-full bg-${color}-600 text-white flex items-center justify-center hover:opacity-90 disabled:opacity-50`}
              >
                <Send className="w-4 h-4"/>
              </button>
           </form>
        </div>
      </div>
    </>
  );
};
