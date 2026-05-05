import { useState, useEffect, useContext } from 'react';
import { WorkoutContext } from '../context/WorkoutContext';
import { 
  CheckCircle, Timer, RefreshCw, 
  Target, Zap, Trophy, X, Heart
} from 'lucide-react';

const QUOTES = [
  "The only bad workout is the one that didn't happen.",
  "Sore today, strong tomorrow.",
  "Push harder than yesterday if you want a different tomorrow.",
  "Discipline will take you places motivation can't.",
  "Your body can stand almost anything. It's your mind that you have to convince."
];

const BASE_PLAN = [
  { day: 'Monday', muscle: 'Chest', icon: <Target size={20} />, exercises: ['Barbell Bench Press', 'Incline Dumbbell Press', 'Cable Crossovers', 'Push-ups'] },
  { day: 'Tuesday', muscle: 'Back', icon: <Zap size={20} />, exercises: ['Pull-ups (or Lat Pulldown)', 'Barbell Rows', 'Seated Cable Rows', 'Face Pulls'] },
  { day: 'Wednesday', muscle: 'Legs', icon: <ActivityIcon />, exercises: ['Barbell Squats', 'Leg Press', 'Romanian Deadlifts', 'Standing Calf Raises', 'Leg Extensions'] },
  { day: 'Thursday', muscle: 'Shoulders', icon: <Target size={20} />, exercises: ['Overhead Press', 'Lateral Raises', 'Front Raises', 'Reverse Pec Deck'] },
  { day: 'Friday', muscle: 'Arms', icon: <Zap size={20} />, exercises: ['Barbell Bicep Curls', 'Tricep Dips', 'Hammer Curls', 'Overhead Tricep Extension'] },
  { day: 'Saturday', muscle: 'Core + Cardio', icon: <Heart size={20} />, exercises: ['Plank (60 sec)', 'Russian Twists', 'Hanging Leg Raises', '20min HIIT Cycling'] },
  { day: 'Sunday', muscle: 'Rest / Active Recovery', icon: <Timer size={20} />, exercises: ['Light Stretching', 'Yoga Session (20 mins)', 'Walk (10k steps)'] },
];

function ActivityIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
  );
}

