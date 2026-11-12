import React from 'react';
import { 
  Leaf, 
  Trees, 
  Flame, 
  Car, 
  Wind, 
  ShieldCheck, 
  Sparkles, 
  Globe2, 
  Sun,
  ArrowRight
} from 'lucide-react';
import { useSolar } from '../context/SolarContext';
import { StatCard } from '../components/StatCard';
import { StepWizardNav } from '../components/StepWizardNav';
import { Disclaimer } from '../components/Disclaimer';

export const EnvironmentalPage: React.FC = () => {
  const { result } = useSolar();

  const annualGen = result?.annual_generation_kwh || 4818;
  const annualCo2Kg = result?.co2_avoided_annual_kg || 3950;
  const lifetimeCo2Tonnes = result?.co2_avoided_25yr_kg ? (result.co2_avoided_25yr_kg / 1000).toFixed(1) : "98.8";
  const treesAnnual = result?.trees_equivalent_annual || 178;
  const coalSavedKg = result?.coal_saved_annual_kg || 2168;
  const petrolKm = result?.petrol_car_km_offset_annual || 23700;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-gov-200 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-eco-700 uppercase tracking-wider mb-1">
              <Leaf className="w-4 h-4" />
              <span>Step 6 of 8 • Climate Action & Carbon Footprint</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gov-950 font-display">
              Environmental Impact & CO₂ Avoidance
            </h1>
            <p className="text-xs sm:text-sm text-gov-600 mt-1">
              Quantifying your contribution to India's Net-Zero 2070 climate goals and clean air transition.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1.5">
              <Globe2 className="w-4 h-4 text-emerald-600" />
              National Grid Emission: 0.82 kg CO₂/kWh
            </span>
          </div>
        </div>
      </div>

      {/* 4 Hero Eco Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="CO₂ Avoided / Year"
          value={`${(annualCo2Kg / 1000).toFixed(2)} Tonnes`}
          subtitle={`${annualCo2Kg.toLocaleString('en-IN')} kg / year`}
          icon={Wind}
          badge="Clean Air"
          badgeColor="eco"
        />
        <StatCard
          title="25-Yr Carbon Offset"
          value={`${lifetimeCo2Tonnes} Tonnes`}
          subtitle="Lifetime footprint reduction"
          icon={Globe2}
          accent={true}
          badge="Net Zero"
        />
        <StatCard
          title="Trees Equivalent"
          value={`${treesAnnual} Trees`}
          subtitle={`${treesAnnual * 25} trees over 25 yrs`}
          icon={Trees}
          badge="Forest Impact"
          badgeColor="eco"
        />
        <StatCard
          title="Coal Burning Saved"
          value={`${coalSavedKg.toLocaleString('en-IN')} kg`}
          subtitle="Thermal power displaced"
          icon={Flame}
          badge="Fossil Free"
          badgeColor="solar"
        />
      </div>

      {/* Visual Infographic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Tree Planting Visual Equivalent */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-900 to-teal-950 text-white shadow-xl space-y-5 relative overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-800">
            <div className="flex items-center space-x-2">
              <Trees className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold font-display text-white">Equivalent Urban Forest</h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {treesAnnual} Trees / Year
            </span>
          </div>

          <p className="text-xs text-emerald-200 leading-relaxed">
            By displacing coal-heavy grid electricity with your rooftop solar system, you prevent as much greenhouse gas emissions as a mature grove of <strong>{treesAnnual} trees</strong> absorbing CO₂ every year for the next 25 years ({treesAnnual * 25} lifetime tree-years).
          </p>

          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-800 grid grid-cols-3 gap-3 text-center">
            <div>
              <span className="text-xs font-bold text-emerald-400 block font-mono">{annualGen.toLocaleString('en-IN')} kWh</span>
              <span className="text-[10px] text-emerald-300">Clean Units / Yr</span>
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-400 block font-mono">{(annualGen * 25 / 1000).toFixed(0)} MWh</span>
              <span className="text-[10px] text-emerald-300">25-Yr Clean Power</span>
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-400 block font-mono">100%</span>
              <span className="text-[10px] text-emerald-300">Renewable</span>
            </div>
          </div>
        </div>

        {/* Card 2: Fossil Fuel & Vehicle Emissions Offset */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gov-200 shadow-card space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-gov-100">
            <div className="flex items-center space-x-2">
              <Car className="w-5 h-5 text-solar-600" />
              <h3 className="text-base font-bold font-display text-gov-950">Transport & Fossil Fuel Offsets</h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-solar-100 text-solar-800">
              Vehicle Offset
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-gov-50 border border-gov-100 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Car className="w-5 h-5 text-gov-700" />
                <div>
                  <p className="font-bold text-gov-900">Passenger Vehicle Kms Offset</p>
                  <p className="text-[10px] text-gov-500">Equivalent to avoiding</p>
                </div>
              </div>
              <span className="text-sm font-black text-gov-950 font-mono">
                {petrolKm.toLocaleString('en-IN')} km / yr
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-gov-50 border border-gov-100 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Flame className="w-5 h-5 text-amber-600" />
                <div>
                  <p className="font-bold text-gov-900">Thermal Coal Burning Displaced</p>
                  <p className="text-[10px] text-gov-500">0.45 kg coal avoided per kWh</p>
                </div>
              </div>
              <span className="text-sm font-black text-amber-700 font-mono">
                {coalSavedKg.toLocaleString('en-IN')} kg / yr
              </span>
            </div>
          </div>

          <p className="text-[11px] text-gov-500 italic">
            Calculated based on Central Electricity Authority (CEA) India CO₂ Baseline Database Version 19.
          </p>
        </div>

      </div>

      <Disclaimer variant="banner" customText="Environmental calculations use the Central Electricity Authority (CEA) India baseline grid emission factor of 0.82 kg CO₂/kWh. Actual avoided emissions vary by regional thermal power plant mix." />

      <StepWizardNav
        currentStep={6}
        totalSteps={8}
        backPath="/savings"
        nextPath="/installation-guide"
        nextLabel="Explore 10-Step Installation Process"
      />

    </div>
  );
};
