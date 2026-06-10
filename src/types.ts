export enum RiskLevel {
  SAFE = "SAFE",         // 🟢 সবুজ
  WARNING = "WARNING",   // 🟡 হলুদ
  PREPARATION = "PREP",  // 🟠 কমলা
  EMERGENCY = "EMERG",   // 🔴 লাল
  CATASTROPHIC = "CATA"  // 🟣 গাঢ় লাল
}

export interface UserProfile {
  name: string;
  mobile: string;
  district: string;
  upazila: string;
  union: string;
  village: string;
  nearestRiver: string;
}

export interface ShelterCenter {
  id: string;
  name: string;
  type: string; // 'সরকারি প্রাথমিক বিদ্যালয়', 'দুর্যোগ আশ্রয়কেন্দ্র (Cyclone Shelter)', etc.
  capacity: number;
  distance: string; // Simulation distance
  address: string;
  phone: string;
  hasHigherGround: boolean;
  status: "উন্মুক্ত" | "পূর্ণ" | "প্রস্তুত";
}

export interface RiverData {
  id: string;
  name: string;
  dangerLevel: number;
  currentLevel: number;
  lastUpdated: string;
  trend: "rising" | "falling" | "stable";
  riverBasin: string;
}

export interface EducationTopic {
  id: number;
  title: string;
  iconName: string; // lucide icon identifier
  before: string[];
  explanation: string;
  after: string[];
}