export default function WorkoutPlanner() {
  const { addWorkout } = useContext(WorkoutContext);

  const [goal, setGoal] = useState(() => localStorage.getItem('kinetic_goal') || 'Muscle Gain');
  const [level, setLevel] = useState(() => localStorage.getItem('kinetic_level') || 'Intermediate');
  const [completedDays, setCompletedDays] = useState(() => {
    const saved = localStorage.getItem('kinetic_completed_days');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('kinetic_goal', goal);
    localStorage.setItem('kinetic_level', level);
    localStorage.setItem('kinetic_completed_days', JSON.stringify(completedDays));
  }, [goal, level, completedDays]);
  const [quote] = useState(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  
  // Rest Timer State
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
      // Play a sound or alert ideally
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const toggleDayCompletion = (dayObj) => {
    if (completedDays.includes(dayObj.day)) {
      setCompletedDays(completedDays.filter(d => d !== dayObj.day));
    } else {
      setCompletedDays([...completedDays, dayObj.day]);
      // Connect to global workouts
      addWorkout({
        name: `${dayObj.muscle} Workout`,
        duration: 45,
        calories: 300
      });
    }
  };

  const getAdjustedSetsReps = () => {
    if (goal === 'Muscle Gain') return '4 sets x 8-12 reps';
    if (goal === 'Fat Loss') return '3 sets x 15-20 reps';
    return '3 sets x 10-15 reps';
  };

  const formatExerciseName = (name) => {
    if (level === 'Beginner' && name.includes('Barbell')) {
      return name.replace('Barbell', 'Dumbbell/Machine');
    }
    if (level === 'Advanced' && name.includes('Push-ups')) {
      return 'Weighted Dips / Deficit Push-ups';
    }
    return name;
  };

  const startRestTimer = (seconds) => {
    setShowTimer(true);
    setTimeLeft(seconds);
    setTimerActive(true);
  };

  const progressPct = Math.round((completedDays.length / 7) * 100);

  return (
    <div className="pb-24 animate-fade-in space-y-6 pt-6">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter uppercase text-[color:var(--text)]">Your Plan</h1>
          <p className="text-sm font-semibold tracking-widest text-[color:var(--primary)] uppercase mt-1">Weekly Blueprint</p>
        </div>
        <div className="h-12 w-12 glass-panel rounded-full flex items-center justify-center shadow-sm border border-[color:var(--color-border)]">
          <Trophy className="text-[color:var(--primary)]" size={24} />
        </div>
      </div>

      <div className="glass-panel border border-[color:var(--color-border)] rounded-2xl p-4 shadow-xl mb-6">
        <p className="text-[color:var(--text-muted)] italic text-sm text-center">"{quote}"</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="glass-panel p-4 border border-[color:var(--color-border)] rounded-2xl shadow-lg">
          <label className="text-[10px] font-bold text-[color:var(--text-muted)] op-70 uppercase tracking-widest mb-2 block">Fitness Goal</label>
          <select 
            className="w-full bg-transparent text-[color:var(--primary)] font-semibold focus:outline-none appearance-none cursor-pointer text-center"
            style={{ textAlignLast: 'center' }}
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          >
            <option className="glass-panel text-[color:var(--text)]" value="Muscle Gain">Muscle Gain</option>
            <option className="glass-panel text-[color:var(--text)]" value="Fat Loss">Fat Loss</option>
            <option className="glass-panel text-[color:var(--text)]" value="Maintenance">Maintenance</option>
          </select>
        </div>
        <div className="glass-panel p-4 border border-[color:var(--color-border)] rounded-2xl shadow-lg">
          <label className="text-[10px] font-bold text-[color:var(--text-muted)] op-70 uppercase tracking-widest mb-2 block">Experience Level</label>
          <select 
            className="w-full bg-transparent text-[color:var(--primary)] font-semibold focus:outline-none appearance-none cursor-pointer text-center"
            style={{ textAlignLast: 'center' }}
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <option className="glass-panel text-[color:var(--text)]" value="Beginner">Beginner</option>
            <option className="glass-panel text-[color:var(--text)]" value="Intermediate">Intermediate</option>
            <option className="glass-panel text-[color:var(--text)]" value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2 pt-2">
        <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-[color:var(--text-muted)]">
          <span>Weekly Progress</span>
          <span className="text-[color:var(--primary)]">{progressPct}%</span>
        </div>
        <div className="h-3 w-full glass-panel rounded-full overflow-hidden border border-[color:var(--color-border)]">
          <div 
            className="h-full bg-[var(--primary)] rounded-full transition-all duration-1000 ease-out "
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <div className="space-y-4 pt-4">
        {BASE_PLAN.map((plan, idx) => {
          const isCompleted = completedDays.includes(plan.day);
          const isRestDay = plan.day === 'Sunday';

          return (
            <div 
              key={idx} 
              className={`relative glass-panel border ${isCompleted ? 'border-[#f3ffca]/30' : 'border-[color:var(--color-border)]'} rounded-3xl p-5 shadow-xl overflow-hidden transition-all duration-300 hover:border-neutral-600 group`}
            >
              {isCompleted && (
                <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--primary)]/10 rounded-bl-full flex items-start justify-end p-3">
                  <CheckCircle size={20} className="text-[color:var(--primary)]" />
                </div>
              )}
              
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-xl ${isCompleted ? 'bg-[var(--primary)] text-[#0e0e0e]' : 'bg-[var(--color-surface-hover)] text-[color:var(--text-muted)]'}`}>
                  {plan.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[color:var(--text)] tracking-tight">{plan.day}</h3>
                  <p className={`text-sm tracking-wide font-medium ${isCompleted ? 'text-[color:var(--primary)]' : 'text-[color:var(--text-muted)] op-70'}`}>{plan.muscle}</p>
                </div>
              </div>

              <div className="space-y-3 mb-5">
                {plan.exercises.map((ex, i) => (
                  <div key={i} className="flex justify-between items-center group-hover:bg-[var(--color-surface-hover)]/50 p-2 rounded-lg transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-neutral-700"></div>
                      <span className="text-sm font-medium text-neutral-300">{formatExerciseName(ex)}</span>
                    </div>
                    {!isRestDay && (
                      <span className="text-xs font-mono text-[color:var(--text-muted)] op-70">{getAdjustedSetsReps()}</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => toggleDayCompletion(plan)}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-transparent border border-[#f3ffca]/30 text-[color:var(--primary)] hover:bg-[var(--primary)]/10' 
                      : 'bg-[var(--primary)] text-[#0e0e0e] hover:-translate-y-0.5'
                  }`}
                >
                  {isCompleted ? 'Completed' : 'Start Workout'}
                </button>
                
                {!isCompleted && !isRestDay && (
                  <button 
                    onClick={() => startRestTimer(60)}
                    className="p-3 bg-[var(--color-surface-hover)] text-[color:var(--text-muted)] hover:text-[color:var(--text)] hover:bg-neutral-700 rounded-xl transition-colors border border-transparent hover:border-neutral-600"
                    title="Start 60s Rest Timer"
                  >
                    <Timer size={20} />
                  </button>
                )}
                {!isCompleted && (
                  <button className="p-3 bg-[var(--color-surface-hover)] text-[color:var(--text-muted)] hover:text-[color:var(--text)] hover:bg-neutral-700 rounded-xl transition-colors border border-transparent hover:border-neutral-600" title="Swap Workout">
                    <RefreshCw size={20} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Rest Timer */}
      {showTimer && (
        <div className="fixed bottom-24 right-4 glass-panel border border-[#f3ffca] shadow-lg rounded-2xl p-4 flex items-center gap-4 z-50 animate-bounce-in">
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
            <button onClick={() => setTimeLeft(prev => prev + 30)} className="p-2 bg-[var(--color-surface-hover)] rounded-lg hover:bg-neutral-700 text-xs font-bold text-neutral-300">+30s</button>
            <button onClick={() => { setShowTimer(false); setTimerActive(false); }} className="p-2 bg-[var(--color-surface-hover)] rounded-lg hover:bg-neutral-700 text-[color:var(--text-muted)] hover:text-[color:var(--text)]">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
