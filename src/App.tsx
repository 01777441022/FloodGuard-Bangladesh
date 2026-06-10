import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShieldAlert,
  Home,
  MapPin,
  Compass,
  PhoneCall,
  User,
  Sliders,
  CloudRain,
  Volume2,
  AlertTriangle,
  Clock,
  ExternalLink,
  Info,
  Calendar,
  AlertOctagon
} from "lucide-react";

import { RiskLevel, UserProfile, RiverData } from "./types";
import { FLOOD_RIVERS, EDUCATION_TOPICS, EMERGENCY_CONTACTS, VOLUNTEER_CONTACTS } from "./data";

import WaterGauge from "./components/WaterGauge";
import NotificationAlert from "./components/NotificationAlert";
import SheltersList from "./components/SheltersList";
import EducationCard from "./components/EducationCard";
import RegistrationForm from "./components/RegistrationForm";
import RiverDatabase from "./components/RiverDatabase";

export default function App() {
  // 1. Core State Managers
  const [waterLevel, setWaterLevel] = useState<number>(4.5);
  const [selectedRiver, setSelectedRiver] = useState<RiverData>(FLOOD_RIVERS[0]);
  const [isRaining, setIsRaining] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Load profile from localStorage on boot
  useEffect(() => {
    const saved = localStorage.getItem("floodguard_bangladesh_profile");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUserProfile(parsed);
        // Find corresponding river if saved in profile
        const matchedRiver = FLOOD_RIVERS.find((r) => r.name === parsed.nearestRiver);
        if (matchedRiver) {
          setSelectedRiver(matchedRiver);
        }
      } catch (e) {
        console.error("Failed to parse user profile from cache", e);
      }
    }
  }, []);

  // Save profile helper
  const handleSaveProfile = (profile: UserProfile) => {
    localStorage.setItem("floodguard_bangladesh_profile", JSON.stringify(profile));
    setUserProfile(profile);
    const matchedRiver = FLOOD_RIVERS.find((r) => r.name === profile.nearestRiver);
    if (matchedRiver) {
      setSelectedRiver(matchedRiver);
    }
  };

  // 2. Derive Current Flood risk parameters dynamically based on 0-15 scale
  const getRiskDetails = (lvl: number) => {
    if (lvl <= 5.0) {
      return {
        level: RiskLevel.SAFE,
        text: "নিরাপদ",
        colorClass: "bg-emerald-500 text-white",
        borderClass: "border-emerald-500",
        message: "🟢 পরিস্থিতি নিরাপদ রয়েছে। কোনো সক্রিয় সতর্কবার্তা নেই।",
        forecastTime: "কোনো বন্যা ঝুঁকি নেই",
        bgColor: "bg-emerald-50/40"
      };
    } else if (lvl <= 7.0) {
      return {
        level: RiskLevel.WARNING,
        text: "সতর্কতা",
        colorClass: "bg-yellow-500 text-slate-900 font-bold",
        borderClass: "border-yellow-500",
        message: "🟡 সতর্ক থাকুন, নদীর পানি বৃদ্ধি পাচ্ছে। খবরাখবর রাখুন।",
        forecastTime: "পরিস্থিতি ২৫-৩০ ঘন্টার মধ্যে তীব্র হতে পারে",
        bgColor: "bg-yellow-50/40"
      };
    } else if (lvl <= 9.0) {
      return {
        level: RiskLevel.PREPARATION,
        text: "প্রস্তুতি",
        colorClass: "bg-orange-500 text-white",
        borderClass: "border-orange-500",
        message: "🟠 ঘরের মেঝেতে পানি উঠতে পারে। শুকনো খাবার ও পাওয়ার ব্যাংক গুছিয়ে রাখুন।",
        forecastTime: "১০-১৫ ঘন্টার মধ্যে প্লাবনের উচ্চ আশঙ্কা",
        bgColor: "bg-orange-50/40"
      };
    } else if (lvl <= 11.0) {
      return {
        level: RiskLevel.EMERGENCY,
        text: "জরুরি",
        colorClass: "bg-red-500 text-white animate-pulse",
        borderClass: "border-red-500",
        message: "🔴 গবাদি পশু, মূল্যবান দলিলপত্র ও জিনিসপত্র অবিলম্বের উঁচু জায়গায় সরান।",
        forecastTime: "৩-৫ ঘন্টার মধ্যে সম্পূর্ণ ডুবে যাওয়ার চরম আশঙ্কা",
        bgColor: "bg-red-50/40"
      };
    } else {
      return {
        level: RiskLevel.CATASTROPHIC,
        text: "মহাবিপদ",
        colorClass: "bg-purple-600 text-white animate-pulse",
        borderClass: "border-purple-600",
        message: "🟣 মহাবিপদ! দ্রুত ঘরের মেইন ইলেকট্রিক লাইন বন্ধ করে সরকারি আশ্রয়কেন্দ্রে যান।",
        forecastTime: "এলাকা ইতিমধ্য বন্যাকবলিত! উদ্ধার বার্তা সক্রিয়",
        bgColor: "bg-purple-50/40"
      };
    }
  };

  const currentRisk = getRiskDetails(waterLevel);

  // Sync Slider values when river selection changes to simulate data fetch
  const handleSelectRiver = (river: RiverData) => {
    setSelectedRiver(river);
    // Mimic the selected river's level as the simulated baseline
    const approxLvl = Math.min(15, Math.max(0, river.currentLevel));
    setWaterLevel(approxLvl);
    // Scroll smoothly to dashboard if on mobile
    window.scrollTo({ top: 0, behavior: "smooth" });
    setActiveTab("dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans relative pb-24 md:pb-8 flex flex-col items-center">
      
      {/* Immersive animated Rain Overlay */}
      {isRaining && (
        <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden bg-blue-950/5">
          <div className="w-full h-full relative">
            {Array.from({ length: 40 }).map((_, i) => (
              <div
                key={i}
                className="absolute bg-blue-400/40 w-[1.5px] h-6 rounded-full animate-rain"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * -20}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${0.8 + Math.random() * 0.8}s`
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Main Container Wrapper - Responsive Desktop Sidebar & Mobile Centered Frame */}
      <div className="w-full max-w-5xl mx-auto px-4 py-4 md:py-8 flex flex-col gap-6">
        
        {/* Header Applet Bar */}
        <header className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white/80 backdrop-blur-md border border-slate-100 rounded-3xl shadow-sm gap-4">
          <div className="flex items-center gap-3 text-left">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold tracking-tight text-blue-600">
                FloodGuard Bangladesh
              </h1>
              <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">
                বন্যা আগাম সতর্কবার্তা ও প্রস্তুতি নেটওয়ার্ক
              </span>
            </div>
          </div>

          {/* Quick weather variables dashboard toggles */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRaining(!isRaining)}
              id="rain-toggle-btn"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                isRaining
                  ? "bg-blue-500 text-white shadow-md shadow-blue-200"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <CloudRain className={`w-4 h-4 ${isRaining ? "animate-bounce" : ""}`} />
              <span>{isRaining ? "বৃষ্টি সিমুলেশন অন" : "বৃষ্টি সিমুলেশন অফ"}</span>
            </button>
            
            {/* Live Bangladesh Flag Badge */}
            <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-1.5 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 relative overflow-hidden flex items-center justify-center">
                <span className="absolute w-1 h-1 bg-red-600" />
              </span>
              <span className="font-bold text-emerald-800 text-[10px]">বাংলা সংস্করণ</span>
            </div>
          </div>
        </header>

        {/* Global Alert messages popups container */}
        <NotificationAlert level={waterLevel} riskLevel={currentRisk.level} />

        {/* Outer Split Layout - Desktop Sidebar (2 columns on lg, single column on mobile) */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT PANEL: Nav, Sensor Simulation and Main Active State Frame */}
          <main className="lg:col-span-8 space-y-6">
            
            {/* Navigational Tabs row */}
            <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm flex gap-1 overflow-x-auto no-scrollbar">
              {[
                { id: "dashboard", label: "হোম ড্যাশবোর্ড", icon: Sliders },
                { id: "shelters", label: "নিরাপদ আশ্রয়কেন্দ্র", icon: Home },
                { id: "education", label: "প্রস্তুতি ও শিক্ষা গাইড", icon: Info },
                { id: "rivers", label: "নদী ও অববাহিকা", icon: Compass },
                { id: "contacts", label: "জরুরি যোগাযোগ", icon: PhoneCall },
                { id: "profile", label: "আমার প্রোফাইল", icon: User }
              ].map((tab) => {
                const TabIcon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    id={`nav-tab-btn-${tab.id}`}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <TabIcon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB SCREENS CONDITIONAL RENDERING with Framer Motion wrapper */}
            <div className="relative">
              <AnimatePresence mode="wait">
                {activeTab === "dashboard" && (
                  <motion.div
                    key="dashboard"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    {/* Welcome Notice Bar based on registration */}
                    {userProfile ? (
                      <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-3xl text-left flex items-start gap-3">
                        <div className="p-2 bg-emerald-600 text-white rounded-xl">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-emerald-900">
                            স্বাগতম, {userProfile.name}!
                          </h4>
                          <p className="text-[11px] text-emerald-800 leading-normal mt-0.5">
                            আপনার এলাকা <strong>{userProfile.village}, {userProfile.upazila}</strong> এবং নিকটতম পর্যবেক্ষণ নদী <strong>{userProfile.nearestRiver}</strong> অনুসারে কাস্টমাইজড বন্যা তথ্য সক্রিয় আছে।
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-blue-50 border border-blue-100 rounded-3xl text-left flex items-start gap-3">
                        <div className="p-2 bg-blue-600 text-white rounded-xl">
                          <Info className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xs font-bold text-blue-900">
                            ব্যক্তিগত প্রোফাইল নিবন্ধন এখনো করা হয়নি
                          </h4>
                          <p className="text-[11px] text-blue-700 leading-normal mt-0.5">
                            নিবন্ধিত হলে নিকটতম নদী ও আশ্রয়কেন্দ্রের লাইভ দূরত্ব হিসাব করা সুবিধা পাওয়া যাবে।
                          </p>
                        </div>
                        <button
                          onClick={() => setActiveTab("profile")}
                          id="dash-go-profile-btn"
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg text-[10px] font-bold self-center cursor-pointer"
                        >
                          নিবন্ধন করুন
                        </button>
                      </div>
                    )}

                    {/* CORE SENSOR SIMULATION CONTROL */}
                    <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-xl text-left space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sliders className="w-5 h-5 text-blue-600 animate-pulse" />
                          <h3 className="font-bold text-slate-800 text-sm md:text-base">
                            বন্যা সেন্সর সিমুলেটর (জলস্তর পরিবর্তন)
                          </h3>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-600">
                          ম্যানুয়াল যাচাই
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 leading-normal">
                        রিয়েল-টাইম বন্যা ঝুঁকি যাচাই করতে নিচের স্লাইডারটি পরিবর্তন করুন। স্লাইডার পরিবর্তনের সাথে সাথে পানি স্তর গেজ, সিগন্যাল লাইট, এবং বন্যা এলার্ম শব্দ ডাইনামিকালি পরিবর্তিত হবে।
                      </p>

                      {/* Level Input Slider Container */}
                      <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-700">পরিমাপ স্কেল: ০ – ১৫ মিটার</span>
                          <span className={`px-2.5 py-0.5 text-xs font-bold rounded-lg ${currentRisk.colorClass}`}>
                            {currentRisk.text} অবস্থা
                          </span>
                        </div>

                        {/* Visual Range Indicator Bar */}
                        <div className="relative w-full">
                          <input
                            type="range"
                            min="0"
                            max="15"
                            step="0.1"
                            value={waterLevel}
                            onChange={(e) => setWaterLevel(parseFloat(e.target.value))}
                            id="water-level-range-slider"
                            className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          />
                        </div>

                        {/* Legend parameters with corresponding color blocks */}
                        <div className="grid grid-cols-5 gap-1 text-[9px] font-bold text-center text-slate-500 pt-1">
                          <div className="p-1 rounded bg-emerald-50 text-emerald-700">০-৫ (নিরাপদ)</div>
                          <div className="p-1 rounded bg-yellow-50 text-yellow-700">৬-৭ (সতর্কতা)</div>
                          <div className="p-1 rounded bg-orange-50 text-orange-700">৮-৯ (প্রস্তুতি)</div>
                          <div className="p-1 rounded bg-red-50 text-red-700">১০-১১ (জরুরি)</div>
                          <div className="p-1 rounded bg-purple-50 text-purple-700">১২-১৫ (মহাবিপদ)</div>
                        </div>
                      </div>

                      {/* Current Status dynamic alert card */}
                      <div className={`p-4 rounded-2xl border flex items-start gap-3 transition-colors ${currentRisk.bgColor} ${currentRisk.borderClass}`}>
                        <div className="mt-0.5">
                          {waterLevel >= 10 ? (
                            <AlertTriangle className="w-5 h-5 text-red-500 animate-bounce" />
                          ) : (
                            <Info className="w-5 h-5 text-blue-500" />
                          )}
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-slate-800">বর্তমান নদীর পানি স্তরের স্থিতি বার্তা</h5>
                          <p className="text-xs font-semibold text-slate-700 leading-relaxed mt-1">
                            {currentRisk.message}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Dual columns for circular gauge & live statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Water Circular Meter visualizer */}
                      <WaterGauge
                        level={waterLevel}
                        riskLevel={currentRisk.level}
                        riskText={currentRisk.text}
                        riskColor={currentRisk.colorClass}
                        riverName={selectedRiver.name}
                      />

                      {/* Real-time Dynamic predictions simulation panel */}
                      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl text-left flex flex-col justify-between space-y-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-blue-600" />
                            <h4 className="font-bold text-slate-800 text-sm">সম্ভাব্য প্লাবন পূর্বাভাস সময়</h4>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">
                            সংযুক্ত আবহাওয়া রেডার ও আকস্মিক মেঘের ঘনত্বভিত্তিক পূর্বাভাস মডেল।
                          </p>
                        </div>

                        {/* Estimated time details */}
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/60 space-y-3">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500 font-semibold">সম্ভাব্য পিক বন্যা সময়:</span>
                            <span className="font-bold text-slate-800">{currentRisk.forecastTime}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500 font-semibold">আশেপাশে আশ্রয়কেন্দ্রের কর্মক্ষমতা:</span>
                            <span className="font-bold text-emerald-600">উন্মুক্ত ও প্রস্তুত</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500 font-semibold">ঝুঁকিপূর্ণ গবাদি পশু সংখ্যা (এলাকা):</span>
                            <span className="font-bold text-amber-600">৩৫০+ (সতর্কিত)</span>
                          </div>
                        </div>

                        {/* Circular progress simulated loader */}
                        <div className="p-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl flex items-center gap-3">
                          <span className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-ping" />
                          <p className="text-[10px] text-slate-500 font-medium">
                            {selectedRiver.name} অববাহিকায় লাইভ ট্র্যাকিং সচল আছে। তথ্য প্রতি ১০ মিনিট অন্তর আপডেট হয়।
                          </p>
                        </div>

                        <button
                          onClick={() => setActiveTab("education")}
                          id="dash-go-edu-btn"
                          className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <span>প্রতিরোধ নির্দেশনাবলী বিস্তারিত দেখুন</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  </motion.div>
                )}

                {/* Shelter lists */}
                {activeTab === "shelters" && (
                  <motion.div
                    key="shelters"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SheltersList userDistrict={userProfile?.district || ""} />
                  </motion.div>
                )}

                {/* Instruction topics */}
                {activeTab === "education" && (
                  <motion.div
                    key="education"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="text-left py-2">
                      <h3 className="font-bold text-slate-800 text-base md:text-lg">বন্যা দুর্যোগ প্রস্তুতি ও নিরাপত্তা গাইড</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        ভিডিও-স্টাইল রেন্ডারিং মডিউলে প্রতিটি টপিকের আগে, সময়ে এবং পরে করণীয় বিস্তারিত জানুন।
                      </p>
                    </div>

                    <div className="space-y-3">
                      {EDUCATION_TOPICS.map((topic) => (
                        <EducationCard key={topic.id} topic={topic} />
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Rivers catalog dataset list */}
                {activeTab === "rivers" && (
                  <motion.div
                    key="rivers"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.2 }}
                  >
                    <RiverDatabase
                      selectedRiverId={selectedRiver.id}
                      onSelectRiver={handleSelectRiver}
                    />
                  </motion.div>
                )}

                {/* Emergency Telephone directory contact options */}
                {activeTab === "contacts" && (
                  <motion.div
                    key="contacts"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6 text-left"
                  >
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-md">
                      <h3 className="font-bold text-slate-800 text-sm md:text-base flex items-center gap-2">
                        <PhoneCall className="w-5 h-5 text-red-500 animate-bounce" />
                        জাতীয় ও স্থানীয় জরুরি নম্বরসমূহ
                      </h3>
                      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                        বন্যা দুর্গত এলাকার উদ্ধার কাজের জন্য বা যেকোনো তাৎক্ষণিক স্বাস্থ্য ও লিগ্যাল জিজ্ঞাসায় সরাসরি ফোন কলের জন্য বাটনে চাপ দিন।
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                        {EMERGENCY_CONTACTS.map((item, idx) => (
                          <a
                            href={`tel:${item.number}`}
                            key={idx}
                            id={`emergency-call-card-${item.number}`}
                            className="p-4 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-150 flex items-center justify-between transition-all cursor-pointer group"
                          >
                            <div className="space-y-1">
                              <span className="text-[9px] text-slate-400 font-bold block uppercase">
                                {item.subtitle}
                              </span>
                              <h5 className="font-bold text-slate-800 text-sm">
                                {item.title}
                              </h5>
                              <span className="text-xs font-mono font-bold text-blue-600">
                                {item.number}
                              </span>
                            </div>
                            <div className={`p-2.5 text-white rounded-xl ${item.color} shadow-md group-hover:scale-105 transition-all`}>
                              <PhoneCall className="w-4 h-4" />
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>

                    {/* Local Volunteers Directories Simulation */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-md">
                      <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5 mb-1">
                        <User className="w-4 h-4 text-emerald-500" />
                        আঞ্চলিক রেড ক্রিসেন্ট ও স্বেচ্ছাসেবক সংযোগ
                      </h4>
                      <p className="text-xs text-slate-400 mb-4">
                        বন্যার সময় তাৎক্ষণিক খাদ্য বিতরণ বা নৌকা নিয়ে আটকে পড়া মানুষদের সাহায্যের জরুরি দল।
                      </p>

                      <div className="space-y-3">
                        {VOLUNTEER_CONTACTS.map((v, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 bg-slate-50 border border-slate-150 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center font-bold text-xs uppercase">
                                {v.name.charAt(0)}
                              </div>
                              <div>
                                <h5 className="font-bold text-slate-800 text-xs">{v.name}</h5>
                                <p className="text-[10px] text-slate-400 font-semibold">{v.role} • {v.area}</p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
                              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[9px] font-bold">
                                ● {v.status}
                              </span>
                              <a
                                href={`tel:${v.phone}`}
                                id={`volunteer-call-btn-${idx}`}
                                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center gap-1 cursor-pointer transition-all text-[11px]"
                              >
                                <PhoneCall className="w-3 h-3" />
                                <span>কল করুন</span>
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Profile configurations form screen */}
                {activeTab === "profile" && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.2 }}
                  >
                    <RegistrationForm profile={userProfile} onSave={handleSaveProfile} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </main>

          {/* RIGHT SIDEBAR: Static Safety Tips (Side widgets on Desktop, Stacked below on mobile) */}
          <aside className="lg:col-span-4 space-y-6 text-left select-none">
            
            {/* Quick Flooding risk thermometer indicator */}
            <div className="p-5 bg-white rounded-3xl border border-slate-100 shadow-md space-y-4">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-rose-500 animate-pulse" />
                <h4 className="font-bold text-slate-800 text-xs md:text-sm">দুর্যোগ নিয়ন্ত্রণ কক্ষ বার্তা</h4>
              </div>

              {/* Status checklist progress */}
              <div className="space-y-3 text-xs font-medium">
                <div className="flex items-center gap-2.5 p-2 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold text-white ${waterLevel >= 6 ? "bg-amber-500 animate-ping" : "bg-emerald-500"}`}>✓</span>
                  <div className="flex-1">
                    <p className="text-slate-800">পানির উচ্চতা পর্যবেক্ষণ</p>
                    <p className="text-[9px] text-slate-400">বর্তমানে {waterLevel.toFixed(1)} মিটার</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold text-white ${waterLevel >= 10 ? "bg-rose-500 animate-ping" : "bg-emerald-500"}`}>✓</span>
                  <div className="flex-1">
                    <p className="text-slate-800">আশ্রয় সতর্কবার্তা সিগন্যাল</p>
                    <p className="text-[9px] text-slate-400">{waterLevel >= 12 ? "অবিলম্বে সরিয়ে নেওয়া প্রয়োজন" : "প্রস্তুত রয়েছে"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center text-[8px] font-bold text-white">✓</span>
                  <div className="flex-1">
                    <p className="text-slate-800">আঞ্চলিক সেচ্ছাসেবক টিম</p>
                    <p className="text-[9px] text-slate-400">সিলেট ও তিস্তা অববাহিকায় সক্রিয়</p>
                  </div>
                </div>
              </div>

              {/* General Disclaimer */}
              <div className="p-3 bg-blue-50/40 rounded-2xl border border-blue-500/10 text-[10px] text-slate-500 leading-relaxed font-semibold">
                *এই অ্যাপটি একটি উন্নত সিমুলেটেড ফ্লাড আর্লি ওয়ার্নিং ইন্টিফ্রেশন। দুর্যোগের চরম মুহূর্তে নিকটস্থ ওয়্যারলেস নোটিশ ও সরকারি প্রশাসনের মাইকিং অনুসরণ করুন।
              </div>
            </div>

            {/* Quick action disaster checklist card */}
            <div className="p-5 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-3xl shadow-xl space-y-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-yellow-300" />
                <h4 className="font-bold text-sm">জরুরি বন্যা ব্যাগ গুছিয়ে নিন</h4>
              </div>
              <p className="text-xs text-blue-100 leading-relaxed font-light">
                আকস্মিক বন্যা বা পাহাড়ি ঢল আসার পূর্বেই আপনার জরুরি সাহায্য ব্যাগে অবশ্যই নিচের জিনিসগুলো নিশ্চিত করুন:
              </p>

              {/* Checklist bullet markers */}
              <div className="space-y-2 text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-yellow-300 rounded-full" />
                  <span>১০ দিনের শুকনো খাবার (চিঁড়ে, মুড়ি, গুড়)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-yellow-300 rounded-full" />
                  <span>পানি বিশুদ্ধকরণ হ্যালোজেন ট্যাবলেট</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-yellow-300 rounded-full" />
                  <span>মোবাইল ফোন, পাওয়ার ব্যাংক ও পলিথিন ব্যাগ</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-yellow-300 rounded-full" />
                  <span>জমির দলিল ও প্রয়োজনীয় ঔষধপত্র</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setActiveTab("education");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="w-full py-2 bg-white text-blue-700 font-bold rounded-xl text-xs hover:bg-slate-100 cursor-pointer text-center block"
                >
                  বিস্তারিত কাজের তালিকা দেখুন
                </button>
              </div>
            </div>

            {/* Weather forecast info */}
            <div className="p-5 bg-white rounded-3xl border border-slate-100 shadow-md text-slate-500 text-xs">
              <div className="flex items-center gap-1.5 text-slate-700 font-bold mb-2">
                <Calendar className="w-4 h-4" />
                <span>মৌসুমি আষাঢ় মাসের তথ্য</span>
              </div>
              <p className="leading-relaxed">
                বাংলাদেশের ব্রহ্মপুত্র নদ ও যমুনা অববাহিকায় পাহাড়ি ঢলের কারণে পানি দ্রুত বৃদ্ধি পাচ্ছে। কুড়িগ্রাম, লালমনিরহাট, ফেনী ও সিলেট এলাকার বাসিন্দাদের সজাগ থাকার পরামর্শ দেওয়া যাচ্ছে।
              </p>
            </div>

          </aside>

        </div>

      </div>

      {/* Floating Bottom Nav for ultra convenient Mobile and touch-responsive access */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur border-t border-slate-150 flex items-center justify-around px-2 z-40 md:hidden shadow-lg select-none">
        {[
          { id: "dashboard", label: "হোম", icon: Sliders },
          { id: "shelters", label: "আশ্রয়কেন্দ্র", icon: Home },
          { id: "education", label: "নির্দেশনা", icon: Info },
          { id: "rivers", label: "অববাহিকা", icon: Compass },
          { id: "contacts", label: "জরুরি", icon: PhoneCall }
        ].map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              id={`mobile-nav-tab-${tab.id}`}
              className={`flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-all ${
                isActive ? "text-blue-600 scale-105" : "text-slate-400"
              }`}
            >
              <TabIcon className="w-5 h-5" />
              <span className="text-[9px] font-bold mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </nav>
      
    </div>
  );
}
