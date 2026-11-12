import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SolarProvider } from './context/SolarContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { SolarCalculatorPage } from './pages/SolarCalculatorPage';
import { SolarResultsPage } from './pages/SolarResultsPage';
import { SchemeExplorerPage } from './pages/SchemeExplorerPage';
import { CostEstimatorPage } from './pages/CostEstimatorPage';
import { SavingsPage } from './pages/SavingsPage';
import { EnvironmentalPage } from './pages/EnvironmentalPage';
import { InstallationGuidePage } from './pages/InstallationGuidePage';
import { InstallersPage } from './pages/InstallersPage';
import { ReportPage } from './pages/ReportPage';
import { LearnSolarPage } from './pages/LearnSolarPage';
import { SettingsPage } from './pages/SettingsPage';

// Scroll to top helper
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SolarProvider>
          <div className="flex flex-col min-h-screen bg-[#f8fafc] text-gov-900">
            <ScrollToTop />
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Landing & Authentication */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/profile" element={<ProfilePage />} />

                {/* Sizing & Recommendation Engine */}
                <Route path="/calculator" element={<SolarCalculatorPage />} />
                <Route path="/solar-calculator" element={<SolarCalculatorPage />} />
                <Route path="/solar-results" element={<SolarResultsPage />} />

                {/* Schemes & Subsidies */}
                <Route path="/schemes" element={<SchemeExplorerPage />} />
                <Route path="/schemes/:id" element={<SchemeExplorerPage />} />
                <Route path="/eligibility" element={<SchemeExplorerPage />} />
                <Route path="/subsidy" element={<CostEstimatorPage />} />
                <Route path="/cost-estimator" element={<CostEstimatorPage />} />

                {/* Financials, Environment & Directory */}
                <Route path="/savings" element={<SavingsPage />} />
                <Route path="/environment" element={<EnvironmentalPage />} />
                <Route path="/installation-guide" element={<InstallationGuidePage />} />
                <Route path="/installers" element={<InstallersPage />} />

                {/* Report & Knowledge Base */}
                <Route path="/report" element={<ReportPage />} />
                <Route path="/learn-solar" element={<LearnSolarPage />} />
                <Route path="/settings" element={<SettingsPage />} />

                {/* Fallback */}
                <Route path="*" element={<LandingPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </SolarProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
