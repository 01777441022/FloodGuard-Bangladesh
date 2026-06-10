import { motion } from "motion/react";
import { Droplet, ArrowUp, AlertTriangle, CloudRain, ShieldCheck } from "lucide-react";
import { RiskLevel } from "../types";

interface WaterGaugeProps {
  level: number;
  riskLevel: RiskLevel;
  riskText: string;
  riskColor: string;
  riverName: string;
}

export default function WaterGauge({
  level,
  riskLevel,
  riskText,
  riskColor,
  riverName,
}: WaterGaugeProps) {
  // Translate 0-15 scale to percentage (0% to 100%)
  const percentage = Math.min(100, Math.max(0, (level / 15) * 100));

  // Determine current color code
  const getColorHex = () => {
    switch (riskLevel) {
      case RiskLevel.SAFE:
        return "#10b981"; // 🟢 Emerald
      case RiskLevel.WARNING:
        return "#eab308"; // 🟡 Yellow
      case RiskLevel.PREPARATION:
        return "#f97316"; // 🟠 Orange
      case RiskLevel.EMERGENCY:
        return "#ef4444"; // 🔴 Red
      case RiskLevel.CATASTROPHIC:
        return "#a855f7"; // 🟣 Purple
      default:
        return "#10b981";
    }
  };

  // SVG parameters
  const size = 200;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white/70 backdrop-blur-md rounded-3xl border border-slate-100 shadow-xl relative overflow-hidden transition-all duration-300">
      {/* Decorative subtle background grid/pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-40 -z-10" />

      {/* River Name Badge */}
      <div className="px-4 py-1.5 rounded-full bg-slate-100/80 border border-slate-200/50 backdrop-blur text-slate-700 font-medium text-xs mb-4 flex items-center gap-1.5">
        <Droplet className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
        <span>বাছাইকৃত উৎস: <strong className="text-blue-600">{riverName}</strong></span>
      </div>

      {/* Circular Gauge and Waves Container */}
      <div className="relative flex items-center justify-center w-[220px] h-[220px]" id="circular-gauge-container">
        {/* SVG Circular Track and Indicator */}
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Base track circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
          />
          {/* Dynamic level stroke indicator */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={getColorHex()}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            animate={{ strokeDashoffset }}
            transition={{ type: "spring", stiffness: 40, damping: 12 }}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Wave and Numeric Indicator */}
        <div className="absolute w-[160px] h-[160px] rounded-full overflow-hidden bg-slate-50 border-4 border-white shadow-inner flex flex-col items-center justify-center z-10">
          {/* Water level wave representation inside the circle */}
          <div
            className="absolute bottom-0 left-0 right-0 w-[200%] h-[200%] -translate-x-[25%] transition-all duration-1000 ease-out -z-10"
            style={{
              transform: `translateY(${110 - percentage}%) translateX(-25%)`,
            }}
          >
            {/* Double wave overlay to look hyper-realistic */}
            <div
              className="absolute w-full h-full bottom-0 left-0 opacity-40 animate-wave-slow"
              style={{
                backgroundImage: `radial-gradient(circle, ${getColorHex()} 0%, transparent 80%)`,
                backgroundColor: getColorHex(),
                borderRadius: "38%",
              }}
            />
            <div
              className="absolute w-full h-full bottom-0 left-0 opacity-25 animate-wave-fast"
              style={{
                backgroundColor: getColorHex(),
                borderRadius: "35%",
              }}
            />
          </div>

          {/* Value Display Overlay */}
          <div className="text-center z-20 flex flex-col items-center px-2 cursor-default select-none">
            {/* Current Level in Bangla */}
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500/90 mb-0.5">
              পানি স্তর (Water Level)
            </span>
            <div className="flex items-baseline gap-0.5 text-slate-900 font-bold">
              <motion.span
                className="text-4xl md:text-5xl font-mono block"
                key={level}
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {level.toFixed(1)}
              </motion.span>
              <span className="text-sm font-medium text-slate-600">মিটার</span>
            </div>

            {/* Dynamic Status Badges inside the circle */}
            <div
              className="mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-sm transition-colors duration-300"
              style={{
                backgroundColor: `${getColorHex()}22`,
                color: getColorHex(),
                borderColor: `${getColorHex()}44`,
                borderWidth: "1px",
              }}
            >
              {riskText}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Meter Scale Dots */}
      <div className="w-full mt-5 flex justify-between px-2 text-[10px] font-mono text-slate-400 font-medium">
        <span className="flex flex-col items-center"><span>০.০</span><span className="h-1.5 w-0.5 bg-slate-200 mt-1"></span></span>
        <span className="flex flex-col items-center text-emerald-500"><span>৫.০</span><span className="h-1.5 w-0.5 bg-emerald-300 mt-1"></span></span>
        <span className="flex flex-col items-center text-yellow-500"><span>৭.০</span><span className="h-1.5 w-0.5 bg-yellow-300 mt-1"></span></span>
        <span className="flex flex-col items-center text-orange-500"><span>৯.০</span><span className="h-1.5 w-0.5 bg-orange-300 mt-1"></span></span>
        <span className="flex flex-col items-center text-red-500"><span>১১.০</span><span className="h-1.5 w-0.5 bg-red-300 mt-1"></span></span>
        <span className="flex flex-col items-center text-purple-600"><span>১৫.০</span><span className="h-1.5 w-0.5 bg-purple-300 mt-1"></span></span>
      </div>

      {/* Danger Trend Badge */}
      <div className="w-full mt-4 p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          {riskLevel === RiskLevel.SAFE && (
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
          )}
          {[RiskLevel.WARNING, RiskLevel.PREPARATION].includes(riskLevel) && (
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          )}
          {[RiskLevel.EMERGENCY, RiskLevel.CATASTROPHIC].includes(riskLevel) && (
            <CloudRain className="w-5 h-5 text-red-500 animate-bounce" />
          )}
          <div className="text-left">
            <p className="font-semibold text-slate-800">বন্যা ঝুঁকি স্তর</p>
            <p className="text-[10px] text-slate-500">পানি প্রবাহের হার ও উচ্চতা অনুযায়ী</p>
          </div>
        </div>
        <div className="flex items-center gap-1 font-semibold text-slate-700 bg-white px-2 py-1 rounded-lg border border-slate-200/65">
          <ArrowUp
            className={`w-3.5 h-3.5 text-blue-500 transition-transform duration-500 ${
              level > 7 ? "animate-bounce" : ""
            }`}
          />
          <span>{level > 7 ? "সিমুলেশন চলছে" : "স্থিতিশীল"}</span>
        </div>
      </div>
    </div>
  );
}
