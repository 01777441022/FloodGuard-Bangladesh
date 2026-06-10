import React, { useState, useEffect } from "react";
import { UserProfile } from "../types";
import { BANGLADESH_LOCATIONS, FLOOD_RIVERS } from "../data";
import { User, Phone, Map, Navigation, Eye, UserCheck, Edit3, ShieldAlert } from "lucide-react";

interface RegistrationFormProps {
  profile: UserProfile | null;
  onSave: (data: UserProfile) => void;
}

export default function RegistrationForm({ profile, onSave }: RegistrationFormProps) {
  const [isEditing, setIsEditing] = useState(!profile);
  const [name, setName] = useState(profile?.name || "");
  const [mobile, setMobile] = useState(profile?.mobile || "");
  const [district, setDistrict] = useState(profile?.district || "সিলেট");
  const [upazila, setUpazila] = useState(profile?.upazila || "");
  const [union, setUnion] = useState(profile?.union || "");
  const [village, setVillage] = useState(profile?.village || "");
  const [nearestRiver, setNearestRiver] = useState(profile?.nearestRiver || "সুরমা নদী");

  // Keep Upazila list in sync with District selection
  const upazilaList = BANGLADESH_LOCATIONS[district] || [];

  useEffect(() => {
    // If district changes, auto-select the first available upazila
    if (upazilaList.length > 0 && !upazilaList.includes(upazila)) {
      setUpazila(upazilaList[0]);
    }
  }, [district]);

  // Handle form save
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert("দয়া করে আপনার নাম প্রদান করুন");
    if (!mobile.trim() || mobile.length < 11) return alert("দয়া করে সঠিক ১১ ডিজিটের মোবাইল নম্বরটি লিখুন");
    if (!upazila) return alert("দয়া করে আপনার উপজেলা নির্বাচন করুন");
    if (!union.trim()) return alert("দয়া করে আপনার ইউনিয়ন লিখুন");
    if (!village.trim()) return alert("দয়া করে আপনার গ্রাম বা ওয়ার্ড লিখুন");

    const savedProfile: UserProfile = {
      name,
      mobile,
      district,
      upazila,
      union,
      village,
      nearestRiver
    };

    onSave(savedProfile);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-6 relative overflow-hidden select-none">
      <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-5 -z-10" />

      {isEditing ? (
        /* Form Registration View */
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className="text-center pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-base md:text-lg flex items-center justify-center gap-2">
              <UserCheck className="w-5 h-5 text-blue-600 animate-pulse" />
              ব্যক্তিগত প্রোফাইল নিবন্ধন
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              সঠিক লোকেশন প্রদান করলে আপনার নিকটস্থ নদী ও আশ্রয়কেন্দ্রের লাইভ তথ্য সক্রিয় হবে।
            </p>
          </div>

          {/* Input Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <User className="w-4 h-4 text-slate-400" />
              আপনার নাম:
            </label>
            <input
              type="text"
              placeholder="যেমন: মোঃ শাহিন আলম"
              value={name}
              onChange={(e) => setName(e.target.value)}
              id="reg-name-input"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none transition-all"
              required
            />
          </div>

          {/* Mobile phone number */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-slate-400" />
              ১১ ডিজিটের মোবাইল নম্বর:
            </label>
            <input
              type="tel"
              placeholder="01XXXXXXXXX"
              maxLength={11}
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
              id="reg-mobile-input"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none transition-all"
              required
            />
          </div>

          {/* Region - District Selector (all flood-prone districts list) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Map className="w-4 h-4 text-slate-400" />
                জেলা নির্বাচন করুন:
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                id="reg-district-select"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              >
                {Object.keys(BANGLADESH_LOCATIONS).map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
            </div>

            {/* Dynamic Upazila Selector */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-slate-400" />
                উপজেলা নির্বাচন করুন:
              </label>
              <select
                value={upazila}
                onChange={(e) => setUpazila(e.target.value)}
                id="reg-upazila-select"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              >
                {upazilaList.map((upa) => (
                  <option key={upa} value={upa}>
                    {upa}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Union & Village inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                ইউনিয়ন:
              </label>
              <input
                type="text"
                placeholder="যেমন: সদর ইউনিয়ন"
                value={union}
                onChange={(e) => setUnion(e.target.value)}
                id="reg-union-input"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                গ্রাম / ওয়ার্ড / পাড়া:
              </label>
              <input
                type="text"
                placeholder="যেমন: গোবিন্দপুর গ্রাম"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                id="reg-village-input"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Nearest River */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-blue-500 animate-pulse" />
              নিকটবর্তী প্রধান জলাশয় / নদী / হাওর:
            </label>
            <select
              value={nearestRiver}
              onChange={(e) => setNearestRiver(e.target.value)}
              id="reg-river-select"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500/20 focus:outline-none text-blue-600"
            >
              {FLOOD_RIVERS.map((river) => (
                <option key={river.id} value={river.name}>
                  {river.name} ({river.riverBasin})
                </option>
              ))}
            </select>
          </div>

          {/* Submit registration details */}
          <button
            type="submit"
            id="reg-submit-btn"
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 font-bold text-white rounded-2xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transition-all cursor-pointer text-xs md:text-sm active:scale-[0.98]"
          >
            <span>নিবন্ধন সম্পন্ন করুন (সংরক্ষণ)</span>
          </button>
        </form>
      ) : (
        /* Registered profile overview status display */
        <div className="text-left space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                {profile?.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm md:text-base">{profile?.name}</h4>
                <p className="text-[10px] text-slate-400 font-bold tracking-wide">নিবন্ধিত FloodGuard ব্যবহারকারী</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              id="reg-edit-btn"
              className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all font-semibold flex items-center gap-1 text-[10px] cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>পরিবর্তন করুন</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-2xl space-y-1 border border-slate-100">
              <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider block">মোবাইল সংযোগ নম্বর</span>
              <span className="text-slate-800 font-bold font-mono">{profile?.mobile}</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl space-y-1 border border-slate-100">
              <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider block">নিকটবর্তী প্রধান নদী</span>
              <span className="text-blue-600 font-bold">{profile?.nearestRiver}</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl space-y-1 border border-slate-100 md:col-span-2">
              <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider block">পূর্ণাঙ্গ বাৎসরিক ঠিকানা</span>
              <span className="text-slate-800 font-semibold leading-relaxed">
                গ্রাম: {profile?.village}, ইউনিয়ন: {profile?.union}, উপজেলা: {profile?.upazila}, জেলা: {profile?.district}
              </span>
            </div>
          </div>

          <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex items-start gap-2 text-[10px] text-emerald-800">
            <ShieldAlert className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>
              আপনার ঠিকানা অনুযায়ী লাইভ রিভার ও শেল্টার অ্যালার্ট ট্র্যাকিং সফলভাবে সমন্বিত হয়েছে। বন্যা পর্যবেক্ষণ করতে হোম ড্যাশবোর্ডে স্লাইডারটি পরিবর্তন করুন।
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
