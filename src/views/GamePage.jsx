import { useState, useEffect } from 'react';
import { generateDeck } from '../utils/gameLogic';
import Card from '../components/Game/Card';
import BattleArena from '../components/Game/BattleArena';
import { motion, AnimatePresence } from 'framer-motion';

export default function GamePage({ onFinishSetup }) {
  const [hand, setHand] = useState([]); 
  const [orderedDeck, setOrderedDeck] = useState([]); 
  const [isBattleMode, setIsBattleMode] = useState(false);

  useEffect(() => {
    setHand(generateDeck());
  }, []);

  const selectCard = (card) => {
    if (orderedDeck.length >= 10) return;
    setOrderedDeck([...orderedDeck, card]);
    setHand(hand.filter(c => c.instanceId !== card.instanceId));
  };

  const undoCard = (card) => {
    setHand([...hand, card]);
    setOrderedDeck(orderedDeck.filter(c => c.instanceId !== card.instanceId));
  };

  if (isBattleMode) {
    return <BattleArena playerDeck={orderedDeck} onFinishGame={onFinishSetup} />;
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-around bg-[#020617] text-white p-4">
      
      {/* 1. TOP: Deployment Queue (10 Slots เรียงแถวเดียว) */}
      <div className="w-full flex flex-col items-center">
        <div className="w-full max-w-5xl flex justify-between items-center mb-4">
          <h2 className="text-xl font-black italic text-cyan-400 uppercase tracking-tighter">Unit Queue</h2>
          <span className="text-sm font-mono text-yellow-500">{orderedDeck.length}/10</span>
        </div>
        
        <div className="w-full max-w-5xl bg-slate-900/40 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
          {/* justify-center บังคับให้เริ่มจากตรงกลางแถว */}
          <div className="flex flex-row justify-center items-center gap-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex-shrink-0">
                <div className={`w-[60px] h-[100px] md:w-[70px] md:h-[110px] rounded-lg border-2 border-dashed flex items-center justify-center transition-all
                  ${orderedDeck[i] ? 'border-transparent shadow-lg shadow-cyan-500/20' : 'border-slate-800 bg-black/20'}
                `}>
                  {orderedDeck[i] ? (
                    <Card type={orderedDeck[i].id} onClick={() => undoCard(orderedDeck[i])} />
                  ) : (
                    <span className="text-[10px] text-slate-700 font-bold italic">{i+1}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. BOTTOM: Hand (การ์ดเลือก 10 ใบ เรียงแถวเดียวตรงกลาง) */}
      <div className="w-full flex flex-col items-center">
        <div className="w-full max-w-5xl bg-black/40 p-6 rounded-[2.5rem] border border-white/10 shadow-2xl backdrop-blur-xl">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4 text-center">Tactical Assets</p>
          <div className="flex flex-row flex-wrap justify-center items-center gap-2">
            <AnimatePresence>
              {hand.map((card) => (
                <motion.div key={card.instanceId} layout initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                  <Card type={card.id} onClick={() => selectCard(card)} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ปุ่ม DUEL */}
      {orderedDeck.length === 10 && (
        <button 
          onClick={() => setIsBattleMode(true)}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 px-16 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full text-xl font-black uppercase italic shadow-[0_0_30px_rgba(8,145,178,0.5)] z-50 border border-cyan-400 active:scale-95 transition-all"
        >
          Engage Duel
        </button>
      )}
    </div>
  );
}