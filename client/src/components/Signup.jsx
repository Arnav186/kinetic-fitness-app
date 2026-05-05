import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function Signup({ setToken }) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/signup', formData);
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      window.dispatchEvent(new Event('storage'));
      navigate('/dashboard');
    } catch (err) { alert(err.response?.data?.msg || 'Error signing up'); }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center px-4 max-w-md mx-auto animate-fade-in relative z-10">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#00eefc]/10 rounded-full blur-[80px] -z-10"></div>
      <div className="text-center mb-8">

        <h1 className="font-headline text-3xl font-black tracking-tighter uppercase mb-1">New Profile</h1>
        <p className="font-label text-[#00eefc] tracking-widest text-[10px] uppercase">Establish Parameters</p>
      </div>
      <form onSubmit={handleSubmit} className="bg-gradient-to-b from-[#20201f] to-[#131313] p-8 rounded-3xl shadow-2xl border border-[#333] space-y-6">
        <div className="space-y-2">
          <label className="font-label text-[10px] tracking-widest uppercase text-gray-400">Designation</label>
          <div className="relative">
            <input className="w-full bg-[#0e0e0e] border border-[#333] rounded-xl py-4 px-4 text-white focus:ring-1 focus:ring-[#00eefc]/50 transition-all font-body text-sm placeholder:text-gray-600 outline-none" type="text" placeholder="Callsign" required onChange={e=>setFormData({...formData, name: e.target.value})} />
          </div>
        </div>
        <div className="space-y-2">
          <label className="font-label text-[10px] tracking-widest uppercase text-gray-400">Identify</label>
          <div className="relative">
            <input className="w-full bg-[#0e0e0e] border border-[#333] rounded-xl py-4 px-4 text-white focus:ring-1 focus:ring-[#00eefc]/50 transition-all font-body text-sm placeholder:text-gray-600 outline-none" type="email" placeholder="Email Address" required onChange={e=>setFormData({...formData, email: e.target.value})} />
          </div>
        </div>
        <div className="space-y-2">
          <label className="font-label text-[10px] tracking-widest uppercase text-gray-400">Passcode</label>
          <div className="relative">
             <input className="w-full bg-[#0e0e0e] border border-[#333] rounded-xl py-4 px-4 text-white focus:ring-1 focus:ring-[#00eefc]/50 transition-all font-body text-sm placeholder:text-gray-600 outline-none" type="password" placeholder="••••••••" required onChange={e=>setFormData({...formData, password: e.target.value})} />
          </div>
        </div>
        
        <button disabled={loading} type="submit" className="w-full bg-[#00eefc] text-[#0e0e0e] font-headline font-black py-4 mt-4 rounded-full tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-[#00c9d6] transition-colors active:scale-95 disabled:opacity-50">
          <span>{loading ? 'Processing...' : 'Register'}</span>
        </button>
        <p className="text-xs text-center text-gray-500 font-label tracking-wider uppercase mt-6">Cleared? <Link className="text-[#00eefc] hover:underline transition-colors" to="/login">Login</Link></p>
      </form>
    </div>
  );
}
