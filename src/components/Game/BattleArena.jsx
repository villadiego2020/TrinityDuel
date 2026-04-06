import { useState, useEffect, useCallback } from 'react';
import { checkRoundWinner, generateDeck } from '../../utils/gameLogic';
import Card from './Card';
import { motion, AnimatePresence } from 'framer-motion';

// Assets
import bgImage from '../../assets/Background.png';
import sfxWin from "../../assets/sounds/sfx_win.mp3";
import sfxLose from "../../assets/sounds/sfx_lose.mp3";
import sfxDraw from "../../assets/sounds/sfx_draw.mp3";

export default function BattleArena({ playerDeck, onFinishGame, globalVolume = 0.5 }) {
  const [botDeck, setBotDeck] = useState([]);
  const [pIdx, setPIdx] = useState(0); 
  const [bIdx, setBIdx] = useState(0); 
  const [statusText, setStatusText] = useState("INITIALIZING...");
  const [isFighting, setIsFighting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isReady, setIsReady] = useState(false); 
  const [lastResult, setLastResult] = useState(null);

  useEffect(() => {
    const checkRes = () => setIsMobile(window.innerWidth < 768);
    checkRes();
    window.addEventListener('resize', checkRes);
    return () => window.removeEventListener('resize', checkRes);
  }, []);

  useEffect(() => {
    const newDeck = generateDeck();
    setBotDeck(newDeck);
    const t = setTimeout(() => {
      setStatusText("READY? DUEL!");
      setIsReady(true); 
    }, 1500);
    return () => clearTimeout(t);
  }, []);

  const playSFX = useCallback((file) => {
    const audio = new Audio(file);
    audio.volume = globalVolume;
    audio.play().catch(e => console.log("Audio blocked"));
  }, [globalVolume]);

  const handleGameEnd = useCallback((currentPIdx, currentBIdx) => {
    const playerRemaining = playerDeck.length - currentPIdx;
    const botRemaining = botDeck.length - currentBIdx;
    const winner = playerRemaining > botRemaining ? 'PLAYER' : 'BOT';
    onFinishGame(winner, { player: playerRemaining, bot: botRemaining });
  }, [playerDeck, botDeck, onFinishGame]);

  const triggerNextRound = useCallback((nextPIdx, nextBIdx) => {
    if (!isReady) return;
    if (nextPIdx >= playerDeck.length || nextBIdx >= botDeck.length) {
      handleGameEnd(nextPIdx, nextBIdx);
      return;
    }
    setIsFighting(true);
    setLastResult(null);
    setStatusText("CLASHING!");

    setTimeout(() => {
      processResult(nextPIdx, nextBIdx);
    }, 1200);
  }, [isReady, playerDeck, botDeck, handleGameEnd]);

  useEffect(() => {
    if (isReady && pIdx === 0 && bIdx === 0 && !isFighting) {
      triggerNextRound(pIdx, bIdx);
    }
  }, [isReady, pIdx, bIdx, isFighting, triggerNextRound]);

  const processResult = (currentPIdx, currentBIdx) => {
    const pCard = playerDeck[currentPIdx];
    const bCard = botDeck[currentBIdx];
    const result = checkRoundWinner(pCard, bCard);

    setLastResult(result); 

    let nextPIdx = currentPIdx;
    let nextBIdx = currentBIdx;
    let nextTurnText = "";

    if (result === 'PLAYER') {
      setStatusText("ROUND VICTORY!");
      playSFX(sfxWin);
      nextBIdx++;
      nextTurnText = "BOT'S NEXT UNIT PREPARING...";
    } else if (result === 'BOT') {
      setStatusText("ROUND DEFEAT...");
      playSFX(sfxLose);
      nextPIdx++;
      nextTurnText = "YOUR NEXT UNIT PREPARING...";
    } else {
      setStatusText("ROUND DRAW!");
      playSFX(sfxDraw);
      nextPIdx++;
      nextBIdx++;
      nextTurnText = "BOTH UNITS PREPARING...";
    }

    // หน่วงเวลาโชว์การ์ดที่แพ้ Fade Out
    setTimeout(() => {
        setIsFighting(false);
        setPIdx(nextPIdx);
        setBIdx(nextBIdx);

        if (nextPIdx < playerDeck.length && nextBIdx < botDeck.length) {
            setTimeout(() => {
                setStatusText(nextTurnText);
                setTimeout(() => {
                    triggerNextRound(nextPIdx, nextBIdx);
                }, 1000);
            }, 800);
        } else {
            setTimeout(() => {
                handleGameEnd(nextPIdx, nextBIdx);
            }, 1000);
        }
    }, 1800); // ระยะเวลาแสดงผล Clashing + Fade Out
  };

 return (
    <div className="fixed inset-0 w-full h-[100dvh] flex flex-col items-center justify-start overflow-hidden text-white bg-slate-950 font-sans">
      <div className="absolute inset-0 z-[-1] bg-cover bg-center scale-110 blur-sm opacity-50" style={{ backgroundImage: `url(${bgImage})` }} />
      
      {/* 🏟️ Arena Layout */}
      <div className="relative z-10 w-full h-full p-2 md:p-8 flex flex-col md:grid md:grid-cols-3 items-center justify-between gap-2 md:gap-6 pt-10 md:pt-16 pb-4 md:pb-8">
        
        {/* --- 🔴 BOT SIDE --- */}
        <div className="flex flex-col items-center order-1 md:order-none scale-[0.85] md:scale-100 origin-top md:origin-center shrink-0">
          <h2 className="text-base md:text-2xl font-black text-red-500 mb-2 uppercase italic tracking-tighter">Cyber Bot</h2>
          
          {/* Card Container */}
          <div className="relative w-20 md:w-36 aspect-[3/5] bg-red-500/10 border-2 border-red-500/30 rounded-2xl p-1 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            <Card type={botDeck[bIdx]?.id || 'BACK'} isFlipped={!isFighting && !lastResult} />
            
            {/* 🏷️ Improved Bot Deck Badge: ปรับให้ใหญ่และเด่นขึ้น */}
            <div className="absolute -bottom-4 -right-2 md:-bottom-6 md:-right-4 z-30">
              <div className="bg-red-600 text-white px-3 py-1 md:px-4 md:py-2 rounded-lg md:rounded-xl border-2 border-white/20 shadow-[0_4px_15px_rgba(220,38,38,0.6)] flex flex-col items-center min-w-[50px] md:min-w-[70px]">
                <span className="text-[7px] md:text-[10px] font-black uppercase tracking-tighter opacity-80 leading-none mb-0.5">Reserve</span>
                <span className="text-sm md:text-2xl font-black italic leading-none">{Math.max(0, botDeck.length - bIdx)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- ⚔️ BATTLE CENTER (Clash Animation) --- */}
        <div className="relative flex flex-col items-center justify-center order-2 md:order-none w-full h-24 md:h-full flex-grow-0 md:flex-grow min-h-[96px] md:min-h-0 overflow-visible z-20">
          <div className="absolute top-0 md:top-1/4 text-center w-full px-2">
            <h3 className={`text-xs md:text-2xl font-black italic mb-1 animate-pulse uppercase tracking-tight
              ${statusText.includes('VICTORY') ? 'text-cyan-400' : statusText.includes('DEFEAT') ? 'text-red-500' : 'text-yellow-500'}`}>
              {statusText}
            </h3>
          </div>
          
          <div className="z-10 bg-slate-900 border-2 border-cyan-500 px-5 py-1.5 md:px-6 md:py-2 rounded-full text-xl md:text-5xl font-black italic text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.4)]">
            VS
          </div>

          {/* Clash Animation Layer (คงเดิม) */}
          <AnimatePresence>
            {isFighting && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50 overflow-visible">
                <div className="relative w-full h-full flex items-center justify-center">
                  
                  {/* --- Player Card --- */}
                  <motion.div 
                    initial={{ x: isMobile ? 0 : 300, y: isMobile ? 300 : 0, opacity: 0, scale: 0.5 }}
                    animate={{ 
                        // ถ้าชนะ ให้เดินหน้าไปทับ (Overlap), ถ้าแพ้ ให้ถอยหรืออยู่ที่เดิม
                        x: isMobile ? 0 : (lastResult === 'PLAYER' ? 20 : 60), 
                        y: isMobile ? (lastResult === 'PLAYER' ? 20 : 60) : 0, 
                        opacity: 1, 
                        scale: lastResult === 'PLAYER' ? 1.2 : 1.1,
                        zIndex: lastResult === 'PLAYER' ? 100 : 10, // ตัวชนะอยู่บน
                        filter: lastResult === 'PLAYER' ? "brightness(1.2) drop-shadow(0 0 20px #22d3ee)" : "brightness(1)"
                    }}
                    exit={
                        lastResult === 'BOT' 
                        ? { opacity: 0, scale: 0.5, filter: "blur(15px) grayscale(1)", transition: { duration: 0.6 } } 
                        : lastResult === 'DRAW'
                        ? { opacity: 0, scale: 0.3, filter: "blur(10px)" }
                        : { opacity: 0, scale: 1.5, filter: "blur(5px) brightness(2)", transition: { duration: 0.5 } }
                    }
                    transition={{ duration: 0.4, type: "spring", damping: 15 }}
                    className="absolute w-24 md:w-40 aspect-[3/5] border-2 md:border-4 border-cyan-400 rounded-2xl bg-slate-900 shadow-2xl overflow-hidden"
                  >
                    <Card type={playerDeck[pIdx]?.id} />
                  </motion.div>

                  {/* VS Indicator - ให้หายไปเร็วขึ้นเมื่อมีการทับกัน */}
                  {/* {!lastResult && (
                    <motion.div exit={{ opacity: 0 }} className="z-20 text-white font-black italic text-xl md:text-4xl">VS</motion.div>
                  )} */}

                  {/* --- Bot Card --- */}
                  <motion.div 
                    initial={{ x: isMobile ? 0 : -300, y: isMobile ? -300 : 0, opacity: 0, scale: 0.5 }}
                    animate={{ 
                        // ถ้าชนะ ให้เดินหน้าไปทับ (Overlap)
                        x: isMobile ? 0 : (lastResult === 'BOT' ? -20 : -60), 
                        y: isMobile ? (lastResult === 'BOT' ? -20 : -60) : 0, 
                        opacity: 1, 
                        scale: lastResult === 'BOT' ? 1.2 : 1.1,
                        zIndex: lastResult === 'BOT' ? 100 : 10, // ตัวชนะอยู่บน
                        filter: lastResult === 'BOT' ? "brightness(1.2) drop-shadow(0 0 20px #ef4444)" : "brightness(1)"
                    }}
                    exit={
                        lastResult === 'PLAYER' 
                        ? { opacity: 0, scale: 0.5, filter: "blur(15px) grayscale(1)", transition: { duration: 0.6 } } 
                        : lastResult === 'DRAW'
                        ? { opacity: 0, scale: 0.3, filter: "blur(10px)" }
                        : { opacity: 0, scale: 1.5, filter: "blur(5px) brightness(2)", transition: { duration: 0.5 } }
                    }
                    transition={{ duration: 0.4, type: "spring", damping: 15 }}
                    className="absolute w-24 md:w-40 aspect-[3/5] border-2 md:border-4 border-red-500 rounded-2xl bg-slate-900 shadow-2xl overflow-hidden"
                  >
                    <Card type={botDeck[bIdx]?.id} />
                  </motion.div>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* --- 🔵 PLAYER SIDE --- */}
        <div className="flex flex-col items-center order-3 md:order-none scale-[0.85] md:scale-100 origin-bottom md:origin-center shrink-0">
          
          <div className="relative w-20 md:w-36 aspect-[3/5] bg-cyan-500/10 border-2 border-cyan-400/30 rounded-2xl p-1 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
            <Card type={playerDeck[pIdx]?.id} />
            
            {/* 🏷️ Improved Player Deck Badge: ปรับให้ใหญ่และเด่นขึ้น */}
            <div className="absolute -top-4 -left-2 md:-top-6 md:-left-4 z-30">
              <div className="bg-cyan-600 text-white px-3 py-1 md:px-4 md:py-2 rounded-lg md:rounded-xl border-2 border-white/20 shadow-[0_4px_15px_rgba(8,145,178,0.6)] flex flex-col items-center min-w-[50px] md:min-w-[70px]">
                <span className="text-[7px] md:text-[10px] font-black uppercase tracking-tighter opacity-80 leading-none mb-0.5">In Deck</span>
                <span className="text-sm md:text-2xl font-black italic leading-none">{Math.max(0, playerDeck.length - pIdx)}</span>
              </div>
            </div>
          </div>
          
          <h2 className="text-base md:text-2xl font-black text-cyan-400 mt-3 md:mt-4 uppercase italic tracking-tighter">You Pilot</h2>
        </div>
      </div>
    </div>
  );
}