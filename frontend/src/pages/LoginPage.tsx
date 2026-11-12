import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sun, Mail, Lock, Zap, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, demoLogin, isLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    setError(null);
    try {
      await login(email, password || 'solarsahayak123');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    }
  };

  const handleDemoClick = async () => {
    setError(null);
    try {
      await demoLogin();
      navigate('/dashboard');
    } catch (err: any) {
      setError('Demo login failed.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-3xl border border-gov-200 shadow-xl">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-solar-400 to-solar-600 flex items-center justify-center text-white mx-auto shadow-md">
            <Sun className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-gov-950 font-display">
            Sign In to SolarSahayak
          </h2>
          <p className="text-xs text-gov-500">
            Access your saved solar assessments, scheme eligibility reports & roadmap.
          </p>
        </div>

        {/* 1-Click Demo Login Banner */}
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-2">
          <span className="text-[11px] font-semibold text-amber-900 block">
            Hackathon / Evaluation Quick Access
          </span>
          <button
            type="button"
            onClick={handleDemoClick}
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs shadow-sm flex items-center justify-center space-x-1.5 transition-all active:scale-95"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>1-Click Demo Login (Aarav Sharma - MH)</span>
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-gov-800 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gov-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gov-300 focus:outline-none focus:ring-2 focus:ring-solar-500 text-xs"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-bold text-gov-800">Password</label>
              <span className="text-[11px] text-gov-400">Default: solarsahayak123</span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-gov-400 absolute left-3 top-3" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gov-300 focus:outline-none focus:ring-2 focus:ring-solar-500 text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gov-950 hover:bg-gov-900 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all active:scale-95 shadow-sm"
          >
            <span>{isLoading ? 'Signing in...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-gov-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-solar-600 hover:underline">
            Register for Free
          </Link>
        </div>

      </div>
    </div>
  );
};
