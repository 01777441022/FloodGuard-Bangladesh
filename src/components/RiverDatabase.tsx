import { useState } from "react";
import { motion } from "motion/react";
import { Search, Compass, TrendingUp, TrendingDown, RefreshCw, AlertCircle } from "lucide-react";
import { RiverData } from "../types";
import { FLOOD_RIVERS } from "../data";

interface RiverDatabaseProps {
  onSelectRiver: (river: RiverData) => void;
  selectedRiverId: string;
}

export default function RiverDatabase({ onSelectRiver, selectedRiverId }: RiverDatabaseProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRivers = FLOOD_RIVERS.filter((river) =>
    river.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    river.riverBasin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4 select-none">
      {/* Search Input */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-left">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-blue-600 animate-spin" style={{ animationDuration: "12s" }} />
            <div>
              <h4 className="text-xs md:text-sm font-bold text-slate-800 leading-snug">নদী ও অববাহিকা তথ্যভাণ্ডার</h4>
              <p className="text-[10px] text-slate-400 font-semibold tracking-wide">সারাদেশের প্রধান প্রধান বন্যাপ্রবণ নদীর পানি প্রবাহ</p>
            </div>
          </div>
          <span className="text-[10px] bg-slate-100 font-bold px-2 py-1 text-slate-500 rounded-lg">মোট ১৫টি অঞ্চল</span>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="নদী বা অববাহিকার নাম লিখে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            id="river-search-input"
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* River Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredRivers.map((river, idx) => {
          const isSelected = river.id === selectedRiverId;
          const isOverDanger = river.currentLevel >= river.dangerLevel;

          return (
            <motion.div
              key={river.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              onClick={() => onSelectRiver(river)}
              className={`p-4 rounded-3xl border text-left cursor-pointer transition-all duration-200 relative overflow-hidden ${
                isSelected
                  ? "bg-blue-600/5 border-blue-500 ring-2 ring-blue-500/15"
                  : "bg-white border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200"
              }`}
            >
              {/* Highlight badge for monitored state */}
              {isSelected && (
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-[9px] px-2.5 py-0.5 rounded-bl-xl font-bold uppercase tracking-widest animate-pulse">
                  পর্যবেক্ষণাধীন
                </div>
              )}

              {/* River details header */}
              <div className="space-y-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase block">
                  {river.riverBasin}
                </span>
                <h5 className="font-bold text-slate-800 text-xs md:text-sm">
                  {river.name}
                </h5>
              </div>

              {/* Risk metrics line */}
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <span className="text-[9px] text-slate-400 block font-semibold">বিপদসীমা স্তর</span>
                  <span className="text-xs font-mono font-bold text-rose-600">
                    {river.dangerLevel.toFixed(1)} মি.
                  </span>
                </div>

                <div>
                  <span className="text-[9px] text-slate-400 block font-semibold">সদ্য পরিমাপ</span>
                  <span className={`text-xs font-mono font-bold ${isOverDanger ? "text-purple-600" : "text-emerald-600"}`}>
                    {river.currentLevel.toFixed(1)} মি.
                  </span>
                </div>

                {/* Trend indicator */}
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-slate-400 font-light pb-0.5">প্রবাহের গতি</span>
                  {river.trend === "rising" ? (
                    <span className="text-[10px] bg-rose-50 text-rose-600 border border-rose-100 font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3 animate-bounce" />
                      <span>বাড়ছে</span>
                    </span>
                  ) : river.trend === "falling" ? (
                    <span className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-100 font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                      <TrendingDown className="w-3 h-3" />
                      <span>কমছে</span>
                    </span>
                  ) : (
                    <span className="text-[10px] bg-slate-50 text-slate-500 border border-slate-100 font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                      <RefreshCw className="w-3 h-3" />
                      <span>স্থির</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Secondary Warning indicators inside card */}
              {isOverDanger && (
                <div className="mt-3 p-1.5 bg-red-50 text-red-600 border border-red-100/55 rounded-xl flex items-center gap-1.5 text-[9px] font-bold">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 animate-bounce" />
                  <span>পানি প্রবাহ বর্তমানে বিপদসীমার উপর দিয়ে যাচ্ছে!</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
