import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Volume2, VolumeX, AlertOctagon, Terminal, BellRing, Info, Sparkles } from "lucide-react";
import { RiskLevel } from "../types";

interface NotificationAlertProps {
  level: number;
  riskLevel: RiskLevel;
}

export default function NotificationAlert({ level, riskLevel }: NotificationAlertProps) {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [activeMessage, setActiveMessage] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  
  // Keep track of the last played level to prevent repetitive chime looping
  const lastPlayedLevelRef = useRef<number>(-1);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Determine current warning message and alert conditions
  useEffect(() => {
    let msg: string | null = null;
    if (level >= 12) {
      msg = "🔴 মহাবিপদ! অনতিবিলম্বে সকল কাজ বন্ধ করে নিকটস্থ সরকারি আশ্রয়কেন্দ্রে চলে যান।";
    } else if (level >= 10) {
      msg = "🟠 জরুরি পরিস্থিতি! আপনার মূল্যবান গবাদি পশু, হাঁস-মুরগি ও দলিলপত্রাদি নিরাপদ স্থানে সরান।";
    } else if (level >= 8) {
      msg = "🟡 সতর্কতা! ঘরের মেঝেতে পানি উঠতে পারে। শুকনো খাবার, ওষুধ ও টর্চ লাইট সহ জরুরি ফোল্ডার প্রস্তুত রাখুন।";
    } else if (level >= 6) {
      msg = "🟢 পানি বাড়ছে! নদীর অববাহিকায় পানি বিপদসীমা স্পর্শ করতে চলেছে, সতর্ক ও সজাগ থাকুন।";
    }

    if (msg) {
      setActiveMessage(msg);
      // Only show popup alert when level changes across warning steps
      const roundedLevel = Math.floor(level);
      if (roundedLevel !== lastPlayedLevelRef.current) {
        setShowPopup(true);
        triggerWarningSound(roundedLevel);
        lastPlayedLevelRef.current = roundedLevel;
      }
    } else {
      setActiveMessage(null);
      setShowPopup(false);
    }
  }, [level]);

  // Audio warning sound generator using Web Audio API
  const triggerWarningSound = (currentLevel: number) => {
    if (!soundEnabled) return;

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      // Safe clean audio nodes creation
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      const now = ctx.currentTime;

      // Define synthesizer sound types depending on risk category:
      if (currentLevel >= 12) {
        // Severe siren buzzer
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(380, now);
        osc.frequency.linearRampToValueAtTime(780, now + 0.35);
        osc.frequency.linearRampToValueAtTime(380, now + 0.7);
        osc.frequency.linearRampToValueAtTime(780, now + 1.05);

        gainNode.gain.setValueAtTime(0.2, now);
        gainNode.gain.linearRampToValueAtTime(0.01, now + 1.2);

        osc.start(now);
        osc.stop(now + 1.2);
      } else if (currentLevel >= 10) {
        // Expressive double emergency alert sweep
        osc.type = "triangle";
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.setValueAtTime(660, now + 0.2);
        osc.frequency.setValueAtTime(520, now + 0.4);
        osc.frequency.setValueAtTime(660, now + 0.6);

        gainNode.gain.setValueAtTime(0.15, now);
        gainNode.gain.linearRampToValueAtTime(0.01, now + 0.85);

        osc.start(now);
        osc.stop(now + 0.85);
      } else if (currentLevel >= 8) {
        // High-pitch notice chime
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.4);

        gainNode.gain.setValueAtTime(0.12, now);
        gainNode.gain.linearRampToValueAtTime(0.01, now + 0.45);

        osc.start(now);
        osc.stop(now + 0.45);
      } else if (currentLevel >= 6) {
        // Standard double click alert
        osc.type = "sine";
        osc.frequency.setValueAtTime(580, now);
        gainNode.gain.setValueAtTime(0.08, now);
        gainNode.gain.linearRampToValueAtTime(0.01, now + 0.15);

        osc.start(now);
        osc.stop(now + 0.16);
      }
    } catch (error) {
      console.warn("Web Audio API warning sounds could not play directly due to active browser gesture controls", error);
    }
  };

  const toggleSound = () => {
    // Initialise audio on explicit user interaction
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume();
      }
    } catch (e) {}
    setSoundEnabled(!soundEnabled);
  };

  return (
    <div className="w-full select-none z-40">
      {/* Sound Settings Control Banner */}
      <div className="flex items-center justify-between p-3.5 mb-4 bg-slate-50 border border-slate-100 rounded-2xl">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 animate-pulse">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-slate-800">অডিও লাইভ সতর্কতা অ্যালার্ট</p>
            <p className="text-[10px] text-slate-500">বন্যা বিপদসীমা বাড়লে সাইরেন আওয়াজ বাজবে</p>
          </div>
        </div>
        <button
          onClick={toggleSound}
          id="sound-toggle-button"
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
            soundEnabled
              ? "bg-rose-500 text-white shadow-md shadow-rose-200"
              : "bg-slate-200 text-slate-700 hover:bg-slate-300"
          }`}
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-3.5 h-3.5 animate-bounce" />
              <span>শব্দ সক্ষম</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5" />
              <span>শব্দ নিষ্ক্রিয়</span>
            </>
          )}
        </button>
      </div>

      {/* Real-time Dynamic Flooding Overlay */}
      {riskLevel === RiskLevel.CATASTROPHIC && (
        <div className="fixed inset-0 pointer-events-none border-8 border-red-600/40 z-50 animate-pulse bg-red-600/[0.03]">
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg flex items-center gap-1.5 animate-bounce mt-3 pointer-events-auto">
            <AlertOctagon className="w-4 h-4" />
            <span>জরুরি রেড এ্যালার্ট সক্রিয়! লাল সংকেত</span>
          </div>
        </div>
      )}

      {/* Floating alert popup notification with sound announcement */}
      <AnimatePresence>
        {showPopup && activeMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`p-4 mb-4 rounded-2xl border flex items-start gap-3 shadow-xl transition-all relative ${
              level >= 12
                ? "bg-purple-50 border-purple-200 text-purple-950"
                : level >= 10
                ? "bg-red-50 border-red-200 text-red-950"
                : level >= 8
                ? "bg-orange-50 border-orange-200 text-orange-950"
                : "bg-amber-50 border-amber-200 text-amber-950"
            }`}
          >
            {/* Pulsing Alert Icon */}
            <div className="mt-0.5">
              <BellRing className={`w-5 h-5 flex-shrink-0 animate-bounce ${
                level >= 12 ? "text-purple-600" : level >= 10 ? "text-red-500" : "text-amber-500"
              }`} />
            </div>

            <div className="flex-1 text-left">
              <span className="text-[10px] font-bold tracking-widest uppercase opacity-75 block mb-0.5">
                বন্যা গার্ড সক্রিয় নোটিফিকেশন
              </span>
              <p className="text-xs font-semibold leading-relaxed">{activeMessage}</p>
            </div>

            <button
              onClick={() => setShowPopup(false)}
              className="text-xs font-bold hover:bg-slate-200 px-2 py-0.5 rounded cursor-pointer self-start"
            >
              বন্ধ করুন
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
