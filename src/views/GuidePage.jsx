import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import bgImage from "../assets/Background.png";

export default function GuidePage({ onBack }) {
  const steps = [
    {
      title: "01. DEPLOYMENT PHASE",
      desc: "Select 10 units from your hand to arrange your battle formation. Order matters—units will engage from 1st to 10th."
    },
    {
      title: "02. TRI-LINK COMBAT RULES",
      desc: "Victory is decided by the Tri-Link System: ROCK crushes SCISSORS, SCISSORS cuts PAPER, and PAPER wraps ROCK."
    },
    {
      title: "03. BATTLE SEQUENCE",
      desc: "Units clash 1-on-1. Winners stay to fight the next enemy, while losers are neutralized. A Draw destroys both units."
    },
    {
      title: "04. MATCH VICTORY (BO3)",
      desc: "Duel in a Best of 3 series. Adapt your strategy between rounds to counter the AI and secure ultimate victory."
    }
  ];

  return (
    <div className="fixed inset-0 w-screen h-screen flex flex-col items-center justify-center p-6 md:p-10 overflow-hidden font-sans text-white z-0">
      
      {/* Background Section */}
      <div 
        className="absolute inset-0 z-[-1] bg-cover bg-center bg-no-repeat blur-md scale-110"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute inset-0 z-[-1] bg-black/80" />

      {/* Back Button */}
      <motion.button
        whileHover={{ x: -5 }}
        onClick={onBack}
        className="absolute top-8 left-8 md:top-12 md:left-12 flex items-center gap-2 text-cyan-400 font-black italic uppercase tracking-widest z-50 bg-black/40 px-4 py-2 rounded-full border border-cyan-500/30 backdrop-blur-md"
      >
        <ChevronLeft size={24} />
        Back to Menu
      </motion.button>

      {/* Header Container */}
      <div className="w-full max-w-5xl mb-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-none">GUIDE</h1>
          <div className="flex items-center gap-4 mt-2">
            <div className="h-[2px] w-24 bg-cyan-500" />
            <p className="text-cyan-500 font-mono text-xs md:text-sm tracking-[0.4em] uppercase">Tactical_Instructions_v1.0</p>
          </div>
        </motion.div>
      </div>

      {/* Content Grid */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 relative z-10 overflow-y-auto no-scrollbar max-h-[60vh] md:max-h-none pr-2">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group bg-white/5 border-l-4 border-cyan-500 p-6 backdrop-blur-sm hover:bg-white/10 transition-all shadow-xl"
          >
            <h3 className="text-cyan-400 font-black italic text-xl md:text-2xl mb-2 tracking-tight">
              {step.title}
            </h3>
            <p className="text-slate-300 text-sm md:text-lg leading-relaxed font-medium">
              {step.desc}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-8 w-full flex justify-center opacity-30 z-10">
        <p className="text-[10px] font-mono tracking-[1em] uppercase">End of Operation Manual</p>
      </div>

    </div>
  );
}