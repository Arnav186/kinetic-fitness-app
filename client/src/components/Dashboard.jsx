import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../utils/api';

export default function Dashboard() {
  const [workouts, setWorkouts] = useState([]);
  const [totalCals, setTotalCals] = useState(0);
  const [streak, setStreak] = useState(0);
  
  useEffect(() => {
    api.get('/workout/history').then(res => {
      const data = res.data;
      setWorkouts(data);
      const cals = data.reduce((acc, curr) => acc + curr.calories, 0);
      setTotalCals(cals);
      calculateStreak(data);
    }).catch(console.error);
  }, []);

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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/10 rounded-full blur-[50px] -z-10"></div>
        <img className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-primary/30" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDvvfc1k6lRomrDNenUoWzTZVQhL0-KrHXD8XCfLsvl5A_ZvGgBTi0spLnP0KNLpJ7IvyvmgPCIzEX_8lDcpucQ_Jbn4Qfy0JDlU4YIt3X7X3CRrSnVPZqwqweJy3UmEaqkAuQ9ettPNjCgSEdKGS2cK-HeBPw9921A0Yw767K-v5sM-a2QwCVyrKmJ3o-9XobtyD8eCXU3avuRlDj6yNSvDquM6-TvadWpS4zWgQlU5A8yYPvfNoSxSoHGYsEE7CXt8Cy8LMuXfPs" alt="User" />
        <h1 className="font-headline font-black text-4xl tracking-tighter uppercase mb-1 drop-shadow-md">FITNESS RACE</h1>
        <p className="font-label text-gray-400 tracking-widest text-xs uppercase">Elite Performance</p>
      </div>

      <section className="grid grid-cols-2 gap-4">
        <div className="col-span-2 bg-gradient-to-br from-[#20201f] to-[#131313] rounded-2xl p-6 flex flex-col justify-between h-36 relative overflow-hidden border border-[#333]">
          <div className="absolute -right-4 -top-4 w-28 h-28 bg-primary/10 rounded-full blur-3xl"></div>
          <div>
            <span className="font-label text-[10px] tracking-[0.2em] text-gray-400 uppercase">Total Calories</span>
            <div className="font-headline text-5xl font-black text-primary mt-1 drop-shadow-[0_0_15px_rgba(202,253,0,0.3)]">{totalCals}</div>
          </div>
          <div className="flex items-center gap-2 mt-4 z-10">
             <div className="h-1.5 w-full bg-[#131313] rounded-full overflow-hidden shadow-inner">
               <div className="h-full bg-primary" style={{width: `${Math.min(totalCals/2000 * 100, 100)}%`}}></div>
             </div>
             <span className="font-label text-[10px] text-gray-400 whitespace-nowrap">{Math.min(Math.round(totalCals/20), 100)}%</span>
          </div>
        </div>

        <div className="bg-[#20201f] rounded-2xl p-5 flex flex-col gap-2 relative overflow-hidden border border-[#333]">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#ff7439]/10 rounded-full blur-2xl"></div>
          <div className="flex items-center justify-between">
            <span className="material-symbols-outlined text-[#ff7439]">local_fire_department</span>
            <span className="font-label text-[10px] text-gray-400 uppercase tracking-widest">Streak</span>
          </div>
          <div className="font-headline text-4xl font-black mt-2">{streak} <span className="text-sm font-label text-gray-500 uppercase">days</span></div>
        </div>

        <div className="bg-[#20201f] rounded-2xl p-5 flex flex-col gap-2 relative overflow-hidden border border-[#333]">
           <div className="absolute top-0 right-0 w-24 h-24 bg-[#00eefc]/10 rounded-full blur-2xl"></div>
           <div className="flex items-center justify-between">
             <span className="material-symbols-outlined text-[#00eefc]">timer</span>
             <span className="font-label text-[10px] text-gray-400 uppercase tracking-widest">Workouts</span>
           </div>
           <div className="font-headline text-4xl font-black mt-2">{workouts.length} <span className="text-sm font-label text-gray-500 uppercase">Total</span></div>
        </div>
      </section>

      <section className="bg-[#20201f] p-6 rounded-2xl relative overflow-hidden border border-[#333]">
         <h2 className="font-headline text-xl font-bold uppercase mb-6 tracking-tight">Recent Burn</h2>
         <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#888" tick={{fill:'#888', fontSize:10, fontFamily:'Space Grotesk'}} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#262626'}} contentStyle={{backgroundColor:'#0e0e0e', border:'1px solid #333', borderRadius:'8px', color:'#fff', fontFamily:'Space Grotesk'}} />
                <Bar dataKey="calories" fill="#cafd00" radius={[4,4,0,0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
         </div>
      </section>

      <section className="bg-transparent rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-headline text-xl font-bold uppercase tracking-tight flex items-center gap-2">
            <span className="w-8 h-1 bg-primary"></span>
            Workout History
          </h2>
        </div>
        
        {workouts.length === 0 ? <p className="text-gray-400 text-sm font-body text-center mt-8 bg-[#1a1a1a] py-8 rounded-2xl">No workflows recorded yet.</p> : (
          <ul className="space-y-3">
            {workouts.map(w => (
              <li key={w._id} className="flex justify-between items-center bg-[#1a1a1a] p-4 rounded-2xl shadow-lg border border-[#333] hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#131313] flex items-center justify-center border border-[#333]">
                     <span className="material-symbols-outlined text-primary text-xl">fitness_center</span>
                  </div>
                  <div>
                    <p className="font-headline font-bold uppercase text-sm">{w.name}</p>
                    <p className="font-label text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">{new Date(w.date).toLocaleDateString()} • {w.duration}M</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-headline text-2xl font-black text-primary">{w.calories}</p>
                  <p className="font-label text-[8px] text-gray-500 uppercase tracking-widest">KCAL</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
