import React, { useState, useEffect } from 'react';
import { 
  Wrench, 
  Search, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Star, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  Info
} from 'lucide-react';
import { Installer } from '../types';
import { api } from '../services/api';
import { useSolar } from '../context/SolarContext';
import { INDIAN_STATES } from '../data/indianStates';
import { Disclaimer } from '../components/Disclaimer';

export const InstallersPage: React.FC = () => {
  const { inputState } = useSolar();

  const [installers, setInstallers] = useState<Installer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterState, setFilterState] = useState<string>(inputState.state || 'All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    fetchInstallers();
  }, [filterState, searchTerm]);

  const fetchInstallers = async () => {
    setLoading(true);
    try {
      const data = await api.getInstallers({
        state: filterState !== 'All' ? filterState : undefined,
        search: searchTerm ? searchTerm : undefined
      });
      setInstallers(data.installers);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-gov-200 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-solar-600 uppercase tracking-wider mb-1">
              <Wrench className="w-4 h-4" />
              <span>Verified Empanelled Solar Vendors</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gov-950 font-display">
              Authorised Solar Installers Directory
            </h1>
            <p className="text-xs sm:text-sm text-gov-600 mt-1">
              Directory of DISCOM-empanelled and MNRE-listed rooftop solar installation companies across India.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Empanelled Vendor Network
            </span>
          </div>
        </div>
      </div>

      {/* Checklist Banner: How to Choose an Installer */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-solar-50 via-amber-50/50 to-emerald-50 border border-solar-200 shadow-sm space-y-3">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-solar-700" />
          <h3 className="text-sm font-bold text-gov-950 font-display">
            How to Choose an Authorised Solar Installer (Consumer Protection Checklist)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-gov-700">
          <div className="flex items-start space-x-2 bg-white/80 p-2.5 rounded-xl border border-solar-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Verify DISCOM Empanelment:</strong> Confirm vendor active status on National Portal.</span>
          </div>
          <div className="flex items-start space-x-2 bg-white/80 p-2.5 rounded-xl border border-solar-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Insist on ALMM/DCR Modules:</strong> Mandatory for receiving government subsidy.</span>
          </div>
          <div className="flex items-start space-x-2 bg-white/80 p-2.5 rounded-xl border border-solar-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Compare 3 Quotations:</strong> Compare structure height, inverters & warranties.</span>
          </div>
          <div className="flex items-start space-x-2 bg-white/80 p-2.5 rounded-xl border border-solar-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>5-Year Mandatory CMC:</strong> Ensure 5 years free maintenance is included in agreement.</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-gov-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          
          {/* State Filter */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="font-semibold text-gov-600">State:</span>
            <select
              value={filterState}
              onChange={(e) => setFilterState(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-gov-300 bg-gov-50 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-solar-500"
            >
              <option value="All">All States</option>
              {Object.keys(INDIAN_STATES).map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-gov-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search vendor or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-gov-300 text-xs focus:outline-none focus:ring-2 focus:ring-solar-500"
            />
          </div>

        </div>

        <div className="text-xs text-gov-500 font-medium">
          Showing <strong>{installers.length}</strong> verified installers
        </div>
      </div>

      {/* Installers Cards Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-solar-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-gov-500">Loading empanelled installer directory...</p>
        </div>
      ) : installers.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-gov-200 space-y-3">
          <Info className="w-8 h-8 text-gov-400 mx-auto" />
          <h3 className="text-sm font-bold text-gov-900">No installers found matching your search</h3>
          <p className="text-xs text-gov-500">Try changing your state filter or search keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {installers.map((inst) => (
            <div
              key={inst.id}
              className="p-6 rounded-3xl bg-white border border-gov-200 shadow-card hover:shadow-soft transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                
                {/* Header */}
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <ShieldCheck className="w-3 h-3" /> {inst.authorised_status}
                    </span>
                    <h3 className="text-base font-bold text-gov-950 font-display mt-1.5">
                      {inst.name}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200 text-xs font-bold text-amber-900">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>{inst.rating}</span>
                  </div>
                </div>

                {/* Location & Projects */}
                <div className="space-y-1 text-xs text-gov-600">
                  <p className="flex items-center gap-1.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-gov-400" />
                    <span>{inst.city}, {inst.state}</span>
                  </p>
                  <p className="text-[11px] text-gov-500">
                    Service Area: <strong>{inst.service_area}</strong>
                  </p>
                  <p className="text-[11px] text-emerald-700 font-semibold">
                    ✓ {inst.completed_projects}+ Rooftop Installations Completed
                  </p>
                </div>

                {/* Contact Info Box */}
                <div className="p-3.5 rounded-2xl bg-gov-50 border border-gov-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-gov-700">
                    <span className="text-gov-500">Representative:</span>
                    <span className="font-semibold text-gov-900">{inst.contact}</span>
                  </div>
                  <div className="flex items-center justify-between text-gov-700">
                    <span className="text-gov-500">Phone:</span>
                    <a href={`tel:${inst.phone}`} className="font-bold text-solar-700 hover:underline">
                      {inst.phone}
                    </a>
                  </div>
                  {inst.email && (
                    <div className="flex items-center justify-between text-gov-700 truncate">
                      <span className="text-gov-500">Email:</span>
                      <span className="font-medium text-gov-800 text-[11px]">{inst.email}</span>
                    </div>
                  )}
                </div>

                <div className="text-[10px] text-gov-400 flex items-center justify-between">
                  <span>Source: {inst.verification_source}</span>
                  <span>{inst.is_demo ? 'Demo Verified' : 'Live MNRE'}</span>
                </div>

              </div>

              {/* Card Actions */}
              <div className="pt-4 border-t border-gov-100 mt-4 flex items-center gap-2">
                <a
                  href={`tel:${inst.phone}`}
                  className="flex-1 py-2 rounded-xl bg-gov-900 hover:bg-gov-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Vendor</span>
                </a>

                {inst.website && (
                  <a
                    href={inst.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl border border-gov-300 hover:bg-gov-50 text-gov-700 transition-colors"
                    title="Visit website"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

      <Disclaimer variant="banner" customText="Installer listings are provided for consumer guidance. Always verify vendor registration on the National Solar Portal (pmsuryaghar.gov.in) before making advance payments." />

    </div>
  );
};
