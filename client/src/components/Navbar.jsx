import { Link, useLocation } from 'react-router-dom';
import { Activity, Dumbbell, BarChart, CalendarCheck, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const NavItem = ({ to, icon, label }) => {
    const active = location.pathname === to;
    return (
      <Link to={to} className={`flex flex-col items-center justify-center transition-all duration-300 ease-out px-4 py-2 ${active ? 'bg-primary/20 text-primary rounded-full scale-110 shadow-[0_0_15px_rgba(0,238,252,0.3)]' : 'text-gray-500 scale-95 hover:text-white'}`}>
        {icon}
        <span className="font-label text-[9px] font-bold tracking-widest uppercase mt-1">{label}</span>
      </Link>
    );
  };

  return (
    <nav className="fixed bottom-6 left-0 right-0 z-50 flex justify-around items-center h-16 max-w-lg mx-auto glass-panel rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.2)] px-2">
      <NavItem to="/dashboard" icon={<Activity size={20} />} label="Dash" />
      <NavItem to="/planner" icon={<CalendarCheck size={20} />} label="Plan" />
      
      <button 
        onClick={toggleTheme}
        className="flex flex-col items-center justify-center transition-all duration-300 ease-out px-4 py-2 scale-95 hover:text-[var(--color-primary)] text-muted hover:-translate-y-1"
        aria-label="Toggle Theme"
      >
        {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      <NavItem to="/add-workout" icon={<Dumbbell size={20} />} label="Log" />
      <NavItem to="/bmi" icon={<BarChart size={20} />} label="BMI" />
    </nav>
  );
}
