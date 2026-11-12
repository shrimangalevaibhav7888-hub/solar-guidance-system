import { 
  User, 
  AuthResponse, 
  SolarCalculationResult, 
  Scheme, 
  EligibilityResult, 
  InstallerListResponse, 
  SolarReportData,
  Installer 
} from '../types';

const envApiUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;
const API_BASE = envApiUrl ? `${envApiUrl.replace(/\/+$/, '')}/api` : '/api';

export const api = {
  // Authentication
  async register(data: any): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Registration failed' }));
      throw new Error(err.detail || 'Registration failed');
    }
    return res.json();
  },

  async login(data: { email: string; password?: string }): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: data.email, password: data.password || 'solarsahayak123' }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Invalid credentials' }));
      throw new Error(err.detail || 'Invalid email or password');
    }
    return res.json();
  },

  async demoLogin(): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) {
      throw new Error('Demo login failed');
    }
    return res.json();
  },

  async getProfile(userId: number): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/profile/${userId}`);
    if (!res.ok) throw new Error('Could not fetch user profile');
    return res.json();
  },

  // Solar Calculation
  async calculateSolar(data: any): Promise<SolarCalculationResult> {
    const res = await fetch(`${API_BASE}/solar/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Calculation error' }));
      throw new Error(err.detail || 'Failed to calculate solar requirement');
    }
    return res.json();
  },

  async quickCalculate(monthlyBill?: number, monthlyUnits?: number, state: string = 'Maharashtra') {
    const res = await fetch(`${API_BASE}/solar/quick-calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ monthly_bill: monthlyBill, monthly_units: monthlyUnits, state }),
    });
    if (!res.ok) throw new Error('Quick calculation failed');
    return res.json();
  },

  async getLatestAssessment(userId: number) {
    const res = await fetch(`${API_BASE}/solar/latest/${userId}`);
    if (!res.ok) return { has_assessment: false };
    return res.json();
  },

  // Schemes & Eligibility
  async getSchemes(params?: { state?: string; property_type?: string; category?: string }): Promise<Scheme[]> {
    const query = new URLSearchParams();
    if (params?.state && params.state !== 'All') query.append('state', params.state);
    if (params?.property_type && params.property_type !== 'All') query.append('property_type', params.property_type);
    if (params?.category && params.category !== 'All') query.append('category', params.category);

    const res = await fetch(`${API_BASE}/schemes?${query.toString()}`);
    if (!res.ok) throw new Error('Could not fetch government schemes');
    return res.json();
  },

  async getSchemeById(id: number): Promise<Scheme> {
    const res = await fetch(`${API_BASE}/schemes/${id}`);
    if (!res.ok) throw new Error('Scheme not found');
    return res.json();
  },

  async checkEligibility(data: {
    state: string;
    property_type: string;
    recommended_capacity_kw: number;
    has_active_grid_connection?: boolean;
    has_roof_rights?: boolean;
  }): Promise<EligibilityResult> {
    const res = await fetch(`${API_BASE}/schemes/check-eligibility`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Could not check scheme eligibility');
    return res.json();
  },

  // Installers
  async getInstallers(params?: { state?: string; city?: string; search?: string }): Promise<InstallerListResponse> {
    const query = new URLSearchParams();
    if (params?.state && params.state !== 'All') query.append('state', params.state);
    if (params?.city && params.city !== 'All') query.append('city', params.city);
    if (params?.search) query.append('search', params.search);

    const res = await fetch(`${API_BASE}/installers?${query.toString()}`);
    if (!res.ok) throw new Error('Could not fetch installers directory');
    return res.json();
  },

  async getInstallerById(id: number): Promise<Installer> {
    const res = await fetch(`${API_BASE}/installers/${id}`);
    if (!res.ok) throw new Error('Installer not found');
    return res.json();
  },

  // Reports
  async generateReport(payload: any): Promise<SolarReportData> {
    const res = await fetch(`${API_BASE}/reports/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to generate personalized report');
    return res.json();
  },

  async getReport(codeOrId: string): Promise<SolarReportData> {
    const res = await fetch(`${API_BASE}/reports/${codeOrId}`);
    if (!res.ok) throw new Error('Report not found');
    return res.json();
  },

  async getUserReports(userId: number) {
    const res = await fetch(`${API_BASE}/reports/user/${userId}`);
    if (!res.ok) return [];
    return res.json();
  },

  // Configuration / Assumptions
  async getAssumptions() {
    const res = await fetch(`${API_BASE}/config/assumptions`);
    if (!res.ok) throw new Error('Could not fetch assumptions');
    return res.json();
  },

  async updateAssumption(key: string, value: number) {
    const res = await fetch(`${API_BASE}/config/assumptions/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value }),
    });
    if (!res.ok) throw new Error('Could not update assumption');
    return res.json();
  }
};
