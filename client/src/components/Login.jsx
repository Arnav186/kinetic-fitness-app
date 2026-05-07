import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[90vh] px-4 animate-fade-in bg-[#f9fafb]">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-xl bg-white border border-[#e5e7eb]">
        <div className="relative">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-headline font-bold text-[#111827] mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-[#6b7280] font-body text-sm">
              {isLogin ? 'Enter your credentials to access your fitness data' : 'Start your fitness journey today'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-8 flex items-center gap-3 text-sm">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#6b7280] ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca3af]" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#fcfdfe] border border-[#e5e7eb] text-[#111827] rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/5 transition-all placeholder:text-[#9ca3af]"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#6b7280] ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca3af]" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#fcfdfe] border border-[#e5e7eb] text-[#111827] rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/5 transition-all placeholder:text-[#9ca3af]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : isLogin ? (
                <>
                  <LogIn size={20} />
                  Sign In
                </>
              ) : (
                <>
                  <UserPlus size={20} />
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-[#f3f4f6]">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#2563eb] hover:text-[#1d4ed8] transition-colors text-sm font-semibold"
            >
              {isLogin ? "Don't have an account? Create one" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

