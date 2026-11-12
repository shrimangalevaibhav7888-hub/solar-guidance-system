import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Search, 
  Filter, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Building2, 
  ShieldCheck, 
  Sparkles,
  ChevronRight,
  Info,
  X
} from 'lucide-react';
import { Scheme, SchemeEligibilityMatch } from '../types';
import { api } from '../services/api';
import { useSolar } from '../context/SolarContext';
import { INDIAN_STATES } from '../data/indianStates';
import { StepWizardNav } from '../components/StepWizardNav';
import { Disclaimer } from '../components/Disclaimer';

export const SchemeExplorerPage: React.FC = () => {
  const { inputState, result } = useSolar();

  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterState, setFilterState] = useState<string>(inputState.state || 'All');
  const [filterPropType, setFilterPropType] = useState<string>(inputState.propertyType || 'All');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);

  // Eligibility Evaluation State
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [eligibilityResults, setEligibilityResults] = useState<SchemeEligibilityMatch[]>([]);
  const [showEligibilityModal, setShowEligibilityModal] = useState<boolean>(false);

  useEffect(() => {
    fetchSchemes();
  }, [filterState, filterPropType, filterCategory]);

  const fetchSchemes = async () => {
    setLoading(true);
    try {
      const data = await api.getSchemes({
        state: filterState !== 'All' ? filterState : undefined,
        property_type: filterPropType !== 'All' ? filterPropType : undefined,
        category: filterCategory !== 'All' ? filterCategory : undefined
      });
      setSchemes(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const runEligibilityCheck = async () => {
    setIsEvaluating(true);
    try {
      const res = await api.checkEligibility({
        state: inputState.state,
        property_type: inputState.propertyType,
        recommended_capacity_kw: result?.recommended_capacity_kw || 3.3,
        has_active_grid_connection: inputState.hasGridConnection,
        has_roof_rights: inputState.hasRoofRights
      });
      setEligibilityResults(res.matching_schemes);
      setShowEligibilityModal(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-gov-200 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-solar-600 uppercase tracking-wider mb-1">
              <Award className="w-4 h-4" />
              <span>Step 3 of 8 • Government Solar Schemes & Subsidies</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gov-950 font-display">
              Government Solar Schemes Directory
            </h1>
            <p className="text-xs sm:text-sm text-gov-600 mt-1">
              Discover verified central financial assistance (PM Surya Ghar) and state-specific rooftop solar policies with official application links.
            </p>
          </div>

          <button
            onClick={runEligibilityCheck}
            disabled={isEvaluating}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isEvaluating ? 'Evaluating...' : 'Check My Exact Scheme Eligibility'}</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
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
              <option value="All">All States (National + State)</option>
              {Object.keys(INDIAN_STATES).map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* Property Filter */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="font-semibold text-gov-600">Property:</span>
            <select
              value={filterPropType}
              onChange={(e) => setFilterPropType(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-gov-300 bg-gov-50 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-solar-500"
            >
              <option value="All">All Property Types</option>
              <option value="Home">Residential Home</option>
              <option value="Shop">Commercial / Shop</option>
              <option value="Institution">Institution / Hospital / School</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="font-semibold text-gov-600">Category:</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-gov-300 bg-gov-50 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-solar-500"
            >
              <option value="All">All Categories</option>
              <option value="Central">Central Schemes</option>
              <option value="State">State Policies</option>
            </select>
          </div>

        </div>

        <div className="text-xs text-gov-500 font-medium">
          Showing <strong>{schemes.length}</strong> active schemes
        </div>
      </div>

      {/* Schemes Cards Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-solar-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-gov-500">Loading government schemes from database...</p>
        </div>
      ) : schemes.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-gov-200 space-y-3">
          <Info className="w-8 h-8 text-gov-400 mx-auto" />
          <h3 className="text-sm font-bold text-gov-900">No matching schemes found for this filter</h3>
          <p className="text-xs text-gov-500">Try selecting "All States" or clearing your property filter.</p>
          <button
            onClick={() => { setFilterState('All'); setFilterPropType('All'); setFilterCategory('All'); }}
            className="px-4 py-2 rounded-xl bg-solar-500 text-white text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schemes.map((scheme) => (
            <div
              key={scheme.id}
              className="p-6 rounded-3xl bg-white border border-gov-200 shadow-card hover:shadow-soft transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                
                {/* Header Strip */}
                <div className="flex justify-between items-start gap-2">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    scheme.category === 'Central' 
                      ? 'bg-amber-100 text-amber-800 border-amber-200' 
                      : 'bg-blue-100 text-blue-800 border-blue-200'
                  }`}>
                    {scheme.category} Scheme • {scheme.state}
                  </span>
                  
                  <span className="text-[10px] text-gov-400">
                    Verified: {scheme.last_verified_date}
                  </span>
                </div>

                {/* Scheme Title */}
                <div>
                  <h3 className="text-base font-bold text-gov-950 font-display group-hover:text-solar-600 transition-colors">
                    {scheme.scheme_name}
                  </h3>
                  <p className="text-[11px] text-gov-500 font-medium mt-0.5">{scheme.ministry}</p>
                </div>

                <p className="text-xs text-gov-600 line-clamp-3 leading-relaxed">
                  {scheme.description}
                </p>

                {/* Subsidy Highlight Box */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-solar-50 to-amber-50/70 border border-solar-200">
                  <span className="text-[10px] font-semibold text-gov-600 block">Potential Financial Benefit</span>
                  <span className="text-sm font-black text-gov-950 font-display">{scheme.subsidy_amount}</span>
                  {scheme.subsidy_percentage && (
                    <span className="text-[10px] text-solar-700 font-semibold block">{scheme.subsidy_percentage}</span>
                  )}
                </div>

                {/* Property badges */}
                <div className="flex flex-wrap gap-1.5 text-[10px]">
                  {scheme.applicable_property_type.split(',').map((p, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-gov-100 text-gov-700 font-medium">
                      {p.trim()}
                    </span>
                  ))}
                </div>

              </div>

              {/* Card Footer Actions */}
              <div className="pt-5 border-t border-gov-100 mt-5 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedScheme(scheme)}
                  className="text-xs font-bold text-gov-800 hover:text-solar-600 transition-colors"
                >
                  View Details & Process
                </button>

                <a
                  href={scheme.official_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-gov-900 hover:bg-gov-800 text-white text-xs font-bold transition-all"
                >
                  <span>Official Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Scheme Detail Modal */}
      {selectedScheme && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95">
            
            <div className="flex justify-between items-start pb-4 border-b border-gov-100">
              <div>
                <span className="text-xs font-bold text-solar-600 uppercase tracking-wider">{selectedScheme.category} Scheme • {selectedScheme.state}</span>
                <h3 className="text-xl font-bold text-gov-950 font-display mt-1">{selectedScheme.scheme_name}</h3>
                <p className="text-xs text-gov-500">{selectedScheme.ministry}</p>
              </div>
              <button
                onClick={() => setSelectedScheme(null)}
                className="p-1 rounded-lg text-gov-400 hover:text-gov-700 hover:bg-gov-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              
              <div>
                <h4 className="font-bold text-gov-900 mb-1">Description</h4>
                <p className="text-gov-600 leading-relaxed">{selectedScheme.description}</p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <h4 className="font-bold text-emerald-900 mb-1">Financial Subsidy / Benefit</h4>
                <p className="text-emerald-800 font-semibold">{selectedScheme.subsidy_amount}</p>
                <p className="text-emerald-700 text-[11px] mt-1">Disbursal Type: {selectedScheme.subsidy_type}</p>
              </div>

              <div>
                <h4 className="font-bold text-gov-900 mb-1">Eligibility Criteria</h4>
                <div className="text-gov-600 whitespace-pre-line leading-relaxed bg-gov-50 p-3 rounded-xl border border-gov-100">
                  {selectedScheme.eligibility}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gov-900 mb-1">Step-by-Step Application Process</h4>
                <div className="text-gov-600 whitespace-pre-line leading-relaxed bg-gov-50 p-3 rounded-xl border border-gov-100">
                  {selectedScheme.application_process}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gov-900 mb-1">Required Documents</h4>
                <div className="text-gov-600 whitespace-pre-line leading-relaxed bg-gov-50 p-3 rounded-xl border border-gov-100">
                  {selectedScheme.required_documents}
                </div>
              </div>

            </div>

            <div className="pt-4 border-t border-gov-100 flex justify-between items-center">
              <span className="text-[11px] text-gov-400">Last verified: {selectedScheme.last_verified_date}</span>
              <a
                href={selectedScheme.official_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-solar-500 hover:bg-solar-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <span>Apply on Official Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        </div>
      )}

      {/* Scheme Eligibility Evaluation Results Modal */}
      {showEligibilityModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95">
            
            <div className="flex justify-between items-start pb-4 border-b border-gov-100">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Automated Eligibility Report</span>
                <h3 className="text-xl font-bold text-gov-950 font-display mt-1">
                  Scheme Compatibility for {inputState.propertyType} in {inputState.state}
                </h3>
                <p className="text-xs text-gov-500">Based on recommended capacity: {result?.recommended_capacity_kw || 3.3} kW</p>
              </div>
              <button
                onClick={() => setShowEligibilityModal(false)}
                className="p-1 rounded-lg text-gov-400 hover:text-gov-700 hover:bg-gov-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {eligibilityResults.map((match, idx) => {
                const statusColor = match.match_status === 'ELIGIBLE'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : match.match_status === 'POTENTIALLY_ELIGIBLE'
                  ? 'bg-amber-50 border-amber-200 text-amber-950'
                  : 'bg-slate-50 border-slate-200 text-slate-800';

                return (
                  <div key={idx} className={`p-4 rounded-2xl border ${statusColor} space-y-3`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            match.match_status === 'ELIGIBLE' ? 'bg-emerald-600 text-white' : match.match_status === 'POTENTIALLY_ELIGIBLE' ? 'bg-amber-600 text-white' : 'bg-slate-600 text-white'
                          }`}>
                            {match.match_status.replace('_', ' ')}
                          </span>
                          <h4 className="text-sm font-bold">{match.scheme.scheme_name}</h4>
                        </div>
                        <p className="text-[11px] text-gov-600 mt-0.5">{match.potential_subsidy_display}</p>
                      </div>

                      <span className="text-xs font-bold font-mono">
                        {match.match_score}% Match
                      </span>
                    </div>

                    {/* Criteria Checkpoints */}
                    <div className="space-y-1.5 text-xs">
                      {match.reasons.map((r, i) => (
                        <p key={i} className="text-emerald-800 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{r}</span>
                        </p>
                      ))}

                      {match.missing_criteria.map((m, i) => (
                        <p key={i} className="text-rose-700 flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                          <span>{m}</span>
                        </p>
                      ))}
                    </div>

                    {/* Action Items */}
                    {match.action_items.length > 0 && (
                      <div className="pt-2 border-t border-gov-200/60 text-xs">
                        <span className="font-bold text-gov-800 block mb-1">Recommended Next Steps:</span>
                        <ul className="list-disc list-inside space-y-0.5 text-gov-600 text-[11px]">
                          {match.action_items.map((act, i) => (
                            <li key={i}>{act}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-gov-100 flex justify-end">
              <button
                onClick={() => setShowEligibilityModal(false)}
                className="px-6 py-2.5 rounded-xl bg-gov-950 text-white text-xs font-bold"
              >
                Close Report
              </button>
            </div>

          </div>
        </div>
      )}

      <Disclaimer variant="banner" customText="Government scheme guidelines and subsidy values are subject to periodic MNRE/DISCOM updates. Verify active guidelines on official state and national portals before making financial commitments." />

      <StepWizardNav
        currentStep={3}
        totalSteps={8}
        backPath="/solar-results"
        nextPath="/cost-estimator"
        nextLabel="Explore Cost Breakdown & Subsidy"
      />

    </div>
  );
};
