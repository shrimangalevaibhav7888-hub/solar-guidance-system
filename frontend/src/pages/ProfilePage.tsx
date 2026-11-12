import React, { useEffect } from 'react';
import { User as UserIcon, Mail, Phone, MapPin, Building2, Calendar, ShieldCheck, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-gov-200 pb-5">
        <h1 className="text-2xl sm:text-3xl font-black text-gov-950 font-display">
          User Profile & Solar Preferences
        </h1>
        <p className="text-xs sm:text-sm text-gov-600 mt-1">
          Manage your contact credentials, property location, and electricity connection details.
        </p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-gov-200 shadow-card space-y-6">
        
        <div className="flex items-center space-x-4 pb-6 border-b border-gov-100">
          <div className="w-16 h-16 rounded-2xl bg-solar-100 text-solar-800 flex items-center justify-center font-bold text-2xl">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gov-950 font-display">{user.name}</h2>
            <p className="text-xs text-gov-500">{user.email}</p>
            <div className="mt-2 flex items-center space-x-2">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Verified Citizen Account
              </span>
              {user.is_demo && (
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  Demo User
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          
          <div className="p-4 rounded-2xl bg-gov-50 space-y-1">
            <span className="text-gov-500 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Mobile Number</span>
            <p className="font-bold text-gov-900 font-mono">+91 {user.mobile}</p>
          </div>

          <div className="p-4 rounded-2xl bg-gov-50 space-y-1">
            <span className="text-gov-500 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> State & District</span>
            <p className="font-bold text-gov-900">{user.district || user.city}, {user.state} {user.pincode ? `(${user.pincode})` : ''}</p>
          </div>

          <div className="p-4 rounded-2xl bg-gov-50 space-y-1">
            <span className="text-gov-500 flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> Property Category</span>
            <p className="font-bold text-gov-900">{user.property_type}</p>
          </div>

          <div className="p-4 rounded-2xl bg-gov-50 space-y-1">
            <span className="text-gov-500 flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Consumer Category</span>
            <p className="font-bold text-gov-900">{user.consumer_category || 'Domestic / Residential'}</p>
          </div>

        </div>

        <div className="pt-4 border-t border-gov-100 flex justify-end">
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="px-5 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

      </div>

    </div>
  );
};
