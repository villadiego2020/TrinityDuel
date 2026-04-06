import { useState, useEffect } from 'react';
import { generateDeck } from '../utils/gameLogic';
import Card from '../components/Game/Card';
import BattleArena from '../components/Game/BattleArena';
import { motion, AnimatePresence } from 'framer-motion';

// Assets
import bgImage from '../assets/Background.png';
import sfxDeploy from '../assets/sounds/sfx_deploy.mp3';
import sfxClick from '../assets/sounds/sfx_click.mp3';

export default function GamePage({ onFinishSetup, globalVolume, onOpenSettings }) {
  const [hand, setHand] = useState([]); 
  const [orderedDeck, setOrderedDeck] = useState([]); 
  const [isBattleMode, setIsBattleMode] = useState(false);

  useEffect(() => {
    setOrderedDeck([]); 
    setHand(generateDeck()); 
    setIsBattleMode(false); 
  }, []);

  const playDeploySfx = () => {
    const audio = new Audio(sfxDeploy);
    audio.volume = globalVolume;
    audio.play().catch(e => console.log("Audio blocked"));
  };

  const playClickSfx = () => {
    const audio = new Audio(sfxClick);
    audio.volume = globalVolume;
    audio.play().catch(e => console.log("Audio blocked"));
  };

  const selectCard = (card) => {
    if (orderedDeck.length >= 10) return;
    playDeploySfx();
    const newDeck = [...orderedDeck, card];
    setOrderedDeck(newDeck);
    setHand(hand.filter(c => c.instanceId !== card.instanceId));
    if (newDeck.length === 10) {
      setTimeout(() => { playDeploySfx(); }, 150);
    }
  };

  const undoCard = (card) => {
    playClickSfx();
    setHand([...hand, card]);
    setOrderedDeck(orderedDeck.filter(c => c.instanceId !== card.instanceId));
  };

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
    <div className="fixed inset-0 w-full h-[100dvh] bg-slate-950 overflow-hidden flex items-center justify-center">
      
      {/* Background Section */}
      <div 
        className="absolute inset-0 z-[-1] bg-cover bg-center bg-no-repeat blur-sm scale-110"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute inset-0 z-[-1] bg-black/70" />

      {/* Main Game Container */}
      <div className="w-full h-full max-w-[100vw] max-h-[100dvh] flex flex-col items-center justify-start p-3 md:p-8 pt-10 md:pt-16 relative">
        
        {/* 1. TOP: Header & Deployment Slots (แก้ไขเพื่อกัน Settings ทับข้อความ) */}
        <div className="w-full flex flex-col items-center z-10 relative shrink-0">
          
          {/* New Header Layout */}
          <div className="w-full max-w-5xl flex items-start justify-between mb-2 px-4 md:px-2 gap-2">
            {/* Left: Title */}
            <div className="flex flex-col min-w-0 flex-1">
              <h2 className="text-[10px] md:text-xl font-black italic text-cyan-400 uppercase tracking-widest truncate">
                Unit Queue
              </h2>
              <div className="h-[2px] w-8 md:w-16 bg-cyan-500/50 rounded-full mt-1"></div>
            </div>

            {/* Right: Status & Settings Button */}
            <div className="flex items-center gap-3 shrink-0 translate-y-[-4px]">
              <div className="flex flex-col items-end">
                <span className="text-[7px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Status</span>
                <span className="text-[10px] md:text-sm font-mono text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-md border border-yellow-500/20 whitespace-nowrap">
                  {orderedDeck.length} / 10
                </span>
              </div>

              {/* Settings Button ย้ายมาไว้ตรงนี้เพื่อไม่ให้ทับ */}
              <button 
                onClick={onOpenSettings}
                className="p-1.5 md:p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 md:w-6 md:h-6">
                  <path d="M12.22 2h-4.44v4.44h4.44V2Z"/><path d="M12.22 17.56h-4.44v4.44h4.44v-4.44Z"/><path d="m3.33 16.44 3.14-3.14 3.14 3.14-3.14 3.14-3.14-3.14Z"/><path d="m14.44 16.44 3.14-3.14 3.14 3.14-3.14 3.14-3.14-3.14Z"/><path d="m3.33 7.56 3.14-3.14 3.14 3.14-3.14 3.14-3.14-3.14Z"/><path d="m14.44 7.56 3.14-3.14 3.14 3.14-3.14 3.14-3.14-3.14Z"/>
                </svg>
              </button>
            </div>
          </div>
          
          {/* Slots Grid */}
          <div className="w-full max-w-5xl bg-slate-950/80 p-2 md:p-8 rounded-xl md:rounded-[2.5rem] border border-white/10 backdrop-blur-md shadow-2xl flex justify-center">
            <div className="grid grid-cols-5 md:grid-cols-10 gap-1.5 md:gap-3 w-full justify-items-center">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="w-full max-w-[50px] md:max-w-[85px] aspect-[3/5]">
                  <div className={`w-full h-full rounded-lg md:rounded-2xl border-2 border-dashed flex items-center justify-center transition-all duration-300
                    ${orderedDeck[i] ? 'border-transparent shadow-[0_0_15px_rgba(34,211,238,0.3)] scale-105' : 'border-slate-800 bg-black/40'}
                  `}>
                    {orderedDeck[i] ? (
                      <Card type={orderedDeck[i].id} onClick={() => undoCard(orderedDeck[i])} />
                    ) : (
                      <span className="text-[8px] md:text-xs text-slate-800 font-black italic">{i + 1}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Middle Area: Engage Button */}
        <div className="flex-1 flex flex-col items-center justify-center z-10 relative w-full py-2 min-h-[60px]">
           <button 
            disabled={!isDeckFull}
            onClick={() => { playDeploySfx(); setIsBattleMode(true); }}
            className={`
              px-10 py-2.5 md:px-24 md:py-5 rounded-full text-[10px] md:text-2xl font-black uppercase italic transition-all duration-500 border-2
              ${isDeckFull 
                ? 'bg-cyan-600 border-cyan-400 text-white shadow-[0_0_25px_rgba(8,145,178,0.5)] cursor-pointer hover:bg-cyan-400 hover:scale-110 active:scale-95' 
                : 'bg-slate-950/80 border-slate-800 text-slate-700 cursor-not-allowed opacity-50'
              }
            `}
          >
            {isDeckFull ? 'INITIATE DUEL' : 'QUEUE: 10 UNITS'}
          </button>
        </div>

        {/* 3. Tactical Hand */}
        <div className="w-full flex flex-col items-center mb-2 md:mb-6 z-10 relative shrink-0">
          <div className="w-full max-w-6xl bg-black/80 p-3 md:p-8 rounded-2xl md:rounded-[3.5rem] border border-white/10 backdrop-blur-xl shadow-2xl flex flex-col items-center">
            <p className="text-[8px] md:text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-3">Available Tactical Units</p>
            <div className="grid grid-cols-5 md:flex md:flex-row md:flex-wrap justify-center items-center gap-1.5 md:gap-5 w-full">
              <AnimatePresence>
                {hand.map((card) => (
                  <motion.div 
                    key={card.instanceId} 
                    layout 
                    initial={{ scale: 0, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }} 
                    exit={{ scale: 0, opacity: 0 }}
                    className="w-full max-w-[55px] md:w-32"
                  >
                    <Card type={card.id} onClick={() => selectCard(card)} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}