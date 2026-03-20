import { Link, useLocation } from 'react-router-dom';
import { Activity, Dumbbell, Timer, BarChart } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const NavItem = ({ to, icon, label }) => {
    const active = location.pathname === to;
    return (
      <Link to={to} className={`flex flex-col items-center justify-center transition-all duration-200 ease-out px-4 py-2 ${active ? 'bg-[#f3ffca] text-[#0e0e0e] rounded-full scale-110' : 'text-[#adaaaa] scale-95 hover:text-white'}`}>
        {icon}
        <span className="font-label text-[9px] font-bold tracking-widest uppercase mt-1">{label}</span>
      </Link>
    );
  };

  return (
    <nav className="fixed bottom-6 left-0 right-0 z-50 flex justify-around items-center h-16 max-w-md mx-auto bg-[#262626]/60 backdrop-blur-lg rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.4)] px-2">
      <NavItem to="/dashboard" icon={<Activity size={20} />} label="Dash" />
      <NavItem to="/add-workout" icon={<Dumbbell size={20} />} label="Workout" />
      <NavItem to="/fasting" icon={<Timer size={20} />} label="Fast" />
      <NavItem to="/bmi" icon={<BarChart size={20} />} label="BMI" />
    </nav>
  );
}
