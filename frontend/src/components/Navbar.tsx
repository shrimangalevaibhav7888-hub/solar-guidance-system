import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Sun, 
  Leaf, 
  Calculator, 
  Award, 
  Wrench, 
  Compass, 
  BookOpen, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Zap,
  FileText,
  Sliders
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSolar } from '../context/SolarContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, demoLogin } = useAuth();
  const { loadDemoScenario, isCalculating } = useSolar();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleDemoClick = async () => {
    try {
      if (!isAuthenticated) {
        await demoLogin();
      }
      await loadDemoScenario();
      navigate('/solar-results');
      setMobileMenuOpen(false);
    } catch (e) {
      navigate('/calculator');
    }
  };

  const navLinks = [
    { name: 'Calculator', path: '/calculator', icon: Calculator },
    { name: 'Schemes', path: '/schemes', icon: Award },
    { name: 'Cost & Subsidy', path: '/cost-estimator', icon: Zap },
    { name: 'Savings', path: '/savings', icon: Compass },
    { name: 'Installers', path: '/installers', icon: Wrench },
    { name: 'Guide', path: '/installation-guide', icon: BookOpen },
    { name: 'Learn Solar', path: '/learn-solar', icon: Leaf },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gov-200 shadow-sm no-print">
      {/* Top Govt / National Initiative Strip */}
      <div className="bg-gov-900 text-slate-200 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium text-slate-100">National Clean Energy Initiative</span>
            <span className="hidden sm:inline text-slate-400">• PM Surya Ghar: Muft Bijli Yojana Integrated</span>
          </div>
          <div className="flex items-center space-x-4 text-slate-300 text-[11px]">
            <span className="hidden md:inline">Helpline: <strong>15555</strong> (Toll Free)</span>
            <Link to="/settings" className="hover:text-solar-400 flex items-center gap-1 transition-colors">
              <Sliders className="w-3 h-3" /> System Assumptions
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-solar-400 to-solar-600 flex items-center justify-center shadow-md shadow-solar-500/20 group-hover:scale-105 transition-transform">
              <Sun className="w-6 h-6 text-white animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-black tracking-tight text-gov-950 font-display">Solar<span className="text-solar-600">Sahayak</span></span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-eco-100 text-eco-800 border border-eco-200">Gov Guide</span>
              </div>
              <p className="text-[10px] text-gov-500 font-medium tracking-tight hidden sm:block">Plan • Estimate • Apply</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center space-x-1.5 ${
                    active 
                      ? 'bg-solar-50 text-solar-700 border border-solar-200 shadow-sm' 
                      : 'text-gov-700 hover:text-gov-950 hover:bg-gov-100/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-solar-600' : 'text-gov-400'}`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs & Auth */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* Quick 1-Click Demo Button */}
            <button
              onClick={handleDemoClick}
              disabled={isCalculating}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-sm shadow-amber-500/30 active:scale-95 transition-all"
              title="1-Click realistic Maharashtra Home demo calculation"
            >
              <Zap className="w-3.5 h-3.5 fill-current text-white" />
              <span>{isCalculating ? 'Calculating...' : 'Try Demo (MH Home)'}</span>
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 p-1.5 pr-3 rounded-lg border border-gov-200 hover:bg-gov-50 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-solar-100 text-solar-800 flex items-center justify-center font-bold text-xs">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="text-xs font-semibold text-gov-800 max-w-[100px] truncate">{user?.name}</span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-elevated border border-gov-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-gov-100">
                      <p className="text-xs font-bold text-gov-900">{user?.name}</p>
                      <p className="text-[11px] text-gov-500 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-medium">
                        {user?.state} • {user?.property_type}
                      </span>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-xs text-gov-700 hover:bg-gov-50 font-medium"
                    >
                      <User className="w-3.5 h-3.5 mr-2 text-gov-400" />
                      My Solar Dashboard
                    </Link>

                    <Link
                      to="/report"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-xs text-gov-700 hover:bg-gov-50 font-medium"
                    >
                      <FileText className="w-3.5 h-3.5 mr-2 text-gov-400" />
                      Personalized Report
                    </Link>

                    <div className="border-t border-gov-100 my-1"></div>

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center px-4 py-2 text-xs text-red-600 hover:bg-red-50 font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5 mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-bold text-gov-700 hover:text-gov-950 rounded-lg hover:bg-gov-100 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-gov-900 hover:bg-gov-800 rounded-lg shadow-sm transition-all active:scale-95"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={handleDemoClick}
              className="p-1.5 px-2 text-[11px] font-bold rounded bg-amber-500 text-white flex items-center gap-1"
            >
              <Zap className="w-3 h-3 fill-current" /> Demo
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gov-700 hover:bg-gov-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gov-200 bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2 shadow-lg">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-gov-100">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-2 p-2.5 rounded-lg text-xs font-semibold ${
                    isActive(link.path) ? 'bg-solar-50 text-solar-700 font-bold border border-solar-200' : 'text-gov-700 hover:bg-gov-50'
                  }`}
                >
                  <Icon className="w-4 h-4 text-solar-500" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center space-x-2 w-full py-2.5 rounded-lg bg-solar-500 text-white text-xs font-bold"
                >
                  <User className="w-4 h-4" />
                  <span>My Solar Dashboard ({user?.name})</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 rounded-lg border border-red-200 text-red-600 text-xs font-bold"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center rounded-lg border border-gov-300 text-gov-800 text-xs font-bold"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center rounded-lg bg-gov-900 text-white text-xs font-bold"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
