import { useState } from 'react';

export default function BmiCalculator() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState('');

  const calculateBMI = (e) => {
    e.preventDefault();
    const h = Number(height) / 100; // cm to m
    const w = Number(weight);
    if(h > 0 && w > 0) {
      const res = (w / (h * h)).toFixed(1);
      let cat = '';
      if(res < 18.5) cat = 'Underweight';
      else if(res >= 18.5 && res < 24.9) cat = 'Optimal Base';
      else if(res >= 25 && res < 29.9) cat = 'Overweight';
      else cat = 'Critical Mass';
      
      setBmi(res);
      setCategory(cat);
      localStorage.setItem('kinetic_bmi', JSON.stringify({ value: res, category: cat }));
    }
  };

  return (
    <div className="pb-32 pt-8 sm:pt-10 max-w-md mx-auto space-y-8 animate-fade-in relative z-10">
      <div className="absolute top-1/4 right-0 w-64 h-64 bg-[var(--secondary)]/5 rounded-full -z-10"></div>
      
      <div className="flex items-center gap-4 mb-8">

        <div>
          <h1 className="text-3xl font-black font-headline uppercase tracking-tighter text-[color:var(--text)] leading-none">Mass Index</h1>
          <p className="font-label text-[color:var(--text-muted)] tracking-widest text-[10px] uppercase mt-1">Calibrate Baseline</p>
        </div>
      </div>

      <form onSubmit={calculateBMI} className="glass-panel p-6 sm:p-8 rounded-3xl border border-[color:var(--color-border)] space-y-6 shadow-xl">
        <div className="space-y-2">
          <label className="font-label text-[10px] tracking-widest uppercase text-[color:var(--text-muted)]">Vertical Axis (cm)</label>
          <div className="relative">
            <input className="w-full bg-[var(--color-surface-hover)] border border-[color:var(--color-border)] rounded-xl py-4 px-4 text-[color:var(--text)] focus:ring-1 focus:ring-[var(--secondary)]/50 transition-all font-body text-sm outline-none placeholder:text-gray-600" type="number" min="1" placeholder="175" required onChange={e=>setHeight(e.target.value)} />
          </div>
        </div>
        <div className="space-y-2">
          <label className="font-label text-[10px] tracking-widest uppercase text-[color:var(--text-muted)]">Gravitational Mass (kg)</label>
          <div className="relative">
            <input className="w-full bg-[var(--color-surface-hover)] border border-[color:var(--color-border)] rounded-xl py-4 px-4 text-[color:var(--text)] focus:ring-1 focus:ring-[var(--secondary)]/50 transition-all font-body text-sm outline-none placeholder:text-gray-600" type="number" min="1" placeholder="70" required onChange={e=>setWeight(e.target.value)} />
          </div>
        </div>
        <button className="w-full bg-[var(--secondary)] text-[#0e0e0e] font-headline font-black py-4 mt-6 rounded-xl tracking-widest uppercase flex items-center justify-center gap-2 transition-colors active:scale-95" type="submit">
          Calculate
        </button>
      </form>

      {bmi && (
        <div className="glass-panel p-8 rounded-3xl border border-[color:var(--color-border)] flex flex-col items-center text-center shadow-lg transform animate-fade-in relative overflow-hidden">
          <p className="text-[color:var(--text-muted)] font-label text-[10px] uppercase tracking-widest mb-1">Calculated BMI Rating</p>
          <p className="text-7xl font-black text-[color:var(--text)] font-headline tracking-tighter mb-2">{bmi}</p>
          <div className="bg-[var(--secondary)]/10 border border-[var(--secondary)]/20 px-4 py-1.5 rounded-full mt-2">
             <p className="font-bold font-label uppercase tracking-widest text-[color:var(--secondary)] text-xs">{category}</p>
          </div>
        </div>
      )}
    </div>
  );
}
