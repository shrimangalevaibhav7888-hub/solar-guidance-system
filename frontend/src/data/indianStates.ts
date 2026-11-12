export interface StateData {
  name: string;
  tariff: number;
  insolationFactor: number;
  isSpecialState: boolean;
  discoms: string[];
  districts: string[];
}

export const INDIAN_STATES: Record<string, StateData> = {
  "Maharashtra": {
    name: "Maharashtra",
    tariff: 8.20,
    insolationFactor: 1.02,
    isSpecialState: false,
    discoms: ["MSEDCL (Mahavitaran)", "Tata Power Mumbai", "Adani Electricity Mumbai", "BEST"],
    districts: ["Pune", "Mumbai", "Thane", "Nagpur", "Nashik", "Aurangabad (Chhatrapati Sambhajinagar)", "Kolhapur", "Solapur", "Amravati", "Nanded"]
  },
  "Gujarat": {
    name: "Gujarat",
    tariff: 6.80,
    insolationFactor: 1.08,
    isSpecialState: false,
    discoms: ["DGVCL", "MGVCL", "PGVCL", "UGVCL", "Torrent Power"],
    districts: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar", "Junagadh", "Kutch", "Anand"]
  },
  "Delhi": {
    name: "Delhi",
    tariff: 7.00,
    insolationFactor: 0.98,
    isSpecialState: false,
    discoms: ["BSES Rajdhani (BRPL)", "BSES Yamuna (BYPL)", "Tata Power DDL (TPDDL)", "NDMC"],
    districts: ["New Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi", "Central Delhi", "South West Delhi"]
  },
  "Karnataka": {
    name: "Karnataka",
    tariff: 7.90,
    insolationFactor: 1.04,
    isSpecialState: false,
    discoms: ["BESCOM (Bengaluru)", "MESCOM (Mangaluru)", "HESCOM (Hubballi)", "GESCOM (Kalaburagi)", "CHESCOM (Mysuru)"],
    districts: ["Bengaluru Urban", "Mysuru", "Mangaluru", "Hubballi-Dharwad", "Belagavi", "Tumakuru", "Shivamogga", "Ballari", "Kalaburagi", "Udupi"]
  },
  "Tamil Nadu": {
    name: "Tamil Nadu",
    tariff: 6.90,
    insolationFactor: 1.05,
    isSpecialState: false,
    discoms: ["TANGEDCO (Tamil Nadu Generation and Distribution Corp)"],
    districts: ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tiruppur", "Erode", "Vellore", "Thoothukudi", "Dindigul"]
  },
  "Uttar Pradesh": {
    name: "Uttar Pradesh",
    tariff: 7.40,
    insolationFactor: 0.99,
    isSpecialState: false,
    discoms: ["MVVNL (Lucknow)", "PVVNL (Meerut/Noida)", "DVVNL (Agra)", "PuVVNL (Varanasi)", "KESCo (Kanpur)"],
    districts: ["Lucknow", "Noida / Gautam Buddha Nagar", "Ghaziabad", "Kanpur", "Varanasi", "Agra", "Prayagraj", "Meerut", "Bareilly", "Aligarh"]
  },
  "Rajasthan": {
    name: "Rajasthan",
    tariff: 7.60,
    insolationFactor: 1.12,
    isSpecialState: false,
    discoms: ["JVVNL (Jaipur)", "AVVNL (Ajmer)", "JdVVNL (Jodhpur)"],
    districts: ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur", "Bhilwara", "Alwar", "Sikar", "Pali"]
  },
  "Kerala": {
    name: "Kerala",
    tariff: 7.10,
    insolationFactor: 0.96,
    isSpecialState: false,
    discoms: ["KSEBL (Kerala State Electricity Board Ltd)"],
    districts: ["Ernakulam (Kochi)", "Thiruvananthapuram", "Kozhikode", "Thrissur", "Kollam", "Palakkad", "Malappuram", "Kannur", "Kottayam", "Alappuzha"]
  },
  "Telangana": {
    name: "Telangana",
    tariff: 7.30,
    insolationFactor: 1.03,
    isSpecialState: false,
    discoms: ["TSSPDCL (Southern Power)", "TSNPDCL (Northern Power)"],
    districts: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Rangareddy", "Medchal-Malkajgiri", "Nalgonda"]
  },
  "Andhra Pradesh": {
    name: "Andhra Pradesh",
    tariff: 7.20,
    insolationFactor: 1.04,
    isSpecialState: false,
    discoms: ["APEPDCL (Eastern Power)", "APCPDCL (Central Power)", "APSPDCL (Southern Power)"],
    districts: ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Rajahmundry", "Tirupati", "Kakinada", "Kadapa", "Anantapur"]
  },
  "West Bengal": {
    name: "West Bengal",
    tariff: 7.80,
    insolationFactor: 0.95,
    isSpecialState: false,
    discoms: ["WBSEDCL", "CESC (Kolkata)"],
    districts: ["Kolkata", "Howrah", "North 24 Parganas", "South 24 Parganas", "Hooghly", "Durgapur", "Siliguri", "Asansol", "Bardhaman", "Nadia"]
  },
  "Punjab": {
    name: "Punjab",
    tariff: 6.50,
    insolationFactor: 1.00,
    isSpecialState: false,
    discoms: ["PSPCL (Punjab State Power Corp Ltd)"],
    districts: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali (SAS Nagar)", "Hoshiarpur", "Pathankot"]
  },
  "Haryana": {
    name: "Haryana",
    tariff: 7.10,
    insolationFactor: 1.01,
    isSpecialState: false,
    discoms: ["DHBVN (Dakshin Haryana)", "UHBVN (Uttar Haryana)"],
    districts: ["Gurugram", "Faridabad", "Panipat", "Ambala", "Karnal", "Hisar", "Rohtak", "Sonipat", "Panchkula"]
  },
  "Madhya Pradesh": {
    name: "Madhya Pradesh",
    tariff: 7.50,
    insolationFactor: 1.06,
    isSpecialState: false,
    discoms: ["MPPKVVCL (Indore/Jabalpur)", "MPMKVVCL (Bhopal)"],
    districts: ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Dewas", "Satna", "Ratlam"]
  },
  "Bihar": {
    name: "Bihar",
    tariff: 7.30,
    insolationFactor: 0.97,
    isSpecialState: false,
    discoms: ["NBPDCL (North Bihar)", "SBPDCL (South Bihar)"],
    districts: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga", "Bihar Sharif", "Arrah"]
  },
  "Himachal Pradesh": {
    name: "Himachal Pradesh",
    tariff: 5.80,
    insolationFactor: 0.95,
    isSpecialState: true,
    discoms: ["HPSEBL (HP State Electricity Board)"],
    districts: ["Shimla", "Mandi", "Dharamshala / Kangra", "Solan", "Kullu", "Hamirpur", "Una", "Bilaspur"]
  },
  "Uttarakhand": {
    name: "Uttarakhand",
    tariff: 5.90,
    insolationFactor: 0.96,
    isSpecialState: true,
    discoms: ["UPCL (Uttarakhand Power Corp Ltd)"],
    districts: ["Dehradun", "Haridwar", "Haldwani / Nainital", "Rishikesh", "Roorkee", "Rudrapur", "Kashipur"]
  },
  "Jammu and Kashmir": {
    name: "Jammu and Kashmir",
    tariff: 5.20,
    insolationFactor: 0.96,
    isSpecialState: true,
    discoms: ["JPDCL (Jammu)", "KPDCL (Kashmir)"],
    districts: ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Udhampur", "Kathua"]
  },
  "Assam": {
    name: "Assam",
    tariff: 7.10,
    insolationFactor: 0.90,
    isSpecialState: true,
    discoms: ["APDCL (Assam Power Distribution Co. Ltd)"],
    districts: ["Guwahati / Kamrup", "Dibrugarh", "Silchar", "Jorhat", "Nagaon", "Tinsukia", "Tezpur"]
  },
  "Goa": {
    name: "Goa",
    tariff: 5.40,
    insolationFactor: 1.02,
    isSpecialState: false,
    discoms: ["Electricity Department Govt of Goa"],
    districts: ["North Goa", "South Goa", "Panaji", "Margao", "Vasco da Gama"]
  }
};
