import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import * as Icons from "lucide-react";
import { EducationTopic } from "../types";

interface EducationCardProps {
  topic: EducationTopic;
  key?: number;
}

export default function EducationCard({ topic }: EducationCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);

  // Dynamic Icon Selection
  const getIcon = (name: string) => {
    const IconComp = (Icons as Record<string, any>)[name];
    if (IconComp) {
      return <IconComp className="w-5 h-5" />;
    }
    return <Icons.BookOpen className="w-5 h-5" />;
  };

  // Simulated Video Player Animation loop
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setVideoProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0; // Reset
          }
          return prev + 1.5;
        });
      }, 100);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handlePlayToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(!isPlaying);
  };

  const handleProgressReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setVideoProgress(0);
    setIsPlaying(false);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden select-none transition-all duration-300">
      {/* Header Panel */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-all text-left"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600">
            {getIcon(topic.iconName)}
          </div>
          <div>
            <h4 className="text-xs md:text-sm font-bold text-slate-800 leading-snug">
              {topic.title}
            </h4>
            <p className="text-[10px] text-slate-400 font-semibold tracking-wide">
              ৩-ধাপ নির্দেশিকা ও ভিডিও সিমুলেশন
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-slate-100 text-[10px] font-bold text-slate-500 uppercase">
            গাইড {topic.id}
          </span>
          {isOpen ? (
            <Icons.ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <Icons.ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </div>

      {/* Accordion Expansion Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="border-t border-slate-100 bg-slate-50/50"
          >
            <div className="p-4 space-y-4 text-left">
              
              {/* Part 1: BEFORE ACTIONS */}
              <div className="space-y-2 bg-amber-50/30 p-3.5 rounded-2xl border border-amber-500/10">
                <div className="flex items-center gap-2 text-amber-700 font-bold text-xs">
                  <Icons.CalendarClock className="w-4 h-4" />
                  <span>১. বন্যা পূর্ব প্রস্তুতি (আগে কী করবেন)</span>
                </div>
                <ul className="space-y-1.5 pl-5 list-disc text-slate-700 text-xs leading-relaxed font-medium">
                  {topic.before.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Part 2: VIDEO STYLE SIMULATED ANIMATION */}
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-3 relative overflow-hidden flex flex-col justify-between">
                {/* Simulated Lens flare and camera status overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 text-[8px] font-mono text-emerald-400 z-10 bg-black/40 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                  <span>লাইভ ভিডিও অ্যানিমেশন ফ্রেম</span>
                </div>
                <div className="absolute top-2.5 right-2.5 text-[8px] font-mono text-slate-400 z-10 bg-black/40 px-2 py-0.5 rounded-full">
                  FPS: 60 • Lottie Simulation
                </div>

                {/* Animated graphic scene depending on state */}
                <div className="h-32 mb-2 rounded-xl flex flex-col items-center justify-center bg-slate-950 border border-slate-800/80 relative overflow-hidden">
                  
                  {/* Glowing Animated Orbs representing wave particles */}
                  {isPlaying ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1], rotate: [0, 180, 360] }}
                        transition={{ repeat: Infinity, duration: 4 }}
                        className="p-3 bg-blue-500/20 rounded-full border border-blue-400/40"
                      >
                        {getIcon(topic.iconName)}
                      </motion.div>
                      <span className="text-[10px] font-bold text-slate-300 animate-pulse text-center px-4 leading-normal">
                        {topic.title} প্রক্রিয়া সচল অবস্থায় সিমুলেশন চলছে...
                      </span>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-slate-950 to-slate-900 pointer-events-auto">
                      <button
                        onClick={handlePlayToggle}
                        className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-500 cursor-pointer shadow-lg active:scale-95 transition-all"
                        id={`video-play-btn-${topic.id}`}
                      >
                        <Icons.Play className="w-5 h-5 ml-0.5" />
                      </button>
                      <span className="text-[10px] font-bold text-slate-400 mt-1 cursor-default">
                        ভিডিও টিউটোরিয়াল ও অ্যানিমেশন প্লে করুন
                      </span>
                    </div>
                  )}

                  {/* Water rising dynamic simulator wave inside the mock player */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-1/2 bg-blue-600/10 border-t border-blue-500/20 -z-5 transition-all duration-300"
                    style={{ transform: isPlaying ? "translateY(0%)" : "translateY(100%)" }}
                  />
                </div>

                {/* Controls and duration line */}
                <div className="z-10 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-[10px] text-slate-300">
                    <span className="font-bold text-slate-100 flex items-center gap-1">
                      <Icons.Video className="w-3.5 h-3.5 text-blue-400" />
                      ২. বিস্তারিত ব্যাখ্যা (ভিজুয়াল এনিমেশন)
                    </span>
                    <span className="font-mono text-slate-400">
                      {Math.floor(videoProgress / 10)}s / 10s
                    </span>
                  </div>

                  {/* Text Description */}
                  <p className="text-[11px] text-slate-300 leading-relaxed font-light text-left border-l-2 border-blue-500 pl-2 py-0.5 bg-slate-900/40 rounded-r-lg">
                    {topic.explanation}
                  </p>

                  {/* Progress Seekbar */}
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden relative">
                    <motion.div
                      className="absolute top-0 bottom-0 left-0 bg-blue-500 rounded-full"
                      style={{ width: `${videoProgress}%` }}
                    />
                  </div>

                  {/* Control triggers */}
                  <div className="flex justify-between items-center mt-1">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handlePlayToggle}
                        className="p-1 px-2.5 bg-slate-800 text-white font-semibold rounded-lg text-[10px] hover:bg-slate-700 transition-all cursor-pointer inline-flex items-center gap-1"
                        id={`video-pause-btn-${topic.id}`}
                      >
                        {isPlaying ? (
                          <>
                            <Icons.Pause className="w-3 h-3 text-amber-400" />
                            <span>থামুন</span>
                          </>
                        ) : (
                          <>
                            <Icons.Play className="w-3 h-3 text-emerald-400" />
                            <span>চালু করুন</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleProgressReset}
                        className="p-1 px-2.5 bg-slate-800 text-slate-400 font-semibold rounded-lg text-[10px] hover:bg-slate-700 hover:text-white transition-all cursor-pointer inline-flex items-center gap-1"
                        id={`video-reset-btn-${topic.id}`}
                      >
                        <Icons.RotateCcw className="w-3 h-3" />
                        <span>পুনরায় দেখুন</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1 text-[9px] font-mono font-medium text-blue-400">
                      <Icons.Sparkles className="w-3 h-3" />
                      <span>{isPlaying ? "সক্রিয়" : "অপেক্ষা করছে"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Part 3: AFTER ACTIONS */}
              <div className="space-y-2 bg-emerald-50/30 p-3.5 rounded-2xl border border-emerald-500/10">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs">
                  <Icons.CheckSquare className="w-4 h-4" />
                  <span>৩. বন্যা পরবর্তী করণীয় (পরে কী করবেন)</span>
                </div>
                <ul className="space-y-1.5 pl-5 list-disc text-slate-700 text-xs leading-relaxed font-medium">
                  {topic.after.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
