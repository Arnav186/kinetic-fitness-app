import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, RotateCcw, X, Volume2, VolumeX } from 'lucide-react';

export default function IntervalTimer() {
  const [workTime, setWorkTime] = useState(40);
  const [restTime, setRestTime] = useState(20);
  const [rounds, setRounds] = useState(8);
  
  const [currentRound, setCurrentRound] = useState(1);
  const [phase, setPhase] = useState('PREP'); // PREP, WORK, REST, FINISHED
  const [timeLeft, setTimeLeft] = useState(10);
  const [isActive, setIsActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const audioCtxRef = useRef(null);

  // Sound Generator
  const playSound = (freq, duration) => {
    if (isMuted) return;
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const osc = audioCtxRef.current.createOscillator();
    const gain = audioCtxRef.current.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtxRef.current.currentTime);
    
    gain.gain.setValueAtTime(0.1, audioCtxRef.current.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(audioCtxRef.current.destination);
    
    osc.start();
    osc.stop(audioCtxRef.current.currentTime + duration);
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
        if (timeLeft <= 3 && timeLeft > 0) {
          playSound(440, 0.1); // Short beep
        }
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(timerRef.current);
      handlePhaseTransition();
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft]);

  const handlePhaseTransition = () => {
    if (phase === 'PREP') {
      setPhase('WORK');
      setTimeLeft(workTime);
      playSound(880, 0.5); // High beep for work
    } else if (phase === 'WORK') {
      if (currentRound < rounds) {
        setPhase('REST');
        setTimeLeft(restTime);
        playSound(660, 0.5); // Medium beep for rest
      } else {
        setPhase('FINISHED');
        setIsActive(false);
        playSound(1320, 1); // Success sound
      }
    } else if (phase === 'REST') {
      setCurrentRound(prev => prev + 1);
      setPhase('WORK');
      setTimeLeft(workTime);
      playSound(880, 0.5);
    }
  };

  const startTimer = () => {
    if (phase === 'FINISHED') resetTimer();
    setIsActive(true);
  };

  const resetTimer = () => {
    setIsActive(false);
    setPhase('PREP');
    setTimeLeft(10);
    setCurrentRound(1);
  };

  const getProgress = () => {
    const total = phase === 'WORK' ? workTime : phase === 'REST' ? restTime : 10;
    return ((total - timeLeft) / total) * 100;
  };

  const getPhaseColor = () => {
    if (phase === 'WORK') return 'text-[var(--primary)]';
    if (phase === 'REST') return 'text-[var(--secondary)]';
    if (phase === 'PREP') return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 animate-fade-in relative z-10">
      <button onClick={() => navigate('/dashboard')} className="absolute top-6 right-6 p-2 glass-panel rounded-full hover:scale-110 transition-transform">
        <X size={24} />
      </button>

      <div className="text-center mb-12">
        <h1 className="font-headline font-black text-4xl tracking-tighter uppercase mb-2 shimmer-text">TACTICAL TIMER</h1>
        <p className="font-label text-xs tracking-[0.3em] text-[color:var(--text-muted)] uppercase">Precision Intervals</p>
      </div>

      {!isActive && phase === 'PREP' && timeLeft === 10 ? (
        <div className="glass-panel p-8 rounded-3xl w-full max-w-sm space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="font-label text-[10px] tracking-widest uppercase text-[color:var(--text-muted)]">Work (s)</label>
              <input type="number" value={workTime} onChange={e => setWorkTime(Number(e.target.value))} className="w-full bg-[var(--color-surface-hover)] border border-[color:var(--color-border)] rounded-xl py-3 px-4 text-center text-xl font-headline font-bold text-[color:var(--primary)] outline-none" />
            </div>
            <div className="space-y-2">
              <label className="font-label text-[10px] tracking-widest uppercase text-[color:var(--text-muted)]">Rest (s)</label>
              <input type="number" value={restTime} onChange={e => setRestTime(Number(e.target.value))} className="w-full bg-[var(--color-surface-hover)] border border-[color:var(--color-border)] rounded-xl py-3 px-4 text-center text-xl font-headline font-bold text-[color:var(--secondary)] outline-none" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="font-label text-[10px] tracking-widest uppercase text-[color:var(--text-muted)]">Rounds</label>
            <input type="number" value={rounds} onChange={e => setRounds(Number(e.target.value))} className="w-full bg-[var(--color-surface-hover)] border border-[color:var(--color-border)] rounded-xl py-3 px-4 text-center text-xl font-headline font-bold text-[color:var(--text)] outline-none" />
          </div>
          <button onClick={startTimer} className="w-full bg-[var(--primary)] text-black font-headline font-black py-4 rounded-xl uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all">
            Initiate Sequence
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-12">
          {/* Circular Progress */}
          <div className="relative w-72 h-72 flex items-center justify-center">
            <svg className="absolute w-full h-full -rotate-90">
              <circle cx="144" cy="144" r="130" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
              <circle cx="144" cy="144" r="130" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={816} strokeDashoffset={816 - (816 * getProgress()) / 100} className={`${getPhaseColor()} transition-all duration-1000 ease-linear shadow-[0_0_20px_currentColor]`} />
            </svg>
            
            <div className="text-center z-10">
              <p className={`font-label text-xs tracking-widest uppercase mb-1 ${getPhaseColor()}`}>{phase}</p>
              <h2 className="font-headline font-black text-8xl tracking-tighter leading-none text-[color:var(--text)]">{timeLeft}</h2>
              <p className="font-label text-[10px] tracking-widest text-[color:var(--text-muted)] uppercase mt-2">Round {currentRound} / {rounds}</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => setIsMuted(!isMuted)} className="p-4 glass-panel rounded-full text-[color:var(--text-muted)] hover:text-white transition-colors">
              {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>
            <button onClick={() => setIsActive(!isActive)} className="w-20 h-20 bg-[var(--primary)] text-black rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-[0_0_30px_rgba(0,238,252,0.3)]">
              {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
            </button>
            <button onClick={resetTimer} className="p-4 glass-panel rounded-full text-[color:var(--text-muted)] hover:text-white transition-colors">
              <RotateCcw size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
