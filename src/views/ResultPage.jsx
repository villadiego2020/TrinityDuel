import { motion } from 'framer-motion';
import bgImage from '../assets/Background.png';

export default function ResultPage({ winner, finalScore, onRestart }) {
  const isPlayerWinner = winner === 'PLAYER';

  return (
    <div className="fixed inset-0 w-full h-full flex flex-col items-center justify-center overflow-hidden font-sans text-white z-0">
      
      {/* 1. Background Section (เหมือนหน้า Battle) */}
      <div 
        className="absolute inset-0 z-[-1] bg-cover bg-center bg-no-repeat blur-sm scale-110"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute inset-0 z-[-1] bg-black/60" />

      {/* 2. Main Content (แนวนอนเต็มตา) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-5xl bg-slate-900/40 backdrop-blur-xl border border-white/10 p-12 rounded-[4rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col items-center gap-10"
      >
        
        {/* หัวข้อ Winner */}
        <div className="flex flex-col items-center text-center">
            <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-8xl mb-4"
            >
                {isPlayerWinner ? '🏆' : '💀'}
            </motion.div>
            <h1 className={`text-7xl font-black italic uppercase tracking-tighter shadow-sm ${isPlayerWinner ? 'text-yellow-400' : 'text-red-500'}`}>
                {isPlayerWinner ? 'Victory Achieved' : 'Mission Failed'}
            </h1>
            <p className="text-slate-400 font-bold tracking-[0.5em] mt-2 uppercase text-sm">Combat Sequence Terminated</p>
        </div>

        {/* ตารางคะแนนแบบแนวนอน */}
        <div className="flex flex-row items-center gap-16 bg-black/40 px-16 py-8 rounded-3xl border border-white/5 shadow-inner">
            <div className="flex flex-col items-center">
                <span className="text-xs font-black text-cyan-500 tracking-widest uppercase mb-2">Pilot Score</span>
                <span className="text-7xl font-black italic text-white">{finalScore.player}</span>
            </div>

            <div className="text-4xl font-light text-white/20 italic">:</div>

            <div className="flex flex-col items-center">
                <span className="text-xs font-black text-red-500 tracking-widest uppercase mb-2">Bot Score</span>
                <span className="text-7xl font-black italic text-white">{finalScore.bot}</span>
            </div>
        </div>

        {/* ปุ่ม Back to Home */}
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: '#ffffff', color: '#000000' }}
          whileTap={{ scale: 0.95 }}
          onClick={onRestart}
          className="px-24 py-5 bg-white/10 border border-white/20 rounded-full font-black text-xl uppercase italic tracking-widest transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]"
        >
          Return to HQ
        </motion.button>

      </motion.div>

      {/* ตกแต่งมุมจอจางๆ */}
      <div className="absolute bottom-10 left-10 opacity-20 text-[10px] font-mono leading-relaxed">
        LOG_STATUS: CLOSED<br/>
        ENCRYPTION: DISABLED
      </div>
      <div className="absolute bottom-10 right-10 opacity-20 text-[10px] font-mono text-right">
        TRINITY SYSTEM v4.2<br/>
        © 2026 NEURAL DUEL
      </div>

    </div>
  );
}