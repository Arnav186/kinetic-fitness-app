import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function AddWorkout() {
  const [formData, setFormData] = useState({ name: '', duration: '', calories: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/workout/add', formData);
      navigate('/dashboard');
    } catch (err) { alert(err.response?.data?.msg || 'Error adding workout'); }
    setLoading(false);
  };

  return (
    <div className="pb-32 pt-8 sm:pt-10 max-w-md mx-auto space-y-8 animate-fade-in relative z-10">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -z-10"></div>
      
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
          <span className="material-symbols-outlined text-primary">add_task</span>
        </div>
        <div>
          <h1 className="text-3xl font-black font-headline uppercase tracking-tighter text-white leading-none">Log Burn</h1>
          <p className="font-label text-gray-400 tracking-widest text-[10px] uppercase mt-1">Record Performance</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#1a1a1a] p-6 sm:p-8 rounded-3xl border border-[#333] space-y-6 shadow-xl">
        <div className="space-y-2">
          <label className="font-label text-[10px] tracking-widest uppercase text-gray-400">Protocol</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500 material-symbols-outlined text-[18px]">sports_gymnastics</span>
            <input className="w-full bg-[#0e0e0e] border border-[#333] rounded-xl py-4 pl-12 pr-4 text-white focus:ring-1 focus:ring-primary/50 transition-all font-body text-sm outline-none placeholder:text-gray-600" type="text" placeholder="e.g. HIIT Full Body" required onChange={e=>setFormData({...formData, name: e.target.value})} />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="font-label text-[10px] tracking-widest uppercase text-gray-400">Duration (Mins)</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500 material-symbols-outlined text-[18px]">schedule</span>
              <input className="w-full bg-[#0e0e0e] border border-[#333] rounded-xl py-4 pl-12 pr-4 text-white focus:ring-1 focus:ring-primary/50 transition-all font-body text-sm outline-none placeholder:text-gray-600" type="number" min="1" placeholder="45" required onChange={e=>setFormData({...formData, duration: Number(e.target.value)})} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="font-label text-[10px] tracking-widest uppercase text-gray-400">Calories</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#ff7439] material-symbols-outlined text-[18px]">local_fire_department</span>
              <input className="w-full bg-[#0e0e0e] border border-[#333] rounded-xl py-4 pl-12 pr-4 text-white focus:ring-1 focus:ring-[#ff7439]/50 transition-all font-body text-sm outline-none placeholder:text-gray-600" type="number" min="1" placeholder="450" required onChange={e=>setFormData({...formData, calories: Number(e.target.value)})} />
            </div>
          </div>
        </div>
        
        <button disabled={loading} className="w-full bg-primary text-[#0e0e0e] font-headline font-black py-4 mt-6 rounded-xl tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-[#b0df00] transition-colors active:scale-95 disabled:opacity-50" type="submit">
          <span>{loading ? 'Transmitting...' : 'Upload Data'}</span>
          {!loading && <span className="material-symbols-outlined text-[18px]">upload</span>}
        </button>
      </form>
    </div>
  );
}
