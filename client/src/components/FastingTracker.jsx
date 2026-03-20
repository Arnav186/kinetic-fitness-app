import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Play, Square } from 'lucide-react';

export default function FastingTracker() {
  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchStatus = async () => {
    try {
      const res = await api.get('/fast/status');
      if (res.data.active) {
        setIsActive(true);
        setStartTime(new Date(res.data.startTime));
      } else {
        setIsActive(false);
        setStartTime(null);
      }
    } catch(err) { console.error(err); }
  };

  const fetchHistory = async () => {
    try {
      const res = await api.get('/fast/history');
      setHistory(res.data);
    } catch(err) { console.error(err); }
  };

  useEffect(() => {
    fetchStatus();
    fetchHistory();
  }, []);

  useEffect(() => {
    let interval;
    if (isActive && startTime) {
      interval = setInterval(() => {
        setElapsed(Date.now() - startTime.getTime());
      }, 1000);
    } else {
      setElapsed(0);
    }
    return () => clearInterval(interval);
  }, [isActive, startTime]);

  const toggleFast = async () => {
    setLoading(true);
    try {
      if (isActive) {
        await api.post('/fast/stop');
        setIsActive(false);
        setStartTime(null);
        fetchHistory();
      } else {
        const res = await api.post('/fast/start');
        setIsActive(true);
        setStartTime(new Date(res.data.startTime));
      }
    } catch(err) { alert(err.response?.data?.msg || 'Error'); }
    setLoading(false);
  };

  const pad = num => String(Math.floor(num)).padStart(2, '0');
  const hours = pad(elapsed / (1000 * 60 * 60));
  const mins = pad((elapsed / (1000 * 60)) % 60);
  const secs = pad((elapsed / 1000) % 60);

  return (
    <div className="pb-32 pt-8 sm:pt-10 max-w-md mx-auto space-y-8 animate-fade-in relative z-10">
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#00eefc]/5 rounded-full blur-[80px] -z-10"></div>
      
      <div className="flex items-center justify-center flex-col text-center mb-10 mt-4">
         <h1 className="text-4xl font-black font-headline uppercase tracking-tighter text-white leading-none">Bio-Clock</h1>
         <p className="font-label text-gray-400 tracking-widest text-[10px] uppercase mt-2">Metabolic Conditioning</p>
      </div>

      <div className="bg-[#1a1a1a] p-10 rounded-[40px] border border-[#333] flex flex-col items-center shadow-2xl relative overflow-hidden">
        <div className={`absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-${isActive ? '[#cafd00]' : '[#333]'} to-transparent transition-colors duration-1000`}></div>
        
        <div className="relative w-56 h-56 rounded-full flex flex-col items-center justify-center mb-8 transition-all duration-1000" style={{boxShadow: isActive ? 'inset 0 0 50px rgba(202,253,0,0.1), 0 0 30px rgba(202,253,0,0.2)' : 'inset 0 0 30px rgba(0,0,0,0.5)', border: `4px solid ${isActive ? '#cafd00' : '#262626'}`}}>
          {isActive && <div className="absolute inset-0 rounded-full border border-primary/30 animate-ping"></div>}
          <span className="font-bold text-gray-500 font-label text-[10px] tracking-[0.2em] uppercase mb-2">{isActive ? 'Active Phase' : 'Idle State'}</span>
          <span className="font-headline font-black text-5xl tracking-tighter drop-shadow-md text-white" style={{color: isActive ? '#ffffff' : '#555'}}>{hours}:{mins}:{secs}</span>
        </div>

        <button disabled={loading} onClick={toggleFast} className={`flex items-center justify-center gap-3 w-full py-5 rounded-2xl font-headline font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 text-sm ${isActive ? 'bg-[#262626] text-white hover:bg-[#333]' : 'bg-[#cafd00] text-[#0e0e0e] hover:bg-[#b0df00] shadow-[0_0_20px_rgba(202,253,0,0.3)]'}`}>
          {isActive ? <><Square size={18} fill="currentColor"/> Terminate Cycle</> : <><Play size={18} fill="currentColor"/> Initiate Fast</>}
        </button>
      </div>

      <section className="bg-transparent rounded-2xl">
        <h2 className="font-headline text-xl font-bold uppercase mb-4 tracking-tight flex items-center gap-2">
          <span className="w-8 h-1 bg-[#00eefc]"></span>
          Archive
        </h2>
        {history.length === 0 ? <p className="text-gray-500 text-sm font-body text-center bg-[#1a1a1a] py-8 rounded-2xl">No cycles recorded.</p> : (
          <ul className="space-y-3">
            {history.map(f => {
              const dur = new Date(f.endTime) - new Date(f.startTime);
              const h = Math.floor(dur / (1000 * 60 * 60));
              const m = Math.floor((dur / (1000 * 60)) % 60);
              return (
                <li key={f._id} className="flex justify-between items-center bg-[#1a1a1a] p-4 rounded-xl border border-[#333] hover:border-[#00eefc]/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#131313] flex items-center justify-center border border-[#00eefc]/20">
                       <span className="material-symbols-outlined text-[#00eefc] text-lg">history</span>
                    </div>
                    <div>
                      <p className="font-headline font-bold text-sm uppercase">{new Date(f.startTime).toLocaleDateString()}</p>
                      <p className="font-label tracking-widest text-[10px] text-gray-500 uppercase mt-0.5">Cycle Completed</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-headline font-black text-xl text-white">{h}H {m}M</p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
