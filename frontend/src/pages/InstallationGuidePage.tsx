import React, { useState } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  FileText, 
  AlertTriangle, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  Wrench,
  Building2,
  Zap,
  ArrowRight
} from 'lucide-react';
import { StepWizardNav } from '../components/StepWizardNav';
import { Disclaimer } from '../components/Disclaimer';

interface GuideStep {
  step: number;
  title: string;
  stage: string;
  duration: string;
  summary: string;
  whatHappens: string;
  whatUserNeeds: string[];
  documentsRequired: string[];
  cautions: string;
  portalLink?: string;
}

const GUIDE_STEPS: GuideStep[] = [
  {
    step: 1,
    title: 'Requirement & Feasibility Assessment',
    stage: 'Planning',
    duration: 'Day 1',
    summary: 'Evaluate electricity consumption, shadow-free roof area, and required kW capacity.',
    whatHappens: 'Analyze your latest 6-12 months electricity bills to determine average monthly kWh consumption and compare it against your shadow-free roof area using SolarSahayak.',
    whatUserNeeds: ['Recent electricity bills', 'Approximate roof measurements', 'Sanctioned load details'],
    documentsRequired: ['Latest Electricity Bill (with CA / Consumer Number)'],
    cautions: 'Do not oversize your system beyond 100% of your sanctioned load without applying for a load enhancement with your DISCOM first.'
  },
  {
    step: 2,
    title: 'Scheme & Subsidy Eligibility Verification',
    stage: 'Planning',
    duration: 'Day 2',
    summary: 'Check your eligibility under PM Surya Ghar Muft Bijli Yojana or state-specific rooftop solar schemes.',
    whatHappens: 'Confirm that your electricity connection is classified as Domestic/Residential and that your property has clear roof usage rights.',
    whatUserNeeds: ['Aadhaar matching electricity bill name', 'Bank account for Direct Benefit Transfer (DBT)'],
    documentsRequired: ['Aadhaar Card', 'Bank Passbook / Cancelled Cheque'],
    cautions: 'Ensure the name on the electricity bill, bank account, and Aadhaar card are identical or supported by legal relation documents to avoid DBT rejection.'
  },
  {
    step: 3,
    title: 'National Solar Portal Registration',
    stage: 'Application',
    duration: 'Day 3 - 5',
    summary: 'Register on pmsuryaghar.gov.in and submit your online rooftop application.',
    whatHappens: 'Create your applicant profile on the National Portal by selecting your State, DISCOM, and entering your Electricity Consumer Account Number.',
    whatUserNeeds: ['Mobile number linked to Aadhaar', 'Active internet connection'],
    documentsRequired: ['Scanned Electricity Bill (PDF/JPG < 500KB)', 'Scanned Bank Cancelled Cheque'],
    cautions: 'Only submit applications through the official portal (pmsuryaghar.gov.in). Beware of fraudulent third-party duplicate websites.',
    portalLink: 'https://pmsuryaghar.gov.in'
  },
  {
    step: 4,
    title: 'DISCOM Technical Feasibility Approval',
    stage: 'Approval',
    duration: 'Day 6 - 12',
    summary: 'State electricity distribution utility verifies local distribution transformer (DT) capacity.',
    whatHappens: 'DISCOM engineers review your proposed solar capacity against local DT threshold limits (typically capped at 75-80% DT rating) and issue an online Technical Feasibility Sanction.',
    whatUserNeeds: ['Online tracking via portal application number'],
    documentsRequired: ['DISCOM Sanction Letter (auto-generated in portal)'],
    cautions: 'Do not purchase or install equipment before receiving the formal Technical Feasibility Approval from your DISCOM.'
  },
  {
    step: 5,
    title: 'Select Authorised / Empanelled Installer',
    stage: 'Vendor Selection',
    duration: 'Day 13 - 16',
    summary: 'Choose a DISCOM-empanelled vendor from the National Portal directory and execute the agreement.',
    whatHappens: 'Review quotations from multiple empanelled vendors. Sign the standard tripartite or bipartite agreement detailing equipment brands, warranties, and scope of work.',
    whatUserNeeds: ['Written quotation with ALMM Tier-1 module & inverter serial make'],
    documentsRequired: ['Vendor Standard Agreement', 'Quotation with BOM breakdown'],
    cautions: 'Insist on DCR (Domestic Content Requirement) solar modules listed in the ALMM (Approved List of Models and Manufacturers) to ensure subsidy eligibility.'
  },
  {
    step: 6,
    title: 'Detailed Site Survey & System Design',
    stage: 'Engineering',
    duration: 'Day 17 - 20',
    summary: 'Installer visits your site to verify solar azimuth, structural safety, and earthing pit locations.',
    whatHappens: 'Technicians inspect roof structural load-bearing capacity, true South orientation, tilt angle (typically 12°-20° in India), and cable routing.',
    whatUserNeeds: ['Physical roof access for survey team'],
    documentsRequired: ['Single Line Diagram (SLD)', 'Plant Layout Drawing'],
    cautions: 'Ensure the mounting structure is Hot-Dip Galvanized (HDG) with minimum 80-micron coating to prevent rusting in monsoon conditions.'
  },
  {
    step: 7,
    title: 'Hardware Delivery & Rooftop Installation',
    stage: 'Installation',
    duration: 'Day 21 - 28',
    summary: 'Civil structure anchoring, module mounting, string inverter installation, and protection wiring.',
    whatHappens: 'Mounting structures are anchored to RCC pillars or roof slab. 550W modules are secured with mid/end clamps. DC/AC Distribution Boxes, SPD surge protectors, and earthing electrodes (<5 ohms) are installed.',
    whatUserNeeds: ['Power connection for tools during installation'],
    documentsRequired: ['Module Flash Test Reports', 'Inverter Test Certificate', 'Warranty Certificates (25-Yr module, 5-Yr inverter)'],
    cautions: 'Check that every panel has a readable RFID tag embedded inside the glass laminate as mandated by MNRE.'
  },
  {
    step: 8,
    title: 'Vendor Work Completion Submission',
    stage: 'Documentation',
    duration: 'Day 29 - 31',
    summary: 'Empanelled installer uploads project completion documents and geo-tagged photos to the National Portal.',
    whatHappens: 'Vendor submits the Work Completion Report, module serial number sheet, inverter test report, and geo-tagged site photographs on the portal.',
    whatUserNeeds: ['Verification of system serial numbers with invoice'],
    documentsRequired: ['Work Completion Report (WCR)', 'Geo-tagged Plant Photographs', 'Joint Inspection Request Form'],
    cautions: 'Verify that the total installed capacity on the completion report matches your sanctioned approval exactly.'
  },
  {
    step: 9,
    title: 'DISCOM Inspection & Smart Net Meter Installation',
    stage: 'Inspection & Metering',
    duration: 'Day 32 - 42',
    summary: 'DISCOM field engineer inspects safety compliance and replaces old meter with a bi-directional smart meter.',
    whatHappens: 'DISCOM junior engineer visits site, tests anti-islanding protection (inverter must shut down immediately when grid power fails), checks earthing resistance, and installs the bi-directional net meter.',
    whatUserNeeds: ['Consumer presence during meter testing'],
    documentsRequired: ['Net Meter Testing Certificate', 'Safety Inspection Approval Form'],
    cautions: 'Do not turn on solar inverter synchronization before the bi-directional meter is officially programmed and sealed by the DISCOM.'
  },
  {
    step: 10,
    title: 'System Activation & Direct Subsidy Disbursal (DBT)',
    stage: 'Commissioning & Subsidy',
    duration: 'Within 30 Days of Commissioning',
    summary: 'Commissioning certificate generated online and direct subsidy credited into your bank account.',
    whatHappens: 'DISCOM uploads net meter commissioning data. National Portal generates the formal Commissioning Certificate. MNRE initiates the Direct Benefit Transfer (DBT) directly into your linked bank account.',
    whatUserNeeds: ['Bank SMS / Portal tracking for DBT credit'],
    documentsRequired: ['Official National Portal Commissioning Certificate'],
    cautions: 'Keep a digital copy of your Commissioning Certificate and 5-year Comprehensive Maintenance Contract (CMC) signed by your installer.',
    portalLink: 'https://pmsuryaghar.gov.in'
  }
];

