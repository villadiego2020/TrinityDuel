import { useState, useEffect } from 'react';
import { checkRoundWinner, generateDeck } from '../../utils/gameLogic';
import Card from './Card';
import { motion, AnimatePresence } from 'framer-motion';

// Import ภาพพื้นหลัง
import bgImage from '../../assets/Background.png';

export default function BattleArena({ playerDeck, onFinishGame }) {
  const [botDeck, setBotDeck] = useState([]);
  const [pIdx, setPIdx] = useState(0); 
  const [bIdx, setBIdx] = useState(0); 
  const [statusText, setStatusText] = useState("PREPARING...");
  const [isFighting, setIsFighting] = useState(false);

  useEffect(() => {
    setBotDeck(generateDeck());
    const startTimer = setTimeout(() => { 
      setStatusText("BATTLE START"); 
      setIsFighting(true); 
    }, 2000);
    return () => clearTimeout(startTimer);
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
      
      if (result === 'PLAYER') { 
          setStatusText("TARGET ELIMINATED"); 
          setBIdx(prev => prev + 1); 
      } else if (result === 'BOT') { 
          setStatusText("CRITICAL DAMAGE"); 
          setPIdx(prev => prev + 1); 
      } else { 
          setStatusText("CLASH: DRAW"); 
          setPIdx(prev => prev + 1); 
          setBIdx(prev => prev + 1); 
      }
    }, 1500);
    return () => clearTimeout(roundTimer);
  }, [isFighting, pIdx, bIdx, playerDeck, botDeck, onFinishGame]);

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center p-10 overflow-hidden relative z-0">
      
      {/* Background Section */}
      <div 
        className="absolute inset-0 z-[-1] bg-cover bg-center bg-no-repeat blur-sm scale-110"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute inset-0 z-[-1] bg-black/60" />
      
      {/* STATUS CENTER BAR */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 w-full">
         <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] z-[-1] bg-cover bg-center bg-no-repeat blur-[2px] scale-110 opacity-20"
            style={{ backgroundImage: `url(${bgImage})` }}
         />
         
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[100px] z-[-1]"></div>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-red-500/10 rounded-full blur-[100px] z-[-1]"></div>
         
         <div className="h-[220px] bg-black/20 backdrop-blur-sm border-y-2 border-cyan-500/20 flex items-center justify-center relative z-10">
            <h2 className="text-7xl font-black italic text-white/5 uppercase tracking-[1.5em] select-none">Engaging</h2>
         </div>
         
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center w-96 z-20 backdrop-blur-xl bg-black/50 p-6 rounded-2xl border-2 border-white/10 shadow-[0_0_50px_rgba(255,255,255,0.1)]">
           <div className={`text-5xl font-black italic uppercase tracking-tighter text-center mb-3 leading-none
             ${statusText.includes('WINS') ? 'text-yellow-400' :
               statusText === 'TARGET ELIMINATED' ? 'text-cyan-400' :
               statusText === 'CRITICAL DAMAGE' ? 'text-red-400' :
               'text-white'
             }
           `}>
             {statusText}
           </div>
           <div className="text-yellow-500 font-mono text-base bg-black/60 px-4 py-1 rounded-full border border-yellow-500/30 shadow-md">ROUND {pIdx + bIdx + 1}</div>
        </div>
      </div>

      {/* BATTLE FIELD */}
      <div className="w-full max-w-7xl flex flex-row items-center justify-between z-10 gap-32 relative">
        <div className="flex flex-col items-center gap-8">
          <div className="text-cyan-400 font-black italic tracking-widest bg-black/50 px-6 py-2 rounded-xl border-l-4 border-cyan-500 uppercase text-lg backdrop-blur-md shadow-[0_0_20px_rgba(8,145,178,0.3)]">Pilot: Player</div>
          <motion.div key={`p-${pIdx}`} initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="shadow-[0_0_80px_rgba(8,145,178,0.6)] rounded-3xl">
             <Card type={playerDeck[pIdx]?.id} isFlipped={false} />
          </motion.div>
          <div className="w-64 h-3 bg-slate-900/80 rounded-full overflow-hidden border-2 border-cyan-500/40 shadow-inner p-[1px]">
             <motion.div 
               animate={{ width: `${((10 - pIdx) / 10) * 100}%` }} 
               transition={{ duration: 0.8 }}
               className="h-full bg-cyan-500 rounded-full shadow-[0_0_20px_#06b6d4,inset_0_0_10px_rgba(255,255,255,0.5)]" 
             />
          </div>
        </div>

        <div className="flex-1"></div>

        <div className="flex flex-col items-center gap-8">
          <div className="text-red-400 font-black italic tracking-widest bg-black/50 px-6 py-2 rounded-xl border-r-4 border-red-500 uppercase text-lg backdrop-blur-md shadow-[0_0_20px_rgba(239,68,68,0.3)]">System: AI_BOT</div>
          <motion.div key={`b-${bIdx}`} initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="shadow-[0_0_80px_rgba(239,68,68,0.5)] rounded-3xl">
             <Card type={botDeck[bIdx]?.id} isFlipped={false} />
          </motion.div>
          <div className="w-64 h-3 bg-slate-900/80 rounded-full overflow-hidden border-2 border-red-500/40 shadow-inner p-[1px]">
             <motion.div 
               animate={{ width: `${((10 - bIdx) / 10) * 100}%` }} 
               transition={{ duration: 0.8 }}
               className="h-full bg-red-600 rounded-full shadow-[0_0_20px_#ef4444,inset_0_0_10px_rgba(255,255,255,0.5)]" 
             />
          </div>
        </div>
      </div>

      {/* FOOTER INFO */}
      <div className="absolute bottom-6 w-full flex justify-between items-center px-16 z-10">
        <div className="flex flex-col gap-1 items-start">
          <span className="text-[10px] text-cyan-500/50 font-black tracking-widest uppercase">System Logs</span>
          <div className="bg-cyan-950/30 border-l-2 border-cyan-500 px-4 py-2 backdrop-blur-md">
            <span className="text-sm font-mono text-cyan-400 font-bold drop-shadow-[0_0_8px_#06b6d4]">
              DECK_P_REMAINING: {10 - pIdx}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 bg-slate-900/50 px-6 py-2 rounded-full border border-white/5 backdrop-blur-md shadow-2xl">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]" />
            <span className="text-sm font-mono text-white font-black tracking-[0.3em] italic uppercase">
              Battle Sequence Active
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1 items-end">
          <span className="text-[10px] text-red-500/50 font-black tracking-widest uppercase">Enemy Status</span>
          <div className="bg-red-950/30 border-r-2 border-red-500 px-4 py-2 backdrop-blur-md">
            <span className="text-sm font-mono text-red-400 font-bold drop-shadow-[0_0_8px_#ef4444]">
              DECK_B_REMAINING: {10 - bIdx}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}