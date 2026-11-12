import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  RefreshCw, 
  Save, 
  Check, 
  ShieldCheck, 
  Info, 
  Cpu, 
  Database,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';
import { Disclaimer } from '../components/Disclaimer';

export const SettingsPage: React.FC = () => {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    loadAssumptions();
  }, []);

  const loadAssumptions = async () => {
    setLoading(true);
    try {
      const data = await api.getAssumptions();
      setConfig(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (key: string) => {
    try {
      await api.updateAssumption(key, editValue);
      setSuccessMsg(`Successfully updated parameter '${key}' to ${editValue}`);
      setEditingKey(null);
      loadAssumptions();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (e: any) {
      alert(e.message || 'Failed to update assumption');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-gov-200 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-solar-600 uppercase tracking-wider mb-1">
              <Sliders className="w-4 h-4" />
              <span>Engineering Assumptions & Configuration</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gov-950 font-display">
              Centralized Calculation Parameters
            </h1>
            <p className="text-xs sm:text-sm text-gov-600 mt-1">
              Inspect and configure the core physics, degradation models, tariff rates, and subsidy constants used throughout SolarSahayak.
            </p>
          </div>

          <button
            onClick={loadAssumptions}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl border border-gov-300 hover:bg-gov-50 text-xs font-bold text-gov-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload Config</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-bold animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-solar-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-gov-500">Loading system parameters from backend...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Assumptions Table */}
          <div className="lg:col-span-8 space-y-6">
            <div className="p-6 rounded-3xl bg-white border border-gov-200 shadow-card space-y-4">
              <h3 className="text-base font-bold text-gov-950 font-display flex items-center gap-2">
                <Database className="w-4 h-4 text-solar-600" />
                <span>Active Backend Database Assumptions</span>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-gov-50 text-gov-700 font-bold border-b border-gov-200">
                    <tr>
                      <th className="py-2.5 px-3 rounded-l-lg">Parameter Key</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Active Value</th>
                      <th className="py-2.5 px-3 rounded-r-lg">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gov-100 text-gov-800">
                    {config?.assumptions?.map((item: any) => {
                      const isEditing = editingKey === item.key;
                      return (
                        <tr key={item.key}>
                          <td className="py-3 px-3">
                            <p className="font-bold text-gov-950 font-mono">{item.key}</p>
                            <p className="text-[11px] text-gov-500 max-w-xs">{item.description}</p>
                          </td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded bg-gov-100 text-gov-700 font-semibold text-[10px]">
                              {item.category}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-mono font-bold">
                            {isEditing ? (
                              <input
                                type="number"
                                step="any"
                                value={editValue}
                                onChange={(e) => setEditValue(Number(e.target.value))}
                                className="w-24 px-2 py-1 rounded border border-solar-400 font-mono text-xs focus:outline-none"
                              />
                            ) : (
                              <span>{item.value} {item.unit || ''}</span>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            {isEditing ? (
                              <div className="flex items-center space-x-1">
                                <button
                                  onClick={() => handleUpdate(item.key)}
                                  className="p-1.5 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                                  title="Save"
                                >
                                  <Save className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setEditingKey(null)}
                                  className="p-1.5 rounded bg-gov-200 text-gov-700 hover:bg-gov-300 text-[10px]"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setEditingKey(item.key);
                                  setEditValue(item.value);
                                }}
                                className="text-solar-700 hover:text-solar-800 font-bold hover:underline"
                              >
                                Edit
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right: Hardware & Subsidy Tier Cards */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Standard Panel Tiers */}
            <div className="p-6 rounded-3xl bg-white border border-gov-200 shadow-card space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gov-700 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-solar-600" />
                <span>ALMM Solar Panel Specifications</span>
              </h4>

              <div className="space-y-2 text-xs">
                {config?.panel_options?.map((p: any, i: number) => (
                  <div key={i} className="p-3 rounded-2xl bg-gov-50 border border-gov-100 space-y-1">
                    <div className="flex justify-between items-center font-bold text-gov-900">
                      <span>{p.name}</span>
                      <span className="text-solar-700 font-mono">{p.efficiency}</span>
                    </div>
                    <p className="text-[11px] text-gov-500">Tech: {p.tech} • Compliance: {p.tier}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Subsidy Tier Rules */}
            <div className="p-6 rounded-3xl bg-gov-950 text-white shadow-card space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-solar-400">
                PM Surya Ghar CFA Constants
              </h4>

              <div className="space-y-2 text-xs">
                {Object.entries(config?.subsidy_tiers || {}).map(([tier, val]: any, i: number) => (
                  <div key={i} className="flex justify-between items-center py-1 border-b border-gov-800 text-slate-300">
                    <span className="text-[11px]">{tier}:</span>
                    <span className="font-bold text-emerald-400 font-mono">₹{Number(val).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      <Disclaimer variant="banner" customText="Configuration assumptions are stored centrally in the backend SQLite database and can be synchronized with real-time state tariff changes." />

    </div>
  );
};
