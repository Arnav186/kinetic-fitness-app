import { useEffect, useState, useContext } from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { WorkoutContext } from '../context/WorkoutContext';

export default function Dashboard() {
  const { workouts } = useContext(WorkoutContext);
  const [totalCals, setTotalCals] = useState(0);
  const [streak, setStreak] = useState(0);
  
  const [savedBmi, setSavedBmi] = useState(null);

  // Timer State
  const [showTimer, setShowTimer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    let interval;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

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
      <div className="text-center mb-8 relative">
        <img className="w-20 h-20 rounded-full mx-auto mb-4 border border-[color:var(--color-border)] shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDvvfc1k6lRomrDNenUoWzTZVQhL0-KrHXD8XCfLsvl5A_ZvGgBTi0spLnP0KNLpJ7IvyvmgPCIzEX_8lDcpucQ_Jbn4Qfy0JDlU4YIt3X7X3CRrSnVPZqwqweJy3UmEaqkAuQ9ettPNjCgSEdKGS2cK-HeBPw9921A0Yw767K-v5sM-a2QwCVyrKmJ3o-9XobtyD8eCXU3avuRlDj6yNSvDquM6-TvadWpS4zWgQlU5A8yYPvfNoSxSoHGYsEE7CXt8Cy8LMuXfPs" alt="User" />
        <h1 className="font-headline font-black text-4xl tracking-tighter uppercase mb-1 text-[color:var(--text)]">FITNESS FREAK</h1>
        {savedBmi ? (
          <p className="font-label text-gray-400 tracking-widest text-xs uppercase">BMI: <span className="text-[color:var(--primary)] font-bold">{savedBmi.value}</span> ({savedBmi.category})</p>
        ) : (
          <p className="font-label text-gray-400 tracking-widest text-xs uppercase">Keep Grinding!!!</p>
        )}
      </div>

      <section className="grid grid-cols-2 gap-4">
        <div className="col-span-2 glass-panel rounded-2xl p-6 flex flex-col justify-center items-center h-36 relative overflow-hidden text-center">
          <div>
            <span className="font-label text-[10px] tracking-[0.2em] text-[color:var(--text-muted)] uppercase flex items-center justify-center gap-1">
              Total Calories
            </span>
            <div className="font-headline text-5xl font-black mt-1 drop-shadow-lg text-[color:var(--text)]">{totalCals}</div>
          </div>
          <div className="flex items-center gap-2 mt-4 z-10 w-full max-w-xs">
             <div className="h-1.5 w-full bg-[var(--color-border)] rounded-full overflow-hidden">
               <div className="h-full bg-[var(--primary)]" style={{width: `${Math.min(totalCals/2000 * 100, 100)}%`}}></div>
             </div>
             <span className="font-label text-[10px] text-[color:var(--text-muted)] whitespace-nowrap font-bold">{Math.min(Math.round(totalCals/20), 100)}%</span>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 flex flex-col items-center justify-center gap-2 relative overflow-hidden text-center">
          <div className="flex flex-col items-center justify-center z-10">
            <span className="font-label text-[10px] text-[color:var(--text-muted)] uppercase tracking-widest">Streak</span>
          </div>
          <div className="font-headline text-4xl font-black mt-1 z-10 text-[color:var(--text)]">{streak} <span className="text-sm font-label text-[color:var(--text-muted)] uppercase">days</span></div>
        </div>

        <div className="glass-panel rounded-2xl p-5 flex flex-col items-center justify-center gap-2 relative overflow-hidden text-center">
           <div className="flex flex-col items-center justify-center z-10">
             <span className="font-label text-[10px] text-[color:var(--text-muted)] uppercase tracking-widest">Workouts</span>
           </div>
           <div className="font-headline text-4xl font-black mt-1 z-10 text-[color:var(--text)]">{workouts.length} <span className="text-sm font-label text-[color:var(--text-muted)] uppercase">Total</span></div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => { setShowTimer(true); setTimeLeft(60); setTimerActive(true); }} className="glass-panel py-3 rounded-xl flex items-center justify-center gap-2 font-label text-[10px] tracking-widest uppercase hover:bg-[var(--color-surface-hover)] transition-colors border border-[color:var(--color-border)]">
          Rest Timer
        </button>
        <button onClick={() => {
          localStorage.clear();
          window.location.reload();
        }} className="glass-panel py-3 rounded-xl flex items-center justify-center gap-2 font-label text-[10px] tracking-widest uppercase text-red-500 hover:bg-red-500/10 transition-colors border border-[color:var(--color-border)]">
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
        
        {workouts.length === 0 ? <p className="text-gray-400 text-sm font-body text-center mt-8 glass-panel py-8 rounded-2xl">No workouts recorded yet.</p> : (
          <ul className="space-y-3">
            {workouts.map(w => (
              <li key={w._id} className="flex justify-between items-center glass-panel p-4 rounded-2xl shadow-lg border border-transparent hover:border-primary/30 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-surface-hover)] flex items-center justify-center border border-[color:var(--color-border)]">
                  </div>
                  <div>
                    <p className="font-headline font-bold uppercase text-sm text-[color:var(--text)]">{w.name}</p>
                    <p className="font-label text-[10px] text-[color:var(--text-muted)] uppercase tracking-widest mt-0.5">{new Date(w.date).toLocaleDateString()} • {w.duration}M</p>
                  </div>
                </div>
                <div className="text-right flex flex-col justify-center">
                  <p className="font-headline text-2xl font-black text-[color:var(--text)]">{w.calories}</p>
                  <p className="font-label text-[8px] text-[color:var(--text-muted)] uppercase tracking-widest">KCAL</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Floating Rest Timer */}
      {showTimer && (
        <div className="fixed bottom-24 right-4 glass-panel border border-[color:var(--primary)]/30 shadow-lg rounded-2xl p-4 flex items-center gap-4 z-50 animate-bounce-in bg-[#0e0e0e]">
          <div className="relative w-12 h-12 flex items-center justify-center bg-black rounded-full border border-[color:var(--color-border)]">
            <span className={`font-mono font-bold ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-[color:var(--primary)]'}`}>
              {timeLeft}s
            </span>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[color:var(--text-muted)]">Rest Timer</p>
            <p className="text-sm font-medium text-[color:var(--text)]">{timeLeft > 0 ? 'Catch your breath' : 'Time to push!'}</p>
          </div>
          <div className="flex gap-2 ml-2">
            <button onClick={() => setTimeLeft(prev => prev + 30)} className="p-2 bg-[var(--color-surface-hover)] rounded-lg hover:bg-neutral-700 text-xs font-bold text-[color:var(--text-muted)]">+30s</button>
            <button onClick={() => { setShowTimer(false); setTimerActive(false); }} className="p-2 bg-[var(--color-surface-hover)] rounded-lg hover:bg-neutral-700 text-[color:var(--text-muted)] hover:text-[color:var(--text)]">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
