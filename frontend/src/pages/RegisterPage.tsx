import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sun, User, Mail, Phone, MapPin, Building2, Lock, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { INDIAN_STATES } from '../data/indianStates';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [district, setDistrict] = useState('Pune');
  const [city, setCity] = useState('Pune');
  const [pincode, setPincode] = useState('');
  const [propertyType, setPropertyType] = useState('Home');
  const [password, setPassword] = useState('solarsahayak123');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const stateData = INDIAN_STATES[state] || INDIAN_STATES['Maharashtra'];

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Full name is required.';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) errs.email = 'Valid email address is required.';
    if (!mobile.trim() || !/^[6-9]\d{9}$/.test(mobile)) errs.mobile = 'Enter a valid 10-digit Indian mobile number (starts with 6,7,8,9).';
    if (!state) errs.state = 'Please select a state.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setApiError(null);

    try {
      await register({
        name,
        email,
        mobile,
        state,
        district: district || city,
        city: city || district,
        pincode,
        property_type: propertyType,
        consumer_category: propertyType === 'Home' ? 'Domestic/Residential' : 'Non-Domestic',
        password
      });
      navigate('/dashboard');
    } catch (err: any) {
      setApiError(err.message || 'Registration failed. Please check your inputs.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full space-y-6 bg-white p-8 rounded-3xl border border-gov-200 shadow-xl">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-solar-400 to-solar-600 flex items-center justify-center text-white mx-auto shadow-md">
            <Sun className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-gov-950 font-display">
            Create Your SolarSahayak Account
          </h2>
          <p className="text-xs text-gov-500">
            Register to save your personalized solar assessment, compare subsidies & track rooftop installation.
          </p>
        </div>

        {apiError && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{apiError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Full Name */}
          <div>
            <label className="block font-bold text-gov-800 mb-1">Full Name <span className="text-red-500">*</span></label>
            <div className="relative">
              <User className="w-4 h-4 text-gov-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Patil"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gov-300 focus:outline-none focus:ring-2 focus:ring-solar-500 text-xs"
              />
            </div>
            {errors.name && <p className="text-[11px] text-red-600 mt-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Email */}
            <div>
              <label className="block font-bold text-gov-800 mb-1">Email Address <span className="text-red-500">*</span></label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gov-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="ramesh@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gov-300 focus:outline-none focus:ring-2 focus:ring-solar-500 text-xs"
                />
              </div>
              {errors.email && <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>}
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block font-bold text-gov-800 mb-1">Mobile (10-digit) <span className="text-red-500">*</span></label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gov-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="9876543210"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gov-300 focus:outline-none focus:ring-2 focus:ring-solar-500 text-xs font-mono"
                />
              </div>
              {errors.mobile && <p className="text-[11px] text-red-600 mt-1">{errors.mobile}</p>}
            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* State */}
            <div>
              <label className="block font-bold text-gov-800 mb-1">State <span className="text-red-500">*</span></label>
              <select
                value={state}
                onChange={(e) => {
                  setState(e.target.value);
                  const sD = INDIAN_STATES[e.target.value];
                  if (sD && sD.districts.length > 0) {
                    setDistrict(sD.districts[0]);
                    setCity(sD.districts[0]);
                  }
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-gov-300 bg-gov-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-solar-500"
              >
                {Object.keys(INDIAN_STATES).map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            {/* District / City */}
            <div>
              <label className="block font-bold text-gov-800 mb-1">District / City</label>
              <select
                value={district}
                onChange={(e) => {
                  setDistrict(e.target.value);
                  setCity(e.target.value);
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-gov-300 bg-gov-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-solar-500"
              >
                {stateData.districts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Property Type */}
            <div>
              <label className="block font-bold text-gov-800 mb-1">Property Type</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gov-300 bg-gov-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-solar-500"
              >
                <option value="Home">Home / Residential</option>
                <option value="Shop">Shop / Commercial</option>
                <option value="Institution">Institution / Hospital</option>
              </select>
            </div>

            {/* PIN Code */}
            <div>
              <label className="block font-bold text-gov-800 mb-1">PIN Code (Optional)</label>
              <input
                type="text"
                maxLength={6}
                placeholder="411001"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                className="w-full px-3 py-2.5 rounded-xl border border-gov-300 focus:outline-none focus:ring-2 focus:ring-solar-500 text-xs font-mono"
              />
            </div>

          </div>

          <div>
            <label className="block font-bold text-gov-800 mb-1">Password</label>
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
            className="w-full py-3.5 rounded-xl bg-gov-950 hover:bg-gov-900 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all active:scale-95 shadow-md"
          >
            <span>{isLoading ? 'Creating Account...' : 'Complete Registration & Go to Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-gov-600">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-solar-600 hover:underline">
            Sign In Here
          </Link>
        </div>

      </div>
    </div>
  );
};
