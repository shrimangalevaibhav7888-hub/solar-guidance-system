from sqlalchemy.orm import Session
from app.database.models import Scheme, Installer, SystemAssumption, User
import bcrypt

def get_password_hash(password: str) -> str:
    pwd_bytes = password.encode('utf-8')[:72]
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pwd_bytes, salt).decode('utf-8')

def seed_database(db: Session):
    # 1. Seed Schemes if empty
    if db.query(Scheme).count() == 0:
        schemes_data = [
            {
                "scheme_name": "PM Surya Ghar: Muft Bijli Yojana",
                "ministry": "Ministry of New and Renewable Energy (MNRE), Govt of India",
                "state": "All India",
                "applicable_property_type": "Home, Housing Society",
                "description": "National flagship initiative aimed at providing free electricity to 1 Crore Indian households through rooftop solar installations with direct financial assistance.",
                "eligibility": "1. Must be an Indian citizen and resident.\n2. Must have an active domestic/residential electricity connection in the applicant's name.\n3. Must possess suitable shadow-free roof ownership or legal usage rights.\n4. System must use ALMM-compliant DCR solar modules.",
                "subsidy_type": "Direct Central Financial Assistance (CFA) via DBT",
                "subsidy_amount": "Up to ₹78,000 (₹30,000 for 1 kW, ₹60,000 for 2 kW, ₹78,000 for 3 kW and above)",
                "subsidy_percentage": "Up to ~40-60% of estimated benchmark installation cost",
                "application_process": "1. Register on the National Portal (pmsuryaghar.gov.in) with mobile & DISCOM consumer number.\n2. Apply for technical feasibility approval.\n3. Procure installation from an empanelled vendor.\n4. DISCOM site inspection and net meter installation.\n5. Commissioning certificate issued & subsidy credited directly to bank account via DBT.",
                "required_documents": "1. Electricity Bill (latest 3 months)\n2. Aadhaar Card of electricity connection holder\n3. Bank Passbook / Cancelled Cheque (matching applicant name)\n4. Passport size photograph\n5. Roof ownership proof / Property tax receipt",
                "official_url": "https://pmsuryaghar.gov.in",
                "active_status": True,
                "category": "Central",
                "last_verified_date": "2026-03-01",
                "min_capacity_kw": 1.0,
                "max_capacity_kw": 10.0
            },
            {
                "scheme_name": "Surya Gujarat Rooftop Solar Scheme",
                "ministry": "Energy & Petrochemicals Department, Govt of Gujarat (GUVNL)",
                "state": "Gujarat",
                "applicable_property_type": "Home, Housing Society",
                "description": "Gujarat state rooftop solar programme integrated with PM Surya Ghar, featuring fast-track 15-day net-metering clearance and integrated DISCOM portal support across DGVCL, MGVCL, PGVCL, and UGVCL.",
                "eligibility": "1. Residential electricity consumer of GUVNL or Torrent Power.\n2. Roof ownership with valid property tax documentation.\n3. Grid-tied system with approved bi-directional smart meter.",
                "subsidy_type": "Central CFA + State Fast-Track Clearance",
                "subsidy_amount": "Up to ₹78,000 via PM Surya Ghar + Zero DISCOM Inspection Fees",
                "subsidy_percentage": "Up to 50%",
                "application_process": "1. Apply via Surya Gujarat single-window portal (suryagujarat.guvnl.com).\n2. Select empanelled agency from state list.\n3. Automatic DISCOM load feasibility sync.\n4. Meter installation within 10 days of completion.",
                "required_documents": "1. GUVNL Electricity Bill\n2. Aadhaar Card\n3. Proof of Roof Ownership\n4. Bank account details (IFSC & Cheque)",
                "official_url": "https://suryagujarat.guvnl.com",
                "active_status": True,
                "category": "State",
                "last_verified_date": "2026-03-10",
                "min_capacity_kw": 1.0,
                "max_capacity_kw": 10.0
            },
            {
                "scheme_name": "Delhi Solar Energy Policy 2024",
                "ministry": "Power Department, Govt of NCT of Delhi",
                "state": "Delhi",
                "applicable_property_type": "Home, Shop, Institution",
                "description": "Progressive state policy providing Generation Based Incentive (GBI) of ₹3.00/kWh for residential and ₹2.00/kWh for commercial/industrial solar installations in addition to central PM Surya Ghar subsidies.",
                "eligibility": "1. Registered electricity consumer under BRPL, BYPL, or TPDDL.\n2. Grid-connected rooftop solar with minimum 1 kWp capacity.\n3. Net-metering agreement with Delhi DISCOM.",
                "subsidy_type": "Generation Based Incentive (GBI) + PM Surya Ghar CFA",
                "subsidy_amount": "₹3.00 per kWh generated for 5 years + ₹78,000 PM Surya Ghar CFA",
                "subsidy_percentage": "Direct monthly cash incentive credited into electricity bill",
                "application_process": "1. Apply on Delhi Unified Solar Portal.\n2. Technical feasibility clearance by BSES / Tata Power DDL within 7 days.\n3. Installation by MNRE empanelled vendor.\n4. Joint inspection & GBI crediting directly in monthly billing cycle.",
                "required_documents": "1. CA Number / Delhi Electricity Bill\n2. Aadhaar Card\n3. Bank Account details for GBI crediting\n4. Structural stability certificate for >10kW",
                "official_url": "https://solar.delhi.gov.in",
                "active_status": True,
                "category": "State",
                "last_verified_date": "2026-03-12",
                "min_capacity_kw": 1.0,
                "max_capacity_kw": 500.0
            },
            {
                "scheme_name": "Maharashtra MSEDCL Rooftop Solar Scheme",
                "ministry": "Maharashtra State Electricity Distribution Co. Ltd. (MSEDCL / Mahavitaran)",
                "state": "Maharashtra",
                "applicable_property_type": "Home, Shop, Institution",
                "description": "Unified rooftop solar initiative in Maharashtra facilitating seamless net metering and PM Surya Ghar financial disbursals across Mahavitaran, Adani Electricity, Tata Power, and BEST service territories.",
                "eligibility": "1. Active Low Tension (LT) or High Tension (HT) consumer of MSEDCL / Adani / Tata Power Mumbai.\n2. Adequate sanctioned load matching proposed solar capacity.\n3. Clear unshaded rooftop space.",
                "subsidy_type": "PM Surya Ghar CFA + Net Metering Banking Benefits",
                "subsidy_amount": "Up to ₹78,000 for Residential (Zero CFA for Commercial, but Net Metering allowed)",
                "subsidy_percentage": "Up to 50%",
                "application_process": "1. Submit application on Mahavitaran Solar Portal (wss.mahadiscom.in).\n2. Pay nominal processing fee and get online technical feasibility.\n3. Complete installation through empanelled agency.\n4. Net meter testing and commissioning by MSEDCL testing division.",
                "required_documents": "1. Latest Mahadiscom Consumer Bill\n2. Aadhaar Card & PAN Card\n3. 7/12 extract or Property Tax receipt\n4. Cancelled Cheque",
                "official_url": "https://www.mahadiscom.in/solar-portal",
                "active_status": True,
                "category": "State",
                "last_verified_date": "2026-03-05",
                "min_capacity_kw": 1.0,
                "max_capacity_kw": 50.0
            },
            {
                "scheme_name": "PM-KUSUM Scheme (Component A & B)",
                "ministry": "Ministry of New and Renewable Energy (MNRE), Govt of India",
                "state": "All India",
                "applicable_property_type": "Institution, Home",
                "description": "Pradhan Mantri Kisan Urja Suraksha evam Utthaan Mahabhiyan for farmers, rural institutions, and agricultural solar pumps providing up to 60% combined subsidy.",
                "eligibility": "1. Individual farmers, farmer producer organizations (FPOs), cooperatives, and panchayats.\n2. Possession of cultivable or barren agricultural land within 5 km of 33/11 kV substation.",
                "subsidy_type": "Capital Subsidy (30% Central + 30% State)",
                "subsidy_amount": "Up to 60% of benchmark solar pump / decentralized plant cost",
                "subsidy_percentage": "60% Subsidy (Farmer pays 10-40% balance or takes loan)",
                "application_process": "1. Apply via State Nodal Agency (e.g. MEDA, GEDA, UPNEDA).\n2. Land verification and water source inspection.\n3. Empanelled pump vendor selection and installation.\n4. Verification and commissioning.",
                "required_documents": "1. Land ownership 7/12 extract or Khasra/Khatauni\n2. Farmer Aadhaar Card\n3. Bank passbook\n4. Certificate of agricultural electricity connection or diesel pump replacement",
                "official_url": "https://pmkusum.mnre.gov.in",
                "active_status": True,
                "category": "Central",
                "last_verified_date": "2026-02-28",
                "min_capacity_kw": 2.0,
                "max_capacity_kw": 100.0
            },
            {
                "scheme_name": "Tamil Nadu TANGEDCO Net Metering & Solar Policy",
                "ministry": "Energy Department, Govt of Tamil Nadu (TEDA / TANGEDCO)",
                "state": "Tamil Nadu",
                "applicable_property_type": "Home, Shop, Institution",
                "description": "State framework facilitating bidirectional net-metering and PM Surya Ghar subsidy delivery for domestic consumers, educational institutions, and commercial establishments in Tamil Nadu.",
                "eligibility": "1. Low Tension consumer with TANGEDCO.\n2. Minimum solar inverter capacity 1 kW.\n3. Clear title deed of installation premises.",
                "subsidy_type": "PM Surya Ghar CFA + TANGEDCO Net Energy Settlement",
                "subsidy_amount": "Up to ₹78,000 for Residential (Energy banking at applicable tariff for others)",
                "subsidy_percentage": "Up to 50%",
                "application_process": "1. Register on TANGEDCO Rooftop Solar Web Portal.\n2. Online feasibility evaluation.\n3. Empanelled vendor execution and safety testing.\n4. Bi-directional meter installation and commissioning.",
                "required_documents": "1. TANGEDCO Service Connection Number Bill\n2. Applicant Aadhaar Card\n3. Property Tax Assessment receipt\n4. Bank account IFSC copy",
                "official_url": "https://www.tangedco.gov.in",
                "active_status": True,
                "category": "State",
                "last_verified_date": "2026-03-08",
                "min_capacity_kw": 1.0,
                "max_capacity_kw": 150.0
            },
            {
                "scheme_name": "Uttar Pradesh UPNEDA Solar Energy Policy",
                "ministry": "UP New and Renewable Energy Development Agency (UPNEDA)",
                "state": "Uttar Pradesh",
                "applicable_property_type": "Home, Shop, Institution",
                "description": "Uttar Pradesh state solar rooftop initiative offering state top-up incentives for residential systems in addition to central PM Surya Ghar subsidies, with integrated DISCOM clearance (UPPCL).",
                "eligibility": "1. Domestic consumer of MVVNL, PVVNL, DVVNL, or PuVVNL.\n2. Adequate sanctioned load.\n3. Installation via UPNEDA empanelled installer.",
                "subsidy_type": "PM Surya Ghar CFA + State Additional Incentive",
                "subsidy_amount": "Up to ₹78,000 Central + Up to ₹15,000 State Top-Up (Total up to ₹93,000 for 3kW)",
                "subsidy_percentage": "Up to 55%",
                "application_process": "1. Register on UPNEDA portal & National Portal.\n2. Feasibility verification by local UPPCL executive engineer.\n3. Installation of DCR ALMM solar system.\n4. Inspection and dual-subsidy disbursal.",
                "required_documents": "1. UPPCL Electricity Bill with Account ID\n2. Aadhaar Card\n3. Bank Passbook\n4. House tax receipt",
                "official_url": "https://upneda.org.in",
                "active_status": True,
                "category": "State",
                "last_verified_date": "2026-03-14",
                "min_capacity_kw": 1.0,
                "max_capacity_kw": 25.0
            },
            {
                "scheme_name": "Karnataka KREDL Rooftop Solar Net Metering Policy",
                "ministry": "Karnataka Renewable Energy Development Ltd (KREDL / BESCOM)",
                "state": "Karnataka",
                "applicable_property_type": "Home, Shop, Institution",
                "description": "Karnataka solar rooftop program enabling residential, institutional, and commercial consumers to connect grid-tied solar systems across BESCOM, MESCOM, HESCOM, GESCOM, and CHESCOM.",
                "eligibility": "1. Active LT/HT consumer of Karnataka electricity supply companies.\n2. Roof ownership or registered lease agreement.\n3. BIS certified inverter and module mounting structure.",
                "subsidy_type": "PM Surya Ghar CFA + Fast Track Net Metering",
                "subsidy_amount": "Up to ₹78,000 via PM Surya Ghar (Commercial entities receive energy banking credit)",
                "subsidy_percentage": "Up to 50%",
                "application_process": "1. Apply online via BESCOM / KREDL single window rooftop portal.\n2. Technical feasibility sanction within 10 working days.\n3. Vendor installation and safety inspection by Chief Electrical Inspectorate (CEIG) for >10kW.\n4. Net meter synchronization.",
                "required_documents": "1. Electricity Bill with Consumer ID\n2. Aadhaar Card\n3. Khata certificate / Property tax receipt\n4. Bank account details",
                "official_url": "https://kredl.karnataka.gov.in",
                "active_status": True,
                "category": "State",
                "last_verified_date": "2026-03-02",
                "min_capacity_kw": 1.0,
                "max_capacity_kw": 100.0
            }
        ]

        for s in schemes_data:
            db.add(Scheme(**s))
        db.commit()

    # 2. Seed Verified Demo Installers across Indian states
    if db.query(Installer).count() == 0:
        installers_data = [
            {
                "name": "Tata Power Solar Systems (Empanelled)",
                "state": "Maharashtra",
                "district": "Pune",
                "city": "Pune",
                "contact": "Suresh Kulkarni (Regional Lead)",
                "phone": "+91 98231 44550",
                "email": "rooftop.pune@tatapowersolar.demo",
                "website": "https://www.tatapowersolar.com",
                "service_area": "Pune, Pimpri-Chinchwad, Satara, Solapur",
                "authorised_status": "MSEDCL & MNRE Tier-1 Empanelled",
                "verification_source": "MSEDCL Vendor Portal & MNRE National Registry",
                "rating": 4.9,
                "completed_projects": 420,
                "is_demo": True,
                "last_verified_date": "2026-03-10"
            },
            {
                "name": "Adani Solar Direct & Partners",
                "state": "Gujarat",
                "district": "Ahmedabad",
                "city": "Ahmedabad",
                "contact": "Ketan Patel (Zonal Manager)",
                "phone": "+91 98795 11223",
                "email": "solar.gujarat@adanienergy.demo",
                "website": "https://www.adanisolar.com",
                "service_area": "Ahmedabad, Gandhinagar, Vadodara, Surat",
                "authorised_status": "GUVNL & MNRE Authorised Vendor",
                "verification_source": "Surya Gujarat Empanelled Portal",
                "rating": 4.8,
                "completed_projects": 380,
                "is_demo": True,
                "last_verified_date": "2026-03-12"
            },
            {
                "name": "SunGreen Renewables Pvt Ltd",
                "state": "Maharashtra",
                "district": "Mumbai Suburban",
                "city": "Mumbai",
                "contact": "Amitabh Deshmukh",
                "phone": "+91 98200 88776",
                "email": "contact@sungreenindia.demo",
                "website": "https://www.sungreen.demo",
                "service_area": "Mumbai, Thane, Navi Mumbai, Raigad",
                "authorised_status": "Mahavitaran / Adani Electricity Empanelled",
                "verification_source": "MSEDCL Rooftop Portal",
                "rating": 4.7,
                "completed_projects": 210,
                "is_demo": True,
                "last_verified_date": "2026-03-05"
            },
            {
                "name": "Indraprastha Solar Solutions",
                "state": "Delhi",
                "district": "New Delhi",
                "city": "Delhi NCR",
                "contact": "Rajiv Sharma (Technical Director)",
                "phone": "+91 98110 33221",
                "email": "delhi.solar@indraprastha.demo",
                "website": "https://www.indraprasthasolar.demo",
                "service_area": "Delhi, Noida, Gurugram, Faridabad, Ghaziabad",
                "authorised_status": "BSES / Tata Power DDL Empanelled",
                "verification_source": "Delhi Unified Solar Portal",
                "rating": 4.9,
                "completed_projects": 340,
                "is_demo": True,
                "last_verified_date": "2026-03-14"
            },
            {
                "name": "Cauvery Clean Energy Technologies",
                "state": "Karnataka",
                "district": "Bengaluru Urban",
                "city": "Bengaluru",
                "contact": "Naveen Hegde",
                "phone": "+91 98450 77889",
                "email": "bangalore@cauverysolar.demo",
                "website": "https://www.cauverysolar.demo",
                "service_area": "Bengaluru, Mysuru, Tumakuru, Kolar",
                "authorised_status": "BESCOM & KREDL Empanelled",
                "verification_source": "BESCOM Rooftop Vendor Registry",
                "rating": 4.8,
                "completed_projects": 290,
                "is_demo": True,
                "last_verified_date": "2026-03-08"
            },
            {
                "name": "Madras Rooftop Solar Systems",
                "state": "Tamil Nadu",
                "district": "Chennai",
                "city": "Chennai",
                "contact": "K. Venkataraman",
                "phone": "+91 98401 55667",
                "email": "sales@madrassolar.demo",
                "website": "https://www.madrassolar.demo",
                "service_area": "Chennai, Kanchipuram, Chengalpattu, Tiruvallur",
                "authorised_status": "TANGEDCO & TEDA Empanelled",
                "verification_source": "TANGEDCO Rooftop Directory",
                "rating": 4.7,
                "completed_projects": 195,
                "is_demo": True,
                "last_verified_date": "2026-03-02"
            },
            {
                "name": "Avadh Green Power Engineering",
                "state": "Uttar Pradesh",
                "district": "Lucknow",
                "city": "Lucknow",
                "contact": "Pradeep Tripathi",
                "phone": "+91 94150 99887",
                "email": "lucknow@avadhpower.demo",
                "website": "https://www.avadhpower.demo",
                "service_area": "Lucknow, Kanpur, Ayodhya, Prayagraj, Varanasi",
                "authorised_status": "UPNEDA & UPPCL Empanelled",
                "verification_source": "UPNEDA Official Portal",
                "rating": 4.6,
                "completed_projects": 180,
                "is_demo": True,
                "last_verified_date": "2026-03-11"
            },
            {
                "name": "Marwar Solar Energy Corp",
                "state": "Rajasthan",
                "district": "Jaipur",
                "city": "Jaipur",
                "contact": "Vikram Singh Rathore",
                "phone": "+91 98290 44332",
                "email": "jaipur@marwarsolar.demo",
                "website": "https://www.marwarsolar.demo",
                "service_area": "Jaipur, Jodhpur, Ajmer, Kota, Udaipur",
                "authorised_status": "JVVNL & RRECL Empanelled",
                "verification_source": "RRECL Solar Registry",
                "rating": 4.9,
                "completed_projects": 310,
                "is_demo": True,
                "last_verified_date": "2026-03-09"
            },
            {
                "name": "Hyderabad SunPower Solutions",
                "state": "Telangana",
                "district": "Hyderabad",
                "city": "Hyderabad",
                "contact": "B. Srinivas Rao",
                "phone": "+91 98490 22110",
                "email": "info@hyderabadsunpower.demo",
                "website": "https://www.hyderabadsunpower.demo",
                "service_area": "Hyderabad, Secunderabad, Rangareddy, Warangal",
                "authorised_status": "TSSPDCL & TSREDCO Empanelled",
                "verification_source": "TSREDCO Rooftop Directory",
                "rating": 4.8,
                "completed_projects": 240,
                "is_demo": True,
                "last_verified_date": "2026-03-04"
            },
            {
                "name": "Godavari Green Energy Infra",
                "state": "Andhra Pradesh",
                "district": "Visakhapatnam",
                "city": "Visakhapatnam",
                "contact": "Ch. Ramakrishna",
                "phone": "+91 98480 33445",
                "email": "vizag@godavarigreen.demo",
                "website": "https://www.godavarigreen.demo",
                "service_area": "Visakhapatnam, Vijayawada, Guntur, Rajahmundry",
                "authorised_status": "APEPDCL / APSPDCL & NREDCAP Empanelled",
                "verification_source": "NREDCAP Vendor List",
                "rating": 4.7,
                "completed_projects": 160,
                "is_demo": True,
                "last_verified_date": "2026-03-07"
            },
            {
                "name": "Malabar Solar Power Tech",
                "state": "Kerala",
                "district": "Ernakulam",
                "city": "Kochi",
                "contact": "Mathew Philip",
                "phone": "+91 98470 66554",
                "email": "kochi@malabarsolar.demo",
                "website": "https://www.malabarsolar.demo",
                "service_area": "Kochi, Thiruvananthapuram, Kozhikode, Thrissur",
                "authorised_status": "KSEBL & ANERT Empanelled",
                "verification_source": "ANERT Solar Soura Portal",
                "rating": 4.8,
                "completed_projects": 225,
                "is_demo": True,
                "last_verified_date": "2026-03-06"
            },
            {
                "name": "Bengal Solar & Renewable EPC",
                "state": "West Bengal",
                "district": "Kolkata",
                "city": "Kolkata",
                "contact": "Subhashish Banerjee",
                "phone": "+91 98300 77112",
                "email": "kolkata@bengalsolar.demo",
                "website": "https://www.bengalsolar.demo",
                "service_area": "Kolkata, Howrah, North 24 Parganas, Durgapur",
                "authorised_status": "WBSEDCL & CESC Empanelled",
                "verification_source": "WBSEDCL Solar Portal",
                "rating": 4.6,
                "completed_projects": 175,
                "is_demo": True,
                "last_verified_date": "2026-03-03"
            }
        ]

        for inst in installers_data:
            db.add(Installer(**inst))
        db.commit()

    # 3. Seed System Assumptions
    if db.query(SystemAssumption).count() == 0:
        assumptions_data = [
            {"key": "panel_wattage_w", "value": 550.0, "unit": "Watts", "category": "Technical", "description": "High-efficiency Tier 1 Mono PERC Half-cut solar panel capacity"},
            {"key": "generation_factor_kwh_per_kwp_day", "value": 4.0, "unit": "kWh/kWp/day", "category": "Engineering", "description": "Average daily solar electricity generation factor in India"},
            {"key": "annual_generation_per_kwp", "value": 1460.0, "unit": "kWh/kWp/year", "category": "Engineering", "description": "Benchmark annual solar generation yield per kilowatt peak"},
            {"key": "system_performance_ratio", "value": 0.80, "unit": "Ratio", "category": "Technical", "description": "Combined derating factor accounting for cabling, inverter, dust & temperature"},
            {"key": "roof_area_sqft_per_kwp", "value": 80.0, "unit": "sq.ft./kWp", "category": "Civil", "description": "Shadow-free rooftop area required per kWp including maintenance walkways"},
            {"key": "base_cost_per_kw_1to2kw", "value": 65000.0, "unit": "INR/kWp", "category": "Financial", "description": "Turnkey rooftop installation cost for 1-2 kW systems"},
            {"key": "base_cost_per_kw_3to5kw", "value": 55000.0, "unit": "INR/kWp", "category": "Financial", "description": "Turnkey rooftop installation cost for 3-5 kW systems"},
            {"key": "base_cost_per_kw_6plus", "value": 50000.0, "unit": "INR/kWp", "category": "Financial", "description": "Turnkey rooftop installation cost for >5 kW systems"},
            {"key": "grid_emission_factor", "value": 0.82, "unit": "kg CO2/kWh", "category": "Environmental", "description": "CEA Indian grid emission baseline factor"},
            {"key": "trees_equivalent_factor", "value": 45.0, "unit": "trees/tonne CO2", "category": "Environmental", "description": "Equivalent mature trees planted per metric tonne of CO2 avoided"},
            {"key": "default_electricity_tariff", "value": 7.50, "unit": "INR/kWh", "category": "Financial", "description": "Average domestic residential tariff baseline in India"},
            {"key": "annual_tariff_inflation", "value": 0.04, "unit": "Annual %", "category": "Financial", "description": "Expected compound annual increase in DISCOM electricity tariffs"},
            {"key": "panel_annual_degradation", "value": 0.007, "unit": "Annual %", "category": "Technical", "description": "Standard linear power output degradation per year"}
        ]

        for assump in assumptions_data:
            db.add(SystemAssumption(**assump))
        db.commit()

    # 4. Seed Demo User
    if db.query(User).filter(User.email == "demo@solarsahayak.in").count() == 0:
        demo_user = User(
            name="Aarav Sharma",
            email="demo@solarsahayak.in",
            mobile="9876543210",
            state="Maharashtra",
            district="Pune",
            city="Pune",
            pincode="411001",
            property_type="Home",
            consumer_category="Domestic/Residential",
            hashed_password=get_password_hash("solardemo2026"),
            is_demo=True
        )
        db.add(demo_user)
        db.commit()
