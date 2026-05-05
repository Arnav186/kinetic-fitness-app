import { useEffect, useState, useContext } from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import { WorkoutContext } from '../context/WorkoutContext';
import { Zap, Flame, Trophy, History, Play } from 'lucide-react';

export default function Dashboard() {
  const { workouts } = useContext(WorkoutContext);
  const [totalCals, setTotalCals] = useState(0);
  const [streak, setStreak] = useState(0);
  
  const [savedBmi, setSavedBmi] = useState(null);

  useEffect(() => {
    if (workouts) {
      const cals = workouts.reduce((acc, curr) => acc + curr.calories, 0);
      setTotalCals(cals);
      calculateStreak(workouts);
    }
    
    const bmi = localStorage.getItem('kinetic_bmi');
    if (bmi) {
      setSavedBmi(JSON.parse(bmi));
    }
  }, [workouts]);

  const calculateStreak = (data) => {
    if(!data.length) return;
    let currentStreak = 1;
    let lastDate = new Date(data[0].date);
    lastDate.setHours(0,0,0,0);
    
    for(let i = 1; i < data.length; i++) {
        let prevDate = new Date(data[i].date);
        prevDate.setHours(0,0,0,0);
        let diff = (lastDate - prevDate) / (1000 * 60 * 60 * 24);
        if (diff === 1) {
            currentStreak++;
            lastDate = prevDate;
        } else if (diff === 0) {
            continue;
        } else {
            break;
        }
    }
    setStreak(currentStreak);
  };

  const chartData = workouts.slice(0, 7).reverse().map(w => ({
    name: new Date(w.date).toLocaleDateString(undefined, {weekday:'short'}),
    calories: w.calories
  }));

  return (
    <div className="pb-32 pt-8 sm:pt-10 max-w-md mx-auto space-y-8 animate-fade-in relative z-10">
      {/* Background Ambient Glows */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-[var(--primary)]/10 rounded-full blur-[100px] -z-10 animate-pulse-glow"></div>
      <div className="fixed bottom-40 right-0 w-48 h-48 bg-[var(--secondary)]/10 rounded-full blur-[80px] -z-10"></div>

      <div className="text-center mb-8 relative">
        <div className="relative inline-block mb-4">
            <img className="w-24 h-24 rounded-full mx-auto border-2 border-[color:var(--primary)] shadow-[0_0_20px_rgba(0,238,252,0.3)] object-cover" src="/avatar.png" alt="User" />
           <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[var(--primary)] rounded-full flex items-center justify-center text-black border-4 border-[color:var(--background)]">
             <Trophy size={14} fill="currentColor" />
           </div>
        </div>
        <h1 className="font-headline font-black text-5xl tracking-tighter uppercase mb-1 shimmer-text">FITNESS FREAK</h1>
        {savedBmi ? (
          <p className="font-label text-gray-400 tracking-widest text-[10px] uppercase">BMI: <span className="text-[color:var(--primary)] font-black">{savedBmi.value}</span> • {savedBmi.category}</p>
        ) : (
          <p className="font-label text-gray-400 tracking-widest text-[10px] uppercase font-bold">Keep Grinding!!!</p>
        )}
      </div>

      <section className="grid grid-cols-2 gap-4">
        <div className="col-span-2 glass-panel rounded-3xl p-8 flex flex-col justify-center items-center h-44 relative overflow-hidden text-center cyber-border animate-float">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Flame size={80} />
          </div>
          <div className="z-10">
            <span className="font-label text-[10px] tracking-[0.4em] text-[color:var(--text-muted)] uppercase flex items-center justify-center gap-2 mb-2 font-black">
              Total Energy Burn
            </span>
            <div className="font-headline text-6xl font-black drop-shadow-[0_0_15px_rgba(0,238,252,0.5)] text-[color:var(--text)]">{totalCals}</div>
          </div>
          <div className="flex items-center gap-3 mt-6 z-10 w-full max-w-[240px]">
             <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
               <div className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] shadow-[0_0_10px_var(--primary)]" style={{width: `${Math.min(totalCals/2000 * 100, 100)}%`}}></div>
             </div>
             <span className="font-label text-[10px] text-[color:var(--primary)] whitespace-nowrap font-black">{Math.min(Math.round(totalCals/20), 100)}%</span>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6 flex flex-col items-center justify-center gap-1 relative overflow-hidden text-center hover:bg-white/5 transition-colors">
          <div className="text-[color:var(--secondary)] mb-1">
            <Zap size={20} fill="currentColor" />
          </div>
          <span className="font-label text-[9px] text-[color:var(--text-muted)] uppercase tracking-[0.2em] font-bold">Streak</span>
          <div className="font-headline text-4xl font-black text-[color:var(--text)]">{streak} <span className="text-[8px] font-label text-[color:var(--text-muted)] uppercase tracking-widest">Days</span></div>
        </div>

        <div className="glass-panel rounded-2xl p-6 flex flex-col items-center justify-center gap-1 relative overflow-hidden text-center hover:bg-white/5 transition-colors">
           <div className="text-[color:var(--primary)] mb-1">
             <History size={20} />
           </div>
           <span className="font-label text-[9px] text-[color:var(--text-muted)] uppercase tracking-[0.2em] font-bold">Volume</span>
           <div className="font-headline text-4xl font-black text-[color:var(--text)]">{workouts.length} <span className="text-[8px] font-label text-[color:var(--text-muted)] uppercase tracking-widest">Logs</span></div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-4">
        <Link to="/timer" className="glass-panel py-4 rounded-xl flex items-center justify-center gap-3 font-label text-[10px] tracking-widest uppercase hover:bg-[var(--color-surface-hover)] transition-all border border-[color:var(--color-border)] hover:scale-[1.02] active:scale-95 group">
          <Play size={14} className="text-[color:var(--primary)] group-hover:scale-125 transition-transform" fill="currentColor" />
          Pro Timer
        </Link>
        <button onClick={() => {
          localStorage.clear();
          window.location.reload();
        }} className="glass-panel py-4 rounded-xl flex items-center justify-center gap-2 font-label text-[10px] tracking-widest uppercase text-red-500/70 hover:text-red-500 hover:bg-red-500/10 transition-all border border-[color:var(--color-border)] hover:scale-[1.02] active:scale-95">
           Reset Data
        </button>
      </div>

      <section className="glass-panel p-6 rounded-2xl relative overflow-hidden">
         <h2 className="font-headline text-xl font-bold uppercase mb-6 tracking-tight flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--primary)]"></span>
            Recent Burn
         </h2>
         <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#888" tick={{fill:'#888', fontSize:10, fontFamily:'Inter'}} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{backgroundColor:'rgba(10,10,15,0.8)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'8px', color:'#fff', fontFamily:'Inter', backdropFilter:'blur(10px)'}} />
                <Bar dataKey="calories" fill="url(#colorUv)" radius={[6,6,0,0]} barSize={20} />
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={1}/>
                    <stop offset="95%" stopColor="var(--color-secondary)" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
         </div>
      </section>

      <section className="bg-transparent rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-headline text-xl font-bold uppercase tracking-tight flex items-center gap-2">
            <span className="w-8 h-1 bg-[var(--primary)] rounded-full"></span>
            Workout History
          </h2>
        </div>
        
        {workouts.length === 0 ? <p className="text-gray-400 text-sm font-body text-center mt-8 glass-panel py-12 rounded-3xl border-dashed border-2 border-white/5 uppercase tracking-widest text-[10px]">No logs detected.</p> : (
          <ul className="space-y-4">
            {workouts.map(w => (
              <li key={w._id} className="flex justify-between items-center glass-panel p-5 rounded-2xl shadow-xl border border-white/5 hover:border-primary/40 transition-all duration-500 cyber-border group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-[var(--primary)]/10 group-hover:border-[var(--primary)]/20 transition-colors">
                     <Flame size={20} className="text-gray-600 group-hover:text-[var(--primary)] transition-colors" />
                  </div>
                  <div>
                    <p className="font-headline font-black uppercase text-sm tracking-tight text-[color:var(--text)]">{w.name}</p>
                    <p className="font-label text-[9px] text-[color:var(--text-muted)] uppercase tracking-[0.2em] mt-1">{new Date(w.date).toLocaleDateString()} • {w.duration} MINS</p>
                  </div>
                </div>
                <div className="text-right flex flex-col justify-center">
                  <p className="font-headline text-3xl font-black text-[color:var(--text)] group-hover:text-[var(--primary)] transition-colors">{w.calories}</p>
                  <p className="font-label text-[8px] text-[color:var(--text-muted)] uppercase tracking-[0.3em] font-black">KCAL</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

    </div>
  );
}
