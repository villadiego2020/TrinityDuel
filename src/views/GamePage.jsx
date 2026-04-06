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

  const handleStartDuel = () => {
    setIsBattleMode(true);
  };

  if (isBattleMode) {
    return <BattleArena playerDeck={orderedDeck} onFinishGame={onFinishSetup} />;
  }

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-[#0a0a0c] text-white">
      {/* ส่วนหัวชื่อเกม/ขั้นตอน */}
      <div className="text-center mb-10 mt-6">
        <h2 className="text-4xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 uppercase">
          Trinity Duel
        </h2>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em] mt-2">
          Phase 1: Arrange Your Strategy ({orderedDeck.length}/10)
        </p>
      </div>

      {/* สล็อต 10 ช่อง (Battle Queue) */}
      <div className="w-full max-w-6xl bg-slate-900/40 rounded-[2.5rem] p-8 border border-white/5 backdrop-blur-xl mb-12 shadow-[0_0_50px_rgba(0,0,0,0.3)]">
        <div className="grid grid-cols-5 md:grid-cols-10 gap-4 justify-items-center">
          {Array.from({ length: 10 }).map((_, index) => {
            const card = orderedDeck[index];
            return (
              <div key={index} className="flex flex-col items-center gap-2">
                <span className="text-[10px] font-black text-slate-600 italic">SLOT {index + 1}</span>
                <div className="min-w-[7rem]">
                  {card ? (
                    <Card type={card.id} label={card.label} onClick={() => undoCard(card)} />
                  ) : (
                    <div className="w-28 h-40 rounded-2xl border-2 border-dashed border-slate-800 bg-black/20 flex items-center justify-center text-slate-800 font-black italic text-xs">
                      EMPTY
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-slate-800 to-transparent mb-10" />

      {/* คลังการ์ดในมือ */}
      <div className="w-full max-w-5xl">
        <p className="text-center text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-6">Your Available Cards</p>
        <div className="flex flex-wrap gap-4 justify-center items-center p-6 bg-white/5 rounded-[2rem] border border-white/5">
          <AnimatePresence>
            {hand.map((card) => (
              <motion.div
                key={card.instanceId}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                layout
              >
                <Card type={card.id} label={card.label} onClick={() => selectCard(card)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* ปุ่มเข้าสู่การดวล */}
      <AnimatePresence>
        {orderedDeck.length === 10 && (
          <motion.button 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            onClick={handleStartDuel}
            className="fixed bottom-10 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 px-20 py-5 rounded-full text-2xl font-black text-black shadow-[0_10px_40px_rgba(234,179,8,0.3)] transition-all uppercase italic tracking-tighter z-50 active:scale-95"
          >
            Commence Duel
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}