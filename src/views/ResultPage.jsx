import { motion } from 'framer-motion';
import bgImage from '../assets/Background.png';

export default function ResultPage({ winner, finalScore, onRestart }) {
  const isPlayerWinner = winner === 'PLAYER';

  return (
    <div className="fixed inset-0 w-full h-[100dvh] flex flex-col items-center justify-center overflow-hidden font-sans text-white">
      
      {/* 1. Background Section */}
      <div 
        className="absolute inset-0 z-[-1] bg-cover bg-center bg-no-repeat blur-sm scale-110"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute inset-0 z-[-1] bg-black/70" />

      {/* 2. Main Container: ปรับขนาดตามหน้าจอ (Mobile: w-[90%], PC: max-w-4xl) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-[92%] max-w-4xl bg-slate-900/60 backdrop-blur-2xl border border-white/10 p-6 md:p-16 rounded-[2.5rem] md:rounded-[4rem] shadow-2xl flex flex-col items-center gap-6 md:gap-10"
      >
        
        {/* หัวข้อ Winner: ปรับขนาด Font ให้เล็กลงบนมือถือ */}
        <div className="flex flex-col items-center text-center">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl md:text-8xl mb-2 md:mb-4"
          >
            {isPlayerWinner ? '🏆' : '💀'}
          </motion.div>
          
          <h1 className={`text-4xl md:text-7xl font-black italic uppercase tracking-tight leading-none ${isPlayerWinner ? 'text-yellow-400' : 'text-red-500'}`}>
            {isPlayerWinner ? 'Victory Achieved' : 'Mission Failed'}
          </h1>
          
          <p className="text-slate-400 font-bold tracking-[0.2em] md:tracking-[0.5em] mt-2 uppercase text-[10px] md:text-sm">
            Combat Sequence Terminated
          </p>
        </div>

        {/* ตารางคะแนน: เปลี่ยนจาก flex-row เป็น flex-col บนมือถือ (ถ้าจอแคบมาก) หรือลดขนาดลง */}
        <div className="flex flex-row items-center justify-center gap-6 md:gap-16 bg-black/40 px-8 py-6 md:px-16 md:py-8 rounded-3xl border border-white/5 shadow-inner w-full">
          <div className="flex flex-col items-center">
            <span className="text-[10px] md:text-xs font-black text-cyan-500 tracking-widest uppercase mb-1 md:mb-2 text-center leading-none">
              Pilot<br className="md:hidden"/> Score
            </span>
            <span className="text-4xl md:text-7xl font-black italic text-white leading-none">
              {finalScore.player}
            </span>
          </div>

          <div className="text-2xl md:text-4xl font-light text-white/20 italic self-end pb-1 md:pb-3">:</div>

          <div className="flex flex-col items-center">
            <span className="text-[10px] md:text-xs font-black text-red-500 tracking-widest uppercase mb-1 md:mb-2 text-center leading-none">
              Bot<br className="md:hidden"/> Score
            </span>
            <span className="text-4xl md:text-7xl font-black italic text-white leading-none">
              {finalScore.bot}
            </span>
          </div>
        </div>

        {/* ปุ่ม Back to Home: ปรับความกว้างให้เต็มในมือถือเพื่อให้กดง่าย */}
        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: '#ffffff', color: '#000000' }}
          whileTap={{ scale: 0.98 }}
          onClick={onRestart}
          className="w-full md:w-auto px-12 md:px-24 py-4 md:py-5 bg-white/10 border border-white/20 rounded-full font-black text-sm md:text-xl uppercase italic tracking-widest transition-all shadow-lg"
        >
          Return
        </motion.button>

      </motion.div>
    </div>
  );
}