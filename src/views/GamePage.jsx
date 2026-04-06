import { useState, useEffect } from 'react';
import { generateDeck } from '../utils/gameLogic';
import Card from '../components/Game/Card';
import BattleArena from '../components/Game/BattleArena';
import { motion, AnimatePresence } from 'framer-motion';

// Import ภาพพื้นหลัง
import bgImage from '../assets/Background.png';

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

  // เช็คว่าเลือกการ์ดครบหรือยัง
  const isDeckFull = orderedDeck.length === 10;

  return (
    <div className="fixed inset-0 w-full h-full flex flex-col items-center justify-between p-8 overflow-hidden font-sans text-white z-0">
      
      {/* Background Section */}
      <div 
        className="absolute inset-0 z-[-1] bg-cover bg-center bg-no-repeat blur-sm scale-110"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute inset-0 z-[-1] bg-black/50" />
      
      {/* 1. TOP: Deployment Slots */}
      <div className="w-full flex flex-col items-center mt-12 z-10 relative">
        <div className="w-full max-w-4xl flex justify-between items-center mb-3 px-2">
          <h2 className="text-lg font-black italic text-cyan-400 uppercase tracking-[0.2em]">Unit Queue</h2>
          <span className="text-sm font-mono text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded border border-yellow-500/20">
            {orderedDeck.length} / 10
          </span>
        </div>
        
        <div className="w-full max-w-4xl bg-slate-950/60 p-6 rounded-2xl border border-white/5 backdrop-blur-md shadow-inner flex justify-center">
          <div className="flex flex-row justify-center items-center gap-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex-shrink-0">
                <div className={`w-[65px] h-[110px] md:w-[75px] md:h-[125px] rounded-xl border-2 border-dashed flex items-center justify-center transition-all duration-300
                  ${orderedDeck[i] ? 'border-transparent shadow-lg shadow-cyan-500/20 scale-105' : 'border-slate-800 bg-black/40'}
                `}>
                  {orderedDeck[i] ? (
                    <Card type={orderedDeck[i].id} onClick={() => undoCard(orderedDeck[i])} />
                  ) : (
                    <span className="text-xs text-slate-700 font-black italic opacity-50">{i + 1}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Middle Area: Fixed Engage Button (ไม่ต้องลอยแล้ว) */}
      <div className="flex-1 flex flex-col items-center justify-center z-10 relative w-full gap-4">
         {/* เส้นตกแต่ง */}
         <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
         
         <button 
          disabled={!isDeckFull}
          onClick={() => setIsBattleMode(true)}
          className={`
            px-20 py-4 rounded-full text-xl font-black uppercase italic transition-all duration-500 border-2
            ${isDeckFull 
              ? 'bg-cyan-600 border-cyan-400 text-white shadow-[0_0_40px_rgba(8,145,178,0.6)] cursor-pointer hover:bg-cyan-500 hover:scale-105 active:scale-95' 
              : 'bg-slate-900/80 border-slate-700 text-slate-600 cursor-not-allowed opacity-50 grayscale'
            }
          `}
        >
          {isDeckFull ? 'Engage Duel' : 'Fill Queue to Battle'}
        </button>

        <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
      </div>

      {/* 3. Tactical Hand */}
      <div className="w-full flex flex-col items-center mb-6 z-10 relative">
        <div className="w-full max-w-5xl bg-black/60 p-8 rounded-[3rem] border border-white/10 backdrop-blur-xl shadow-2xl flex flex-col items-center">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.6em] mb-6">Available Tactical Units</p>
          
          <div className="flex flex-row flex-wrap justify-center items-center gap-4 w-full">
            <AnimatePresence>
              {hand.map((card) => (
                <motion.div 
                  key={card.instanceId} 
                  layout 
                  initial={{ scale: 0, opacity: 0 }} 
                  animate={{ scale: 1, opacity: 1 }} 
                  exit={{ scale: 0, opacity: 0 }}
                  className="flex-shrink-0"
                >
                  <Card type={card.id} onClick={() => selectCard(card)} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}