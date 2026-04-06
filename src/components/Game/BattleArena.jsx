import { useState, useEffect } from 'react';
import { checkRoundWinner, generateDeck } from '../../utils/gameLogic';
import Card from './Card';
import { motion, AnimatePresence } from 'framer-motion';

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
      else if (result === 'BOT') { setStatusText("SHIELD BREACHED"); setPIdx(prev => prev + 1); }
      else { setStatusText("CLASH DETECTED"); setPIdx(prev => prev + 1); setBIdx(prev => prev + 1); }
    }, 2500);
    return () => clearTimeout(roundTimer);
  }, [isFighting, pIdx, bIdx]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#020617] overflow-hidden text-white font-sans">
      {/* Background Effect - Cyber Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      {/* TOP: BOT AREA */}
      <div className="absolute top-10 right-20 flex flex-col items-end gap-2 z-10">
        <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-red-500 tracking-[0.3em] mb-1 uppercase">Corporate AI System</span>
            <div className="w-64 h-2 bg-slate-800 rounded-full overflow-hidden border border-red-500/30">
                <motion.div 
                    animate={{ width: `${((10 - bIdx) / 10) * 100}%` }}
                    className="h-full bg-gradient-to-r from-red-600 to-orange-500 shadow-[0_0_10px_#ef4444]"
                />
            </div>
            <span className="text-[10px] mt-1 text-slate-500 font-bold">STABILITY: {((10 - bIdx) / 10) * 100}%</span>
        </div>
      </div>

      {/* CENTER: BATTLE FIELD */}
      <div className="relative w-full h-[600px] flex items-center justify-center">
        {/* Arena Ring Effect */}
        <div className="absolute w-[800px] h-[300px] border-2 border-blue-500/20 rounded-[100%] rotateX-60 shadow-[0_0_50px_rgba(59,130,246,0.1)]"></div>
        
        {/* BOT CARD SLOT */}
        <div className="absolute top-[20%] flex flex-col items-center">
            <AnimatePresence mode="wait">
                <motion.div
                    key={`bot-${bIdx}`}
                    initial={{ y: -100, opacity: 0, scale: 0.8, rotateX: 20 }}
                    animate={{ y: 0, opacity: 1, scale: 1, rotateX: 0 }}
                    exit={{ x: 100, opacity: 0, scale: 0.5 }}
                    className="shadow-[0_0_30px_rgba(239,68,68,0.3)] rounded-lg"
                >
                    {botDeck[bIdx] && <Card type={botDeck[bIdx].id} disabled />}
                </motion.div>
            </AnimatePresence>
        </div>

        {/* VS TEXT */}
        <div className="z-0 pointer-events-none">
            <h1 className="text-[120px] font-black italic opacity-5 tracking-tighter">TRINITY</h1>
        </div>

        {/* PLAYER CARD SLOT */}
        <div className="absolute bottom-[20%] flex flex-col items-center">
            <AnimatePresence mode="wait">
                <motion.div
                    key={`player-${pIdx}`}
                    initial={{ y: 100, opacity: 0, scale: 0.8, rotateX: -20 }}
                    animate={{ y: 0, opacity: 1, scale: 1, rotateX: 0 }}
                    exit={{ x: -100, opacity: 0, scale: 0.5 }}
                    className="shadow-[0_0_30px_rgba(59,130,246,0.3)] rounded-lg"
                >
                    {playerDeck[pIdx] && <Card type={playerDeck[pIdx].id} disabled />}
                </motion.div>
            </AnimatePresence>
        </div>
      </div>

      {/* BOTTOM: PLAYER UI (HUD) */}
      <div className="absolute bottom-10 left-10 flex flex-col gap-4 z-10">
        <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 p-4 rounded-2xl w-80 shadow-2xl">
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-black italic text-blue-400">TRINITY PILOT_01</span>
                <span className="text-[10px] text-slate-500">Lv. 99</span>
            </div>
            {/* HP Bar */}
            <div className="w-full h-3 bg-slate-800 rounded-sm mb-1">
                <motion.div 
                    animate={{ width: `${((10 - pIdx) / 10) * 100}%` }}
                    className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 shadow-[0_0_10px_#3b82f6]"
                />
            </div>
            <div className="flex justify-between text-[9px] font-bold text-slate-400">
                <span>HP {1000 - (pIdx * 100)} / 1000</span>
                <span>{((10 - pIdx) / 10) * 100}%</span>
            </div>
        </div>
      </div>

      {/* STATUS OVERLAY */}
      <div className="absolute top-1/2 left-10 -translate-y-1/2 flex flex-col gap-1">
        <div className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest bg-yellow-500/10 px-2 py-1 self-start border-l-2 border-yellow-500 mb-2">Battle Feed</div>
        <AnimatePresence>
            <motion.div 
                key={statusText}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="text-lg font-black italic tracking-tighter"
            >
                {statusText}
            </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}