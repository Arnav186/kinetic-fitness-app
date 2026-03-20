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
      const res = w / (h * h);
      setBmi(res.toFixed(1));
      if(res < 18.5) setCategory('Underweight');
      else if(res >= 18.5 && res < 24.9) setCategory('Optimal Base');
      else if(res >= 25 && res < 29.9) setCategory('Overweight');
      else setCategory('Critical Mass');
    }
  };

  return (
    <div className="pb-32 pt-8 sm:pt-10 max-w-md mx-auto space-y-8 animate-fade-in relative z-10">
      <div className="absolute top-1/4 right-0 w-64 h-64 bg-[#ff7439]/5 rounded-full blur-[80px] -z-10"></div>
      
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-[#ff7439]/10 flex items-center justify-center border border-[#ff7439]/20">
          <span className="material-symbols-outlined text-[#ff7439]">monitor_weight</span>
        </div>
        <div>
          <h1 className="text-3xl font-black font-headline uppercase tracking-tighter text-white leading-none">Mass Index</h1>
          <p className="font-label text-gray-400 tracking-widest text-[10px] uppercase mt-1">Calibrate Baseline</p>
        </div>
      </div>

      <form onSubmit={calculateBMI} className="bg-[#1a1a1a] p-6 sm:p-8 rounded-3xl border border-[#333] space-y-6 shadow-xl">
        <div className="space-y-2">
          <label className="font-label text-[10px] tracking-widest uppercase text-gray-400">Vertical Axis (cm)</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500 material-symbols-outlined text-[18px]">height</span>
            <input className="w-full bg-[#0e0e0e] border border-[#333] rounded-xl py-4 pl-12 pr-4 text-white focus:ring-1 focus:ring-[#ff7439]/50 transition-all font-body text-sm outline-none placeholder:text-gray-600" type="number" min="1" placeholder="175" required onChange={e=>setHeight(e.target.value)} />
          </div>
        </div>
        <div className="space-y-2">
          <label className="font-label text-[10px] tracking-widest uppercase text-gray-400">Gravitational Mass (kg)</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500 material-symbols-outlined text-[18px]">scale</span>
            <input className="w-full bg-[#0e0e0e] border border-[#333] rounded-xl py-4 pl-12 pr-4 text-white focus:ring-1 focus:ring-[#ff7439]/50 transition-all font-body text-sm outline-none placeholder:text-gray-600" type="number" min="1" placeholder="70" required onChange={e=>setWeight(e.target.value)} />
          </div>
        </div>
        <button className="w-full bg-[#ff7439] text-[#0e0e0e] font-headline font-black py-4 mt-6 rounded-xl tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-[#ff8a56] transition-colors active:scale-95" type="submit">
          Calculate
          <span className="material-symbols-outlined text-[18px]">analytics</span>
        </button>
      </form>

      {bmi && (
        <div className="bg-gradient-to-br from-[#20201f] to-[#131313] p-8 rounded-3xl border border-[#ff7439]/40 flex flex-col items-center text-center shadow-[0_20px_50px_rgba(255,116,57,0.1)] transform animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff7439]/10 rounded-full blur-[40px]"></div>
          <span className="material-symbols-outlined text-[#ff7439] text-3xl mb-2">speed</span>
          <p className="text-gray-400 font-label text-[10px] uppercase tracking-widest mb-1">Calculated BMI Rating</p>
          <p className="text-7xl font-black text-white font-headline tracking-tighter mb-2 drop-shadow-md">{bmi}</p>
          <div className="bg-[#ff7439]/10 border border-[#ff7439]/20 px-4 py-1.5 rounded-full mt-2">
             <p className="font-bold font-label uppercase tracking-widest text-[#ff7439] text-xs">{category}</p>
          </div>
        </div>
      )}
    </div>
  );
}
