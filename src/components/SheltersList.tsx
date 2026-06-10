import { useState } from "react";
import { motion } from "motion/react";
import { MapPin, Phone, Shield, CheckCircle, Home, Users, Search, AlertCircle } from "lucide-react";
import { ShelterCenter } from "../types";
import { SIMULATED_SHELTERS } from "../data";

interface SheltersListProps {
  userDistrict: string;
}

export default function SheltersList({ userDistrict }: SheltersListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");

  const shelterTypes = [
    { key: "all", label: "সকল প্রকার" },
    { key: "বিদ্যালয়", label: "প্রাথমিক ও উচ্চ বিদ্যালয়" },
    { key: "Shelter", label: "দুর্যোগ আশ্রয়কেন্দ্র" },
    { key: "ভবন", label: "পরিষদ ও কলেজ ভবন" },
    { key: "মসজিদ", label: "মসজিদ/ধর্মীয় কমপ্লেক্স" }
  ];

  // Filtering shelters based on user selections
  const filteredShelters = SIMULATED_SHELTERS.filter((shelter) => {
    const matchesSearch =
      shelter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shelter.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedType === "all") return matchesSearch;
    if (selectedType === "বিদ্যালয়") return matchesSearch && (shelter.type.includes("বিদ্যালয়") || shelter.type.includes("স্কুল"));
    if (selectedType === "Shelter") return matchesSearch && shelter.type.includes("Cyclone Shelter");
    if (selectedType === "ভবন") return matchesSearch && (shelter.type.includes("ভবন") || shelter.type.includes("কলেজ"));
    if (selectedType === "মসজিদ") return matchesSearch && shelter.type.includes("মসজিদ");
    return matchesSearch;
  });

  return (
    <div className="flex flex-col gap-4 select-none">
      {/* Title & Evacuation Simulation Alert */}
      <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-3xl flex items-start gap-3">
        <div className="p-2 bg-blue-500 text-white rounded-xl">
          <Shield className="w-5 h-5 animate-pulse" />
        </div>
        <div className="text-left">
          <h4 className="text-sm font-bold text-slate-800">কাছের নিরাপদ আশ্রয়কেন্দ্রসমূহ</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            {userDistrict ? `${userDistrict} জেলা` : "আপনার নির্বাচিত এলাকা"} সংশ্লিষ্ট সকল উচুঁ দুর্যোগ আশ্রয়কেন্দ্রগুলোর তালিকা নিচে দেওয়া হল। দুর্যোগকালে পাশে দাঁড়াতে সজাগ থাকুন।
          </p>
        </div>
      </div>

      {/* Filter Options */}
      <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm space-y-3">
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="আশ্রয়কেন্দ্রের নাম বা এলাকা খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            id="shelter-search-input"
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Categories scrollable pill selector */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {shelterTypes.map((type) => (
            <button
              key={type.key}
              onClick={() => setSelectedType(type.key)}
              id={`shelter-type-pill-${type.key}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                selectedType === type.key
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-50 text-slate-600 border border-slate-200/50 hover:bg-slate-100"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Shelter list display */}
      <div className="space-y-3">
        {filteredShelters.length > 0 ? (
          filteredShelters.map((shelter, idx) => (
            <motion.div
              key={shelter.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-4 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all relative overflow-hidden"
            >
              {/* Highlight bar for Higher Ground status */}
              {shelter.hasHigherGround && (
                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] px-2.5 py-1 rounded-bl-xl font-bold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>উঁচু ঢিবি সংবলিত</span>
                </div>
              )}

              {/* Shelter Main Information */}
              <div className="text-left space-y-1.5 pr-20">
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold text-slate-600 inline-block uppercase">
                  {shelter.type}
                </span>
                <h5 className="font-bold text-slate-800 text-xs md:text-sm leading-snug">
                  {shelter.name}
                </h5>
                
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{shelter.address}</span>
                </div>
              </div>

              {/* Distance and Evacuation Capacity details */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-5 text-slate-600">
                  <div className="text-left">
                    <span className="text-[10px] text-slate-400 block font-semibold">দূরত্ব ও সময়</span>
                    <span className="text-xs font-bold text-slate-800">{shelter.distance}</span>
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] text-slate-400 block font-semibold">মোট ধারণ ক্ষমতা</span>
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-sky-500" />
                      {shelter.capacity} জন
                    </span>
                  </div>
                </div>

                {/* Direct Telephone calling and status indicator */}
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                      shelter.status === "উন্মুক্ত"
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        : shelter.status === "পূর্ণ"
                        ? "bg-red-50 text-red-600 border border-red-100"
                        : "bg-amber-50 text-amber-600 border border-amber-100"
                    }`}
                  >
                    ● {shelter.status}
                  </span>
                  <a
                    href={`tel:${shelter.phone}`}
                    className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 transition-all cursor-pointer inline-flex items-center"
                    title="কল করুন"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="py-12 bg-white rounded-3xl border border-dashed border-slate-200 text-center text-slate-400 text-xs">
            <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2 animate-bounce" />
            <span>কোন আশ্রয়কেন্দ্র খুঁজে পাওয়া যায়নি</span>
          </div>
        )}
      </div>
    </div>
  );
}
