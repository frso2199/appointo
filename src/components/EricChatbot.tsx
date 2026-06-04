import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MessageCircle, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function EricChatbot() {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [pulseWave, setPulseWave] = useState(false);

  const ericPhrases = [
    "Hi there! I am Eric. I automatically handle client queues, allocate cabins, and chase WhatsApp confirmations!",
    "Namaste! Need to sync Google Calendars or collect Razorpay deposits for your clinic? I trigger that on autopilot.",
    "Did you know? Automated WhatsApp outreach cuts salon no-shows by up to 34% inside Tier 2 cities!",
    "Tap 'Simulate Slot' on the live dashboard on the right to test-drive my real-time notification engine!"
  ];

  const handleNextTip = () => {
    setPulseWave(true);
    setTimeout(() => setPulseWave(false), 600);
    setCurrentTipIndex((prev) => (prev + 1) % ericPhrases.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative flex flex-col sm:flex-row items-center gap-3 sm:gap-4 bg-slate-900/65 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-blue-500/25 shadow-2.5xl w-full max-w-full sm:max-w-xl mx-auto lg:mx-0 select-none overflow-hidden"
      id="hero-eric-chatbot-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Visual background glow decor */}
      <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-blue-500/10 blur-xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full bg-emerald-500/10 blur-xl pointer-events-none" />

      {/* Glossy Interactive SVG Chatbot Avatar - 'Eric' */}
      <div className="relative flex-shrink-0">
        <motion.div
          animate={{
            y: isHovered ? [0, -6, 0] : [0, -3, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: isHovered ? 1.8 : 3.5,
            ease: "easeInOut"
          }}
          className="relative cursor-pointer"
          onClick={handleNextTip}
          title="Tap Eric to change greetings"
        >
          {/* Animated pulsing wave circle behind Eric */}
          <AnimatePresence>
            {pulseWave && (
              <motion.span
                initial={{ scale: 0.8, opacity: 0.8 }}
                animate={{ scale: 1.5, opacity: 0 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 rounded-full bg-cyan-400/30"
              />
            )}
          </AnimatePresence>

          {/* SVG Robot Buddy */}
          <svg
            width="80"
            height="80"
            viewBox="0 0 100 100"
            className="drop-shadow-[0_8px_16px_rgba(59,130,246,0.35)]"
          >
            <defs>
              <linearGradient id="cyberHelmet" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#1e3a8a" />
              </linearGradient>
              <linearGradient id="cyberGlass" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>
              <linearGradient id="neonLight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3bf1f6" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>

            {/* Neck Join */}
            <rect x="42" y="68" width="16" height="10" rx="3" fill="#3b82f6" opacity="0.8" />

            {/* Chatbot Body Base */}
            <path d="M 30,78 L 70,78 C 76,78 82,82 82,90 L 18,90 C 18,82 24,78 30,78 Z" fill="url(#cyberHelmet)" />
            {/* Metallic body chest light */}
            <circle cx="50" cy="85" r="4.5" fill="#10b981" className="animate-pulse" />

            {/* Robot Head Dome */}
            <rect x="22" y="24" width="56" height="46" rx="20" fill="url(#cyberHelmet)" stroke="#3b82f6" strokeWidth="2.5" />

            {/* Glowing Soundwave Antenna with Pulsing Status Ball */}
            <line x1="50" y1="24" x2="50" y2="12" stroke="#3b82f6" strokeWidth="3" />
            <motion.circle
              cx="50"
              cy="9"
              r="6"
              fill={isHovered ? "#3bf1f6" : "#22c55e"}
              animate={{
                scale: isHovered ? [1, 1.25, 1] : [1, 1.1, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.2,
                ease: "easeInOut"
              }}
            />

            {/* Head Side Gears/Ears */}
            <circle cx="19" cy="47" r="5" fill="#1e40af" />
            <circle cx="81" cy="47" r="5" fill="#1e40af" />

            {/* Glossy Dynamic Visor Screen */}
            <rect x="29" y="34" width="42" height="24" rx="12" fill="url(#cyberGlass)" stroke="#1e293b" strokeWidth="1.5" />

            {/* Inside Glowing LED Eyes */}
            <g>
              {/* Left Eye */}
              <motion.ellipse
                cx="39"
                cy="46"
                rx={isHovered ? "5.5" : "4.5"}
                ry={isHovered ? "2.5" : "4.5"}
                fill="url(#neonLight)"
                animate={{
                  ry: [4.5, 0.5, 4.5],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  repeatDelay: 2
                }}
              />
              {/* Right Eye */}
              <motion.ellipse
                cx="61"
                cy="46"
                rx={isHovered ? "5.5" : "4.5"}
                ry={isHovered ? "2.5" : "4.5"}
                fill="url(#neonLight)"
                animate={{
                  ry: [4.5, 0.5, 4.5],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  repeatDelay: 2.2
                }}
              />
            </g>

            {/* Golden friendly mouth light */}
            <path
              d={isHovered ? "M 44,52 Q 50,57 56,52" : "M 46,53 Q 50,55 54,53"}
              fill="none"
              stroke="#3bf1f6"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

          {/* Floating 'ONLINE' Green Capsule badge under Eric */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-[#065F46] border border-emerald-450 px-1.5 py-0.5 rounded-full text-[8px] font-black text-emerald-300 tracking-widest uppercase shadow-md flex items-center gap-0.5 whitespace-nowrap">
            <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-ping shrink-0" />
            <span>ERIC</span>
          </div>
        </motion.div>
      </div>

      {/* Dialogue Content Container */}
      <div className="flex-1 text-left space-y-2 w-full max-w-full">
        {/* Dynamic Speech bubble content in AnimatePresence to feel incredibly reactive */}
        <div className="relative bg-slate-950/75 border border-slate-800 p-2.5 sm:p-3 rounded-xl w-full select-text">
          {/* Triangle pointing to Eric */}
          <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-0 h-0 border-t-[5px] border-t-transparent border-r-[6px] border-r-slate-800 border-b-[5px] border-b-transparent hidden sm:block" />

          <p className="text-[11.5px] font-medium leading-relaxed text-slate-200 font-mono break-words whitespace-normal">
            {ericPhrases[currentTipIndex]}
          </p>
        </div>

        {/* Mini action cues */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 text-[10px] text-slate-400 font-bold px-1">
          <span className="flex items-center gap-1 text-blue-400">
            <Sparkles className="h-3 w-3 shrink-0" />
            Scheduling Assistant
          </span>

          <button
            onClick={handleNextTip}
            className="flex items-center gap-1 text-slate-350 hover:text-white transition duration-150 py-0.5 px-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60"
            id="eric-next-phrase-btn"
          >
            <span>Next Tip</span>
            <RefreshCw className="h-2.5 w-2.5 animate-spin" style={{ animationDuration: '6s' }} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
