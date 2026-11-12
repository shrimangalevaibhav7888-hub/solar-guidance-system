import React from 'react';
import { Link } from 'react-router-dom';
import { Sun, ShieldCheck, ExternalLink, Phone, Mail, HelpCircle, FileText } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gov-950 text-slate-300 pt-14 pb-10 border-t border-gov-800 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-gov-800/80">
          
          {/* Brand & Purpose */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-solar-400 to-solar-600 flex items-center justify-center text-white shadow-md shadow-solar-500/20">
                <Sun className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-black text-white font-display">Solar<span className="text-solar-400">Sahayak</span></span>
                <p className="text-[11px] text-slate-400 font-medium">Solar Installation & Scheme Guidance System</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Empowering Indian citizens, residential welfare associations, and institutions with unbiased rooftop solar sizing, exact subsidy calculations under PM Surya Ghar, installer matching, and complete installation roadmaps.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800 text-[11px] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" /> MNRE Guidelines 2026 Aligned
              </span>
            </div>
          </div>

          {/* Sizing & Financial Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100 mb-4">Calculation Tools</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link to="/calculator" className="hover:text-solar-400 transition-colors">Solar Requirement Calculator</Link></li>
              <li><Link to="/cost-estimator" className="hover:text-solar-400 transition-colors">Cost & BOM Estimator</Link></li>
              <li><Link to="/savings" className="hover:text-solar-400 transition-colors">10-Year Savings & ROI</Link></li>
              <li><Link to="/environment" className="hover:text-solar-400 transition-colors">CO₂ & Environmental Impact</Link></li>
              <li><Link to="/report" className="hover:text-solar-400 transition-colors">Download Assessment Report</Link></li>
            </ul>
          </div>

          {/* Schemes & Compliance */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100 mb-4">Government Schemes</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link to="/schemes" className="hover:text-solar-400 transition-colors">PM Surya Ghar: Muft Bijli</Link></li>
              <li><Link to="/schemes" className="hover:text-solar-400 transition-colors">State DISCOM Rooftop Policies</Link></li>
              <li><Link to="/schemes" className="hover:text-solar-400 transition-colors">PM-KUSUM Farmer Solar</Link></li>
              <li><Link to="/installers" className="hover:text-solar-400 transition-colors">Empanelled Installers</Link></li>
              <li><Link to="/installation-guide" className="hover:text-solar-400 transition-colors">10-Step Installation Guide</Link></li>
            </ul>
          </div>

          {/* Official Portals & Helpline */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-100 mb-4">Official Portals</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <a href="https://pmsuryaghar.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-solar-400 flex items-center gap-1">
                  PM Surya Ghar Portal <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://mnre.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-solar-400 flex items-center gap-1">
                  MNRE Govt of India <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://solarrooftop.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-solar-400 flex items-center gap-1">
                  National Solar Portal <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li className="pt-2 text-[11px] text-slate-300">
                <div className="flex items-center gap-1 text-solar-400 font-semibold">
                  <Phone className="w-3.5 h-3.5" /> National Helpline: 15555
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Legal Disclaimer Box */}
        <div className="mt-8 p-4 rounded-xl bg-gov-900/90 border border-gov-800 text-[11px] text-slate-400 leading-relaxed">
          <p className="font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-solar-400" /> Planning & Regulatory Disclaimer
          </p>
          This application provides automated sizing, cost, subsidy, and savings estimates based on engineering assumptions and prevailing government guidelines. Actual solar electricity generation, DISCOM approval timelines, turnkey vendor pricing, and direct financial assistance (CFA) depend on site conditions, shading, roof structure, utility transformer capacity, and verified compliance with Domestic Content Requirement (DCR) rules on the official National Portal.
        </div>

        {/* Copyright */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© 2026 SolarSahayak Guidance System. Designed for Indian Renewable Energy Adoption.</p>
          <div className="flex items-center space-x-4 text-[11px]">
            <Link to="/learn-solar" className="hover:text-slate-300">Understand Solar in 60s</Link>
            <span>•</span>
            <Link to="/settings" className="hover:text-slate-300">Centralized Config</Link>
            <span>•</span>
            <span>Made with Clean Tech Pride in India</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