export const InstallationGuidePage: React.FC = () => {
  const [expandedStep, setExpandedStep] = useState<number | null>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([1]);

  const toggleStep = (stepNum: number) => {
    setExpandedStep(expandedStep === stepNum ? null : stepNum);
  };

  const toggleComplete = (stepNum: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompletedSteps(prev => 
      prev.includes(stepNum) ? prev.filter(s => s !== stepNum) : [...prev, stepNum]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-gov-200 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-solar-600 uppercase tracking-wider mb-1">
              <BookOpen className="w-4 h-4" />
              <span>Step 7 of 8 • End-to-End Installation Roadmap</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gov-950 font-display">
              10-Step Solar Installation & Approval Roadmap
            </h1>
            <p className="text-xs sm:text-sm text-gov-600 mt-1">
              Interactive timeline from initial assessment to DISCOM net-metering synchronization and direct subsidy disbursal.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              Completed: {completedSteps.length} / 10 Steps
            </span>
          </div>
        </div>
      </div>

      {/* Main Timeline Accordion List */}
      <div className="space-y-4">
        {GUIDE_STEPS.map((item) => {
          const isExpanded = expandedStep === item.step;
          const isDone = completedSteps.includes(item.step);

          return (
            <div
              key={item.step}
              className={`rounded-3xl border transition-all duration-200 overflow-hidden ${
                isDone 
                  ? 'bg-white border-emerald-200 shadow-sm' 
                  : 'bg-white border-gov-200 shadow-card hover:border-solar-300'
              }`}
            >
              {/* Accordion Header */}
              <div
                onClick={() => toggleStep(item.step)}
                className="p-5 sm:p-6 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center space-x-4">
                  {/* Step Number or Check */}
                  <button
                    onClick={(e) => toggleComplete(item.step, e)}
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs transition-all ${
                      isDone 
                        ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30' 
                        : 'bg-solar-50 text-solar-700 border border-solar-200 hover:bg-solar-100'
                    }`}
                    title={isDone ? "Mark as in progress" : "Mark step as completed"}
                  >
                    {isDone ? <CheckCircle2 className="w-5 h-5" /> : `0${item.step}`}
                  </button>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gov-100 text-gov-700">
                        {item.stage}
                      </span>
                      <span className="text-xs text-gov-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {item.duration}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-gov-950 font-display mt-0.5">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gov-500 line-clamp-1">{item.summary}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gov-50 flex items-center justify-center text-gov-500">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Accordion Expanded Content */}
              {isExpanded && (
                <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-gov-100 space-y-4 text-xs animate-in slide-in-from-top-1">
                  
                  <div>
                    <h4 className="font-bold text-gov-900 mb-1">What Happens in this Step:</h4>
                    <p className="text-gov-600 leading-relaxed">{item.whatHappens}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* What User Needs */}
                    <div className="p-3.5 rounded-2xl bg-gov-50 border border-gov-100 space-y-2">
                      <span className="font-bold text-gov-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-solar-600" /> What You Need to Prepare:
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-gov-600 text-[11px]">
                        {item.whatUserNeeds.map((need, i) => (
                          <li key={i}>{need}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Documents Required */}
                    <div className="p-3.5 rounded-2xl bg-gov-50 border border-gov-100 space-y-2">
                      <span className="font-bold text-gov-800 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-blue-600" /> Documents Required:
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-gov-600 text-[11px]">
                        {item.documentsRequired.map((doc, i) => (
                          <li key={i}>{doc}</li>
                        ))}
                      </ul>
                    </div>

                  </div>

                  {/* Cautions Box */}
                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Important Caution: </span>
                      <span>{item.cautions}</span>
                    </div>
                  </div>

                  {item.portalLink && (
                    <div className="flex justify-end pt-2">
                      <a
                        href={item.portalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gov-900 text-white font-bold text-xs hover:bg-gov-800 transition-colors"
                      >
                        <span>Open National Solar Portal</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}

                </div>
              )}
            </div>
          );
        })}
      </div>

      <Disclaimer variant="banner" customText="Timeline estimates reflect standard DISCOM regulatory cycles. Timelines may vary depending on local transformer inspection backlogs and meter availability." />

      <StepWizardNav
        currentStep={7}
        totalSteps={8}
        backPath="/environment"
        nextPath="/report"
        nextLabel="Generate Personalized Solar Report"
      />

    </div>
  );
};
