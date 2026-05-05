import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkoutContext } from '../context/WorkoutContext';

export default function AddWorkout() {
  const [formData, setFormData] = useState({ name: '', duration: '', calories: '' });
  const { addWorkout } = useContext(WorkoutContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    addWorkout(formData);
    navigate('/dashboard');
  };

  return (
    <div className="pb-32 pt-8 sm:pt-10 max-w-md mx-auto space-y-8 animate-fade-in relative z-10">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)]/5 rounded-full -z-10"></div>
      
      <div className="flex items-center gap-4 mb-8">

        <div>
          <h1 className="text-3xl font-black font-headline uppercase tracking-tighter text-[color:var(--text)] leading-none">Log Burn</h1>
          <p className="font-label text-[color:var(--text-muted)] tracking-widest text-[10px] uppercase mt-1">Record Performance</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-8 rounded-3xl border border-[color:var(--color-border)] space-y-6 shadow-xl">
        <div className="space-y-2">
          <label className="font-label text-[10px] tracking-widest uppercase text-[color:var(--text-muted)]">Protocol</label>
          <div className="relative">
            <input className="w-full bg-[var(--color-surface-hover)] border border-[color:var(--color-border)] rounded-xl py-4 px-4 text-[color:var(--text)] focus:ring-1 focus:ring-[var(--primary)]/50 transition-all font-body text-sm outline-none placeholder:text-gray-600" type="text" placeholder="e.g. HIIT Full Body" required onChange={e=>setFormData({...formData, name: e.target.value})} />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="font-label text-[10px] tracking-widest uppercase text-[color:var(--text-muted)]">Duration (Mins)</label>
            <div className="relative">
              <input className="w-full bg-[var(--color-surface-hover)] border border-[color:var(--color-border)] rounded-xl py-4 px-4 text-[color:var(--text)] focus:ring-1 focus:ring-[var(--primary)]/50 transition-all font-body text-sm outline-none placeholder:text-gray-600" type="number" min="1" placeholder="45" required onChange={e=>setFormData({...formData, duration: Number(e.target.value)})} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="font-label text-[10px] tracking-widest uppercase text-[color:var(--text-muted)]">Calories</label>
            <div className="relative">
              <input className="w-full bg-[var(--color-surface-hover)] border border-[color:var(--color-border)] rounded-xl py-4 px-4 text-[color:var(--text)] focus:ring-1 focus:ring-[var(--secondary)]/50 transition-all font-body text-sm outline-none placeholder:text-gray-600" type="number" min="1" placeholder="450" required onChange={e=>setFormData({...formData, calories: Number(e.target.value)})} />
            </div>
          </div>
        </div>
        
        <button className="w-full bg-[var(--primary)] text-[#0e0e0e] font-headline font-black py-4 mt-6 rounded-xl tracking-widest uppercase flex items-center justify-center gap-2 transition-colors active:scale-95 disabled:opacity-50" type="submit">
          <span>Upload Data</span>
        </button>
      </form>
    </div>
  );
}
