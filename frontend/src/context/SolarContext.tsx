import React, { createContext, useContext, useState, useEffect } from 'react';
import { SolarInputState, SolarCalculationResult, SolarReportData } from '../types';
import { api } from '../services/api';
import { INDIAN_STATES } from '../data/indianStates';
import { useAuth } from './AuthContext';

interface SolarContextType {
  inputState: SolarInputState;
  result: SolarCalculationResult | null;
  report: SolarReportData | null;
  isCalculating: boolean;
  error: string | null;
  updateInput: (fields: Partial<SolarInputState>) => void;
  calculate: (customInputs?: Partial<SolarInputState>) => Promise<SolarCalculationResult>;
  loadDemoScenario: () => Promise<SolarCalculationResult>;
  generateReport: () => Promise<SolarReportData>;
  resetCalculation: () => void;
}

const defaultInputs: SolarInputState = {
  inputType: 'units',
  monthlyUnits: 300,
  monthlyBill: 2460,
  tariff: 8.20,
  roofArea: 500,
  roofType: 'RCC',
  shading: 'Low',
  state: 'Maharashtra',
  district: 'Pune',
  city: 'Pune',
  discom: 'MSEDCL (Mahavitaran)',
  propertyType: 'Home',
  consumerCategory: 'Domestic/Residential',
  hasGridConnection: true,
  hasRoofRights: true
};

const SolarContext = createContext<SolarContextType | undefined>(undefined);

export const SolarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  const [inputState, setInputState] = useState<SolarInputState>(() => {
    const saved = localStorage.getItem('solarsahayak_inputs');
    if (saved) {
      try {
        return { ...defaultInputs, ...JSON.parse(saved) };
      } catch (e) {
        return defaultInputs;
      }
    }
    return defaultInputs;
  });

  const [result, setResult] = useState<SolarCalculationResult | null>(() => {
    const saved = localStorage.getItem('solarsahayak_result');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [report, setReport] = useState<SolarReportData | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Sync user location & property info if logged in
  useEffect(() => {
    if (user) {
      setInputState(prev => ({
        ...prev,
        state: user.state || prev.state,
        district: user.district || prev.district,
        city: user.city || prev.city,
        propertyType: (user.property_type as any) || prev.propertyType,
      }));
    }
  }, [user]);

  // Save inputs to localStorage
  useEffect(() => {
    localStorage.setItem('solarsahayak_inputs', JSON.stringify(inputState));
  }, [inputState]);

  // Save result to localStorage
  useEffect(() => {
    if (result) {
      localStorage.setItem('solarsahayak_result', JSON.stringify(result));
    }
  }, [result]);

  const updateInput = (fields: Partial<SolarInputState>) => {
    setInputState(prev => {
      const updated = { ...prev, ...fields };
      // If state changes, update default tariff and discoms
      if (fields.state && INDIAN_STATES[fields.state]) {
        const sData = INDIAN_STATES[fields.state];
        updated.tariff = sData.tariff;
        if (!fields.discom && sData.discoms.length > 0) {
          updated.discom = sData.discoms[0];
        }
        if (!fields.district && sData.districts.length > 0) {
          updated.district = sData.districts[0];
          updated.city = sData.districts[0];
        }
      }
      return updated;
    });
  };

  const calculate = async (customInputs?: Partial<SolarInputState>): Promise<SolarCalculationResult> => {
    setIsCalculating(true);
    setError(null);
    const activeInputs = { ...inputState, ...(customInputs || {}) };

    try {
      const payload = {
        user_id: user?.id,
        input_type: activeInputs.inputType,
        monthly_units: activeInputs.monthlyUnits,
        monthly_bill: activeInputs.monthlyBill,
        tariff: activeInputs.tariff,
        roof_area: activeInputs.roofArea,
        roof_type: activeInputs.roofType,
        shading: activeInputs.shading,
        state: activeInputs.state,
        district: activeInputs.district,
        property_type: activeInputs.propertyType
      };

      const res = await api.calculateSolar(payload);
      setResult(res);
      return res;
    } catch (err: any) {
      const msg = err.message || "We couldn't calculate your result right now. Please check your inputs and try again.";
      setError(msg);
      throw err;
    } finally {
      setIsCalculating(false);
    }
  };

  const loadDemoScenario = async (): Promise<SolarCalculationResult> => {
    const demoData: SolarInputState = {
      inputType: 'units',
      monthlyUnits: 300,
      monthlyBill: 2460,
      tariff: 8.20,
      roofArea: 500,
      roofType: 'RCC',
      shading: 'Low',
      state: 'Maharashtra',
      district: 'Pune',
      city: 'Pune',
      discom: 'MSEDCL (Mahavitaran)',
      propertyType: 'Home',
      consumerCategory: 'Domestic/Residential',
      hasGridConnection: true,
      hasRoofRights: true
    };

    setInputState(demoData);
    return calculate(demoData);
  };

  const generateReport = async (): Promise<SolarReportData> => {
    setIsCalculating(true);
    try {
      const payload = {
        user_id: user?.id,
        user_name: user?.name || "Solar Planner",
        email: user?.email || "citizen@solarsahayak.in",
        mobile: user?.mobile || "9876543210",
        state: inputState.state,
        district: inputState.district,
        property_type: inputState.propertyType,
        monthly_units: inputState.monthlyUnits,
        monthly_bill: inputState.monthlyBill,
        roof_area: inputState.roofArea,
        roof_type: inputState.roofType,
        shading: inputState.shading,
        recommended_capacity_kw: result?.recommended_capacity_kw || 3.3,
        panel_count: result?.panel_count || 6,
        annual_generation_kwh: result?.annual_generation_kwh || 4818.0,
        gross_cost: result?.gross_cost || 181500.0,
        subsidy_amount: result?.potential_subsidy || 78000.0,
        net_cost: result?.net_cost || 103500.0,
        annual_savings: result?.annual_savings || 39507.0,
        payback_years: result?.payback_period_years || 2.6,
        co2_avoided_kg: result?.co2_avoided_annual_kg || 3950.0
      };

      const rep = await api.generateReport(payload);
      setReport(rep);
      return rep;
    } finally {
      setIsCalculating(false);
    }
  };

  const resetCalculation = () => {
    setInputState(defaultInputs);
    setResult(null);
    setReport(null);
    localStorage.removeItem('solarsahayak_inputs');
    localStorage.removeItem('solarsahayak_result');
  };

  return (
    <SolarContext.Provider
      value={{
        inputState,
        result,
        report,
        isCalculating,
        error,
        updateInput,
        calculate,
        loadDemoScenario,
        generateReport,
        resetCalculation
      }}
    >
      {children}
    </SolarContext.Provider>
  );
};

export const useSolar = () => {
  const context = useContext(SolarContext);
  if (!context) throw new Error('useSolar must be used within a SolarProvider');
  return context;
};
