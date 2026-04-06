import { useState, useEffect } from 'react';
import { checkRoundWinner, generateDeck } from '../../utils/gameLogic';
import Card from './Card';
import { motion, AnimatePresence } from 'framer-motion';

export default function BattleArena({ playerDeck, onFinishGame }) {
  const [botDeck, setBotDeck] = useState([]);
  const [pIdx, setPIdx] = useState(0); 
  const [bIdx, setBIdx] = useState(0); 
  const [statusText, setStatusText] = useState("Wait for Opponent...");
  const [isFighting, setIsFighting] = useState(false);

  useEffect(() => {
    setBotDeck(generateDeck());
    const timer = setTimeout(() => {
        setIsFighting(true);
        setStatusText("DUEL START!");
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isFighting) return;

    const roundTimer = setTimeout(() => {
      if (pIdx >= playerDeck.length || bIdx >= botDeck.length) {
        const winner = pIdx >= playerDeck.length ? "BOT" : "PLAYER";
        setStatusText(`MATCH ENDED: ${winner} WINS!`);
        setTimeout(() => onFinishGame(winner), 2500);
        return;
      }

      const pCard = playerDeck[pIdx];
      const bCard = botDeck[bIdx];
      const result = checkRoundWinner(pCard, bCard);

      if (result === 'PLAYER') {
        setStatusText("POINT FOR YOU!");
        setBIdx(prev => prev + 1); 
      } else if (result === 'BOT') {
        setStatusText("BOT GETS POINT!");
        setPIdx(prev => prev + 1); 
      } else {
        setStatusText("CLASH! DRAW!");
        setPIdx(prev => prev + 1); 
        setBIdx(prev => prev + 1);
      }
    }, 2000); // เพิ่มเวลาเป็น 2 วิ เพื่อให้โชว์รูปภาพชัดๆ ก่อนเปลี่ยนใบ

    return () => clearTimeout(roundTimer);
  }, [isFighting, pIdx, bIdx]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#020617] p-4">
      <div className="w-full max-w-xl bg-slate-900/80 border-2 border-white/5 rounded-[3rem] p-10 flex flex-col items-center justify-between min-h-[700px] shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden backdrop-blur-md">
        
        {/* แสง Neon ตกแต่งพื้นหลัง */}
        <div className="absolute top-0 w-full h-1/2 bg-blue-500/5 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 w-full h-1/2 bg-red-500/5 blur-[100px] pointer-events-none" />

        {/* Enemy Side */}
        <div className="flex flex-col items-center gap-6 z-10">
          <div className="flex items-center gap-3">
            <div className="h-[2px] w-12 bg-gradient-to-l from-red-500 to-transparent" />
            <div className="px-4 py-1 bg-red-500/10 text-red-500 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]">Enemy Bot</div>
            <div className="h-[2px] w-12 bg-gradient-to-r from-red-500 to-transparent" />
          </div>
          
          <div className="h-44 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={`bot-${bIdx}`}
                initial={{ y: -50, opacity: 0, scale: 0.5, rotate: -5 }}
                animate={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
                exit={{ y: 30, opacity: 0, scale: 1.1, filter: "brightness(3) blur(5px)" }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                {botDeck[bIdx] && <Card type={botDeck[bIdx].id} disabled />}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex flex-col items-center">
             <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Cards Remaining</p>
             <div className="flex gap-1 mt-1">
                {Array.from({length: 10}).map((_, i) => (
                    <div key={i} className={`w-3 h-1.5 rounded-full ${i < (10 - bIdx) ? 'bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]' : 'bg-slate-800'}`} />
                ))}
             </div>
          </div>
        </div>

        {/* Center Area (VS & Status) */}
        <div className="flex flex-col items-center z-10 my-6 relative">
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="text-8xl font-black italic text-white absolute -top-8 pointer-events-none select-none"
            >
              VS
            </motion.div>
            
            <AnimatePresence mode="wait">
              <motion.h2 
                key={statusText}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                className="text-3xl font-black text-yellow-500 tracking-tighter uppercase italic z-20 text-center drop-shadow-[0_0_10px_rgba(234,179,8,0.3)]"
              >
                {statusText}
              </motion.h2>
            </AnimatePresence>
        </div>

        {/* Player Side */}
        <div className="flex flex-col items-center gap-6 z-10">
          <div className="flex flex-col items-center">
             <div className="flex gap-1 mb-1">
                {Array.from({length: 10}).map((_, i) => (
                    <div key={i} className={`w-3 h-1.5 rounded-full ${i < (10 - pIdx) ? 'bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.5)]' : 'bg-slate-800'}`} />
                ))}
             </div>
             <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Your Fleet Status</p>
          </div>

          <div className="h-44 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={`player-${pIdx}`}
                initial={{ y: 50, opacity: 0, scale: 0.5, rotate: 5 }}
                animate={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
                exit={{ y: -30, opacity: 0, scale: 1.1, filter: "brightness(3) blur(5px)" }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                {playerDeck[pIdx] && <Card type={playerDeck[pIdx].id} disabled />}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-[2px] w-12 bg-gradient-to-l from-blue-500 to-transparent" />
            <div className="px-4 py-1 bg-blue-500/10 text-blue-500 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]">Trinity Pilot</div>
            <div className="h-[2px] w-12 bg-gradient-to-r from-blue-500 to-transparent" />
          </div>
        </div>

      </div>
    </div>
  );
}