import { useState, useEffect } from 'react';
import { generateDeck } from '../utils/gameLogic';
import Card from '../components/Game/Card';
import BattleArena from '../components/Game/BattleArena';
import { motion, AnimatePresence } from 'framer-motion';

// Assets
import bgImage from '../assets/Background.png';
import sfxDeploy from '../assets/sounds/sfx_deploy.mp3';
import sfxClick from '../assets/sounds/sfx_click.mp3';

export default function GamePage({ onFinishSetup, globalVolume }) {
  const [hand, setHand] = useState([]); 
  const [orderedDeck, setOrderedDeck] = useState([]); 
  const [isBattleMode, setIsBattleMode] = useState(false);

  useEffect(() => {
    setOrderedDeck([]); 
    setHand(generateDeck()); 
    setIsBattleMode(false); 
  }, []);

  // --- 🔊 ระบบจัดการเสียง SFX โดยใช้ Global Volume ---
  const playDeploySfx = () => {
    const audio = new Audio(sfxDeploy);
    audio.volume = globalVolume; // ใช้ค่า Master จาก App.jsx
    audio.play().catch(e => console.log("Audio blocked"));
  };

  const playClickSfx = () => {
    const audio = new Audio(sfxClick);
    audio.volume = globalVolume; // ใช้ค่า Master จาก App.jsx
    audio.play().catch(e => console.log("Audio blocked"));
  };

  const selectCard = (card) => {
    if (orderedDeck.length >= 10) return;
    
    playDeploySfx();

    const newDeck = [...orderedDeck, card];
    setOrderedDeck(newDeck);
    setHand(hand.filter(c => c.instanceId !== card.instanceId));

    // จังหวะสะใจ: ถ้าเลือกครบ 10 ใบ ให้เล่นเสียงซ้ำอีกทีเพื่อยืนยัน
    if (newDeck.length === 10) {
      setTimeout(() => {
        playDeploySfx();
      }, 150);
    }
  };

  const undoCard = (card) => {
    playClickSfx();
    setHand([...hand, card]);
    setOrderedDeck(orderedDeck.filter(c => c.instanceId !== card.instanceId));
  };

  // --- เมื่อสลับเข้าโหมด Battle ต้องส่ง globalVolume ต่อไปด้วย ---
  if (isBattleMode) {
    return (
      <BattleArena 
        playerDeck={orderedDeck} 
        onFinishGame={onFinishSetup} 
        globalVolume={globalVolume} 
      />
    );
  }

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
      <div className="w-full flex flex-col items-center mt-40 z-10 relative">
        <div className="w-full max-w-5xl flex justify-between items-end mb-4 px-4">
          <div className="flex flex-col">
            <h2 className="text-xl font-black italic text-cyan-400 uppercase tracking-[0.2em]">Unit Queue</h2>
            <div className="h-1 w-16 bg-cyan-500/50 rounded-full mt-1"></div>
          </div>
          
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Queue Status</span>
            <span className="text-sm font-mono text-yellow-500 bg-yellow-500/10 px-4 py-1 rounded-lg border border-yellow-500/20">
              {orderedDeck.length} / 10
            </span>
          </div>
        </div>
        
        <div className="w-full max-w-5xl bg-slate-950/70 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-md shadow-2xl flex justify-center">
          <div className="flex flex-row justify-center items-center gap-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex-shrink-0">
                <div className={`w-[70px] h-[115px] md:w-[85px] md:h-[135px] rounded-2xl border-2 border-dashed flex items-center justify-center transition-all duration-500
                  ${orderedDeck[i] ? 'border-transparent shadow-[0_0_25px_rgba(34,211,238,0.2)] scale-105' : 'border-slate-800 bg-black/40'}
                `}>
                  {orderedDeck[i] ? (
                    <Card 
                      type={orderedDeck[i].id} 
                      onClick={() => undoCard(orderedDeck[i])} 
                      showDown={true} 
                    />
                  ) : (
                    <span className="text-xs text-slate-800 font-black italic">{i + 1}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Middle Area: Engage Button */}
      <div className="flex-1 flex flex-col items-center justify-center z-10 relative w-full">
         <button 
          disabled={!isDeckFull}
          onClick={() => {
            playDeploySfx();
            setIsBattleMode(true);
          }}
          className={`
            px-24 py-5 rounded-full text-2xl font-black uppercase italic transition-all duration-700 border-2
            ${isDeckFull 
              ? 'bg-cyan-600 border-cyan-400 text-white shadow-[0_0_50px_rgba(8,145,178,0.5)] cursor-pointer hover:bg-cyan-400 hover:scale-110 active:scale-95' 
              : 'bg-slate-950/80 border-slate-800 text-slate-700 cursor-not-allowed opacity-50'
            }
          `}
        >
          {isDeckFull ? 'INITIATE DUEL' : 'WAITING FOR LOADOUT...'}
        </button>
      </div>

      {/* 3. Tactical Hand */}
      <div className="w-full flex flex-col items-center mb-10 z-10 relative">
        <div className="w-full max-w-6xl bg-black/70 p-10 rounded-[3.5rem] border border-white/10 backdrop-blur-xl shadow-[0_0_80px_rgba(0,0,0,0.5)] flex flex-col items-center">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.8em] mb-8">Available Tactical Units</p>
          
          <div className="flex flex-row flex-wrap justify-center items-center gap-5 w-full">
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