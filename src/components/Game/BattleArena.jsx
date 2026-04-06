import { useState, useEffect } from 'react';
import { checkRoundWinner, generateDeck } from '../../utils/gameLogic';
import Card from './Card';
import { motion, AnimatePresence } from 'framer-motion';

// Import ภาพพื้นหลัง (เช็ค Path ให้ถูกต้องตามโครงสร้างโฟลเดอร์ของมึง)
import bgImage from '../../assets/Background.png';

export default function BattleArena({ playerDeck, onFinishGame }) {
  const [botDeck, setBotDeck] = useState([]);
  const [pIdx, setPIdx] = useState(0); 
  const [bIdx, setBIdx] = useState(0); 
  const [statusText, setStatusText] = useState("PREPARING...");
  const [isFighting, setIsFighting] = useState(false);

  useEffect(() => {
    setBotDeck(generateDeck());
    setTimeout(() => { setIsFighting(true); setStatusText("BATTLE START"); }, 2000);
  }, []);

  useEffect(() => {
    if (!isFighting) return;
    const roundTimer = setTimeout(() => {
      if (pIdx >= playerDeck.length || bIdx >= botDeck.length) {
        const winner = pIdx >= playerDeck.length ? "BOT" : "PLAYER";
        setStatusText(`TERMINATED: ${winner} WINS`);
        setTimeout(() => onFinishGame(winner), 2500);
        return;
      }
      const result = checkRoundWinner(playerDeck[pIdx], botDeck[bIdx]);
      if (result === 'PLAYER') { setStatusText("TARGET ELIMINATED"); setBIdx(prev => prev + 1); }
      else if (result === 'BOT') { setStatusText("CRITICAL DAMAGE"); setPIdx(prev => prev + 1); }
      else { setStatusText("CLASH: DRAW"); setPIdx(prev => prev + 1); setBIdx(prev => prev + 1); }
    }, 1500);
    return () => clearTimeout(roundTimer);
  }, [isFighting, pIdx, bIdx]);

  return (
    // เปลี่ยน Container หลักเป็นแบบ relative และลบ bg-[#020617] ออก
    <div className="w-screen h-screen flex flex-col items-center justify-center p-10 overflow-hidden relative z-0">
      
      {/* --- ส่วนพื้นหลังใหม่ --- */}
      {/* ใช้ Div แยกออกมาทำ BG โดยเฉพาะ ใส่ภาพ, จัดกลาง, และทำให้เบลอ (blur-sm หรือ blur-xs ตามชอบ) */}
      <div 
        className="absolute inset-0 z-[-1] bg-cover bg-center bg-no-repeat blur-sm scale-110"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      {/* ใส่ Overlay สีดำจางๆ ทับ BG อีกชั้นเพื่อให้คอนเทนต์ด้านบนเด่นขึ้น (ปรับ opacity ตามชอบ) */}
      <div className="absolute inset-0 z-[-1] bg-black/60" />
      {/* ------------------------- */}
      
      {/* STATUS CENTER BAR */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 w-full">
         {/* ปรับพื้นหลังสถานะตรงกลางให้โปร่งแสงและเบลอเล็กน้อย (backdrop-blur-sm) เพื่อให้เห็น BG ด้านล่างจางๆ */}
         <div className="h-[200px] bg-cyan-950/20 backdrop-blur-sm border-y border-cyan-500/10 flex items-center justify-center">
            <h2 className="text-6xl font-black italic text-white/10 uppercase tracking-[1em] select-none">Engaging</h2>
         </div>
      </div>

      {/* BATTLE FIELD (ซ้าย-ขวา) */}
      <div className="w-full max-w-7xl flex flex-row items-center justify-between z-10 gap-20 relative">
        
        {/* PLAYER SIDE (LEFT) */}
        <div className="flex flex-col items-center gap-6">
          <div className="text-cyan-400 font-black italic tracking-widest bg-cyan-950/50 px-4 py-1 rounded border-l-4 border-cyan-500 uppercase text-sm backdrop-blur-sm">Pilot: Player</div>
          {/* เพิ่มเงาเรืองแสงรอบการ์ดเพื่อให้เด่นขึ้นจากพื้นหลังใหม่ */}
          <motion.div key={`p-${pIdx}`} initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="shadow-[0_0_60px_rgba(8,145,178,0.5)] rounded-3xl">
             <Card type={playerDeck[pIdx]?.id} isFlipped={false} />
          </motion.div>
          <div className="w-48 h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
             <motion.div animate={{ width: `${((10 - pIdx) / 10) * 100}%` }} className="h-full bg-cyan-500 shadow-[0_0_15px_#06b6d4]" />
          </div>
        </div>

        {/* CENTER STATUS */}
        <div className="flex flex-col items-center justify-center w-72 backdrop-blur-sm bg-black/30 p-4 rounded-xl border border-white/5">
           <div className="text-4xl font-black text-white italic uppercase tracking-tighter text-center mb-2 leading-none">{statusText}</div>
           <div className="text-yellow-500 font-mono text-sm">ROUND {pIdx + bIdx + 1}</div>
        </div>

        {/* BOT SIDE (RIGHT) */}
        <div className="flex flex-col items-center gap-6">
          <div className="text-red-400 font-black italic tracking-widest bg-red-950/50 px-4 py-1 rounded border-r-4 border-red-500 uppercase text-sm backdrop-blur-sm">System: AI_BOT</div>
          {/* เพิ่มเงาเรืองแสงรอบการ์ด bot */}
          <motion.div key={`b-${bIdx}`} initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="shadow-[0_0_60px_rgba(239,68,68,0.4)] rounded-3xl">
             <Card type={botDeck[bIdx]?.id} isFlipped={false} />
          </motion.div>
          <div className="w-48 h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
             <motion.div animate={{ width: `${((10 - bIdx) / 10) * 100}%` }} className="h-full bg-red-600 shadow-[0_0_15px_#ef4444]" />
          </div>
        </div>

      </div>

      {/* FOOTER INFO */}
      <div className="absolute bottom-10 w-full flex justify-around opacity-40 text-[10px] font-mono text-cyan-400 z-10">
         <div>DECK_P_REMAINING: {10 - pIdx}</div>
         <div>BATTLE_SEQUENCE_ACTIVE</div>
         <div>DECK_B_REMAINING: {10 - bIdx}</div>
      </div>
    </div>
  );
}