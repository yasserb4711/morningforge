
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getSavedRoutines, deleteRoutine, updateRoutine } from '../services/storageService';
import { SavedRoutine } from '../types';
import { Button } from './ui/Button';
import { Trash2, Edit2, PlayCircle, Clock, Calendar } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

interface SavedRoutinesProps {
  onLoadRoutine: (routine: SavedRoutine) => void;
  onNavigate: (view: any) => void;
}

export const SavedRoutines: React.FC<SavedRoutinesProps> = ({ onLoadRoutine, onNavigate }) => {
  const { user } = useAuth();
  const { settings } = useSettings();
  const [routines, setRoutines] = useState<SavedRoutine[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const loadRoutines = () => {
    if (user) setRoutines(getSavedRoutines(user.id));
  };

  useEffect(() => {
    loadRoutines();
  }, [user]);

  const handleDelete = (id: string) => {
    if (!user) return;
    if (confirm("Delete this routine?")) {
        deleteRoutine(user.id, id);
        loadRoutines();
    }
  };

  const startRename = (r: SavedRoutine) => {
    setEditingId(r.id);
    setEditTitle(r.title);
  };

  const saveRename = (r: SavedRoutine) => {
    if (!user) return;
    updateRoutine(user.id, { ...r, title: editTitle });
    setEditingId(null);
    loadRoutines();
  };

  const handleSetToday = (r: SavedRoutine) => {
    onLoadRoutine(r);
    onNavigate('dashboard');
  };

  const handleOpen = (r: SavedRoutine) => {
    onLoadRoutine(r);
    onNavigate('result');
  };

  if (routines.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 flex flex-col items-center px-4">
        <div className="text-center max-w-md">
           <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">No Saved Routines</h2>
           <p className="text-slate-500 mb-8">You haven't saved any routines yet. Generate one to get started.</p>
           <Button onClick={() => onNavigate('setup')}>Generate Routine</Button>
        </div>
      </div>
    );
  }

  const color = settings.accentColor;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 px-4 sm:px-6 lg:px-8 pb-12 transition-colors">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Your Routine Library</h1>
        
        <div className="grid gap-6">
           {routines.map(routine => (
             <div key={routine.id} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:shadow-md">
                
                <div className="flex-1">
                   {editingId === routine.id ? (
                     <div className="flex items-center gap-2 mb-2">
                        <input 
                          value={editTitle} 
                          onChange={(e) => setEditTitle(e.target.value)} 
                          className="border rounded p-1 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                          autoFocus
                        />
                        <Button size="sm" onClick={() => saveRename(routine)}>Save</Button>
                     </div>
                   ) : (
                     <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{routine.title}</h3>
                        <button onClick={() => startRename(routine)} className="text-slate-400 hover:text-indigo-500">
                           <Edit2 className="w-4 h-4"/>
                        </button>
                     </div>
                   )}
                   
                   <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
                      <span className="flex items-center"><Clock className="w-4 h-4 mr-1"/> {routine.summary.duration}</span>
                      <span className="flex items-center"><PlayCircle className="w-4 h-4 mr-1"/> Wake: {routine.summary.wakeTime}</span>
                      <span className="flex items-center"><Calendar className="w-4 h-4 mr-1"/> Created: {new Date(routine.createdAt).toLocaleDateString()}</span>
                   </div>
                   
                   <div className="mt-3 flex gap-2">
                      {routine.goals.map(g => (
                         <span key={g} className="px-2 py-0.5 rounded text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                           {g.split(' ')[0]}
                         </span>
                      ))}
                   </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                   <Button variant="outline" onClick={() => handleOpen(routine)}>
                      View Full
                   </Button>
                   <Button onClick={() => handleSetToday(routine)}>
                      Set as Active
                   </Button>
                   <button 
                     onClick={() => handleDelete(routine.id)}
                     className="p-2 text-slate-400 hover:text-red-600 transition-colors sm:ml-2"
                     title="Delete"
                   >
                      <Trash2 className="w-5 h-5"/>
                   </button>
                </div>

             </div>
           ))}
        </div>

        <div className="mt-8 flex justify-center">
            <Button variant="outline" onClick={() => onNavigate('setup')}>
               <span className="text-2xl mr-2 leading-none">+</span> Create New Routine
            </Button>
        </div>
      </div>
    </div>
  );
};
