import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function Login({ setToken }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      window.dispatchEvent(new Event('storage'));
      navigate('/dashboard');
    } catch (err) { alert(err.response?.data?.msg || 'Error logging in'); }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center px-4 max-w-md mx-auto animate-fade-in relative z-10">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -z-10"></div>
      <div className="text-center mb-10">

        <h1 className="font-headline text-5xl font-black tracking-tighter uppercase mb-1">Kinetic</h1>
        <p className="font-label text-primary tracking-widest text-xs uppercase">Precision Tracking</p>
      </div>
      <form onSubmit={handleSubmit} className="bg-gradient-to-b from-[#20201f] to-[#131313] p-8 rounded-3xl shadow-2xl border border-[#333] space-y-6">
        <div className="space-y-2">
          <label className="font-label text-[10px] tracking-widest uppercase text-gray-400">Identify</label>
          <div className="relative">
            <input className="w-full bg-[#0e0e0e] border border-[#333] rounded-xl py-4 px-4 text-white focus:ring-1 focus:ring-primary/50 transition-all font-body text-sm placeholder:text-gray-600 outline-none" type="email" placeholder="Email Address" required onChange={e=>setFormData({...formData, email: e.target.value})} />
          </div>
        </div>
        <div className="space-y-2">
          <label className="font-label text-[10px] tracking-widest uppercase text-gray-400">Passcode</label>
          <div className="relative">
            <input className="w-full bg-[#0e0e0e] border border-[#333] rounded-xl py-4 px-4 text-white focus:ring-1 focus:ring-primary/50 transition-all font-body text-sm placeholder:text-gray-600 outline-none" type="password" placeholder="••••••••" required onChange={e=>setFormData({...formData, password: e.target.value})} />
          </div>
        </div>
        
        <button disabled={loading} type="submit" className="w-full bg-primary text-[#0e0e0e] font-headline font-black py-4 mt-4 rounded-full tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-[#b0df00] transition-colors active:scale-95 disabled:opacity-50">
          <span>{loading ? 'Authenticating...' : 'Commence'}</span>
        </button>
        <p className="text-xs text-center text-gray-500 font-label tracking-wider uppercase mt-6">Not cleared? <Link className="text-primary hover:underline hover:text-white transition-colors" to="/signup">Request Access</Link></p>
      </form>
    </div>
  );
}
