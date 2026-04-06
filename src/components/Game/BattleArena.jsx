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
    setBotDeck(generateDeck());
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
    const pScore = playerDeck.length - currentPIdx;
    const bScore = botDeck.length - currentBIdx;
    onFinishGame(pScore > bScore ? 'PLAYER' : 'BOT', { player: pScore, bot: bScore });
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
    setTimeout(() => processResult(nextPIdx, nextBIdx), 1200);
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

    setTimeout(() => {
        setIsFighting(false);
        setPIdx(nextPIdx);
        setBIdx(nextBIdx);
        if (nextPIdx < playerDeck.length && nextBIdx < botDeck.length) {
            setTimeout(() => {
                setStatusText(nextTurnText);
                setTimeout(() => triggerNextRound(nextPIdx, nextBIdx), 1000);
            }, 1000);
        } else {
            setTimeout(() => handleGameEnd(nextPIdx, nextBIdx), 1000);
        }
    }, 2200);
  };

  return (
    <div className="fixed inset-0 w-full h-[100dvh] flex flex-col items-center justify-start overflow-hidden text-white bg-slate-950 font-sans">
      <div className="absolute inset-0 z-[-1] bg-cover bg-center scale-110 blur-sm opacity-50" style={{ backgroundImage: `url(${bgImage})` }} />
      
      {/* 📊 TOP HUD: Score Bar */}
      <div className="absolute top-0 left-0 w-full pt-4 px-6 z-40 flex flex-col items-center pointer-events-none">
        <div className="w-full max-w-2xl flex items-center gap-4">
          {/* ขยับ Player Score มาไว้ซ้าย */}
          <div className="flex flex-col items-start flex-1">
            <span className="text-[9px] font-black text-cyan-400 italic leading-none">PILOT_CORE</span>
            <span className="text-xl md:text-3xl font-black italic tabular-nums leading-none mt-1">{playerDeck.length - pIdx}</span>
          </div>
          <div className="relative h-2 md:h-4 flex-[3] bg-slate-900/80 border border-white/20 rounded-full overflow-hidden flex shadow-lg">
            <motion.div animate={{ width: `${((playerDeck.length - pIdx) / 10) * 100}%` }} className="h-full bg-cyan-500 shadow-[0_0_10px_#22d3ee]" />
            <div className="w-[2px] h-full bg-white z-10" />
            <motion.div animate={{ width: `${((botDeck.length - bIdx) / 10) * 100}%` }} className="h-full bg-red-600 shadow-[0_0_10px_#ef4444]" />
          </div>
          {/* ขยับ Bot Score มาไว้ขวา */}
          <div className="flex flex-col items-end flex-1">
            <span className="text-[9px] font-black text-red-500 italic leading-none">BOT_CORE</span>
            <span className="text-xl md:text-3xl font-black italic tabular-nums leading-none mt-1">{botDeck.length - bIdx}</span>
          </div>
        </div>
      </div>

      {/* 🏟️ ARENA LAYOUT: สลับฝั่ง Player/Bot */}
      <div className="relative z-10 w-full h-full p-2 flex flex-col md:grid md:grid-cols-3 items-center justify-around md:justify-between gap-2 pt-20 md:pt-24 pb-4">
        
        {/* PLAYER SIDE (Left on PC, Bottom on Mobile) */}
        <div className="flex flex-col items-center order-3 md:order-none scale-[0.8] md:scale-100 origin-bottom md:origin-center shrink-0">
          <div className="relative w-20 md:w-36 aspect-[3/5] bg-cyan-500/10 border-2 border-cyan-400/30 rounded-2xl p-1 shadow-lg">
            <Card type={playerDeck[pIdx]?.id} />
            <div className="absolute -top-2 -left-2 bg-cyan-600 w-8 h-8 rounded-full border-2 border-white/20 flex items-center justify-center font-black text-xs shadow-xl">{playerDeck.length - pIdx}</div>
          </div>
          <h2 className="text-sm md:text-2xl font-black text-cyan-400 mt-2 uppercase italic tracking-tighter">You Pilot</h2>
        </div>

        {/* BATTLE CENTER */}
        <div className="relative flex flex-col items-center justify-center order-2 md:order-none w-full h-28 md:h-full z-20">
          <div className="absolute top-0 md:top-1/4 text-center w-full px-2 z-10">
            <h3 className={`text-xs md:text-2xl font-black italic mb-1 animate-pulse uppercase tracking-tight
              ${statusText.includes('VICTORY') ? 'text-cyan-400' : statusText.includes('DEFEAT') ? 'text-red-500' : 'text-yellow-500'}`}>
              {statusText}
            </h3>
          </div>
          <div className="bg-slate-900 border border-cyan-500/50 px-5 py-1.5 rounded-full text-xl font-black italic text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.3)]">VS</div>

          <AnimatePresence>
            {isFighting && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50 overflow-visible">
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Player Card Animation (พุ่งจากซ้ายไปขวา) */}
                  <motion.div 
                    initial={{ x: isMobile ? 0 : -300, y: isMobile ? 300 : 0, opacity: 0, scale: 0.5 }}
                    animate={{ 
                        x: isMobile ? 0 : (lastResult === 'PLAYER' ? -20 : -60), 
                        y: isMobile ? (lastResult === 'PLAYER' ? 20 : 60) : 0, 
                        opacity: 1, 
                        scale: lastResult === 'PLAYER' ? 1.2 : 1.1,
                        zIndex: lastResult === 'PLAYER' ? 100 : 10,
                        filter: lastResult === 'PLAYER' ? "brightness(1.3) drop-shadow(0 0 15px #22d3ee)" : "brightness(1)"
                    }}
                    exit={
                        lastResult === 'BOT' 
                        ? { opacity: 0, scale: 0.5, filter: "blur(15px) grayscale(1)", transition: { duration: 0.8 } } 
                        : lastResult === 'DRAW'
                        ? { opacity: 0, scale: 0.3, filter: "blur(10px)", transition: { duration: 0.5 } } 
                        : { opacity: 0, x: isMobile ? 0 : -400, y: isMobile ? 400 : 0, scale: 1.5, filter: "brightness(2) blur(8px)", transition: { duration: 0.6 } } 
                    }
                    transition={{ duration: 0.4, type: "spring", damping: 15 }}
                    className="absolute w-24 md:w-40 aspect-[3/5] border-2 md:border-4 border-cyan-400 rounded-2xl bg-slate-900 shadow-2xl overflow-hidden"
                  >
                    <Card type={playerDeck[pIdx]?.id} />
                  </motion.div>

                  {/* Bot Card Animation (พุ่งจากขวาไปซ้าย) */}
                  <motion.div 
                    initial={{ x: isMobile ? 0 : 300, y: isMobile ? -300 : 0, opacity: 0, scale: 0.5 }}
                    animate={{ 
                        x: isMobile ? 0 : (lastResult === 'BOT' ? 20 : 60), 
                        y: isMobile ? (lastResult === 'BOT' ? -20 : -60) : 0, 
                        opacity: 1, 
                        scale: lastResult === 'BOT' ? 1.2 : 1.1,
                        zIndex: lastResult === 'BOT' ? 100 : 10,
                        filter: lastResult === 'BOT' ? "brightness(1.3) drop-shadow(0 0 15px #ef4444)" : "brightness(1)"
                    }}
                    exit={
                        lastResult === 'PLAYER' 
                        ? { opacity: 0, scale: 0.5, filter: "blur(15px) grayscale(1)", transition: { duration: 0.8 } } 
                        : lastResult === 'DRAW'
                        ? { opacity: 0, scale: 0.3, filter: "blur(10px)", transition: { duration: 0.5 } } 
                        : { opacity: 0, x: isMobile ? 0 : 400, y: isMobile ? -400 : 0, scale: 1.5, filter: "brightness(2) blur(8px)", transition: { duration: 0.6 } } 
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

        {/* BOT SIDE (Right on PC, Top on Mobile) */}
        <div className="flex flex-col items-center order-1 md:order-none scale-[0.8] md:scale-100 origin-top md:origin-center shrink-0">
          <h2 className="text-sm md:text-2xl font-black text-red-500 mb-2 uppercase italic tracking-tighter">Cyber Bot</h2>
          <div className="relative w-20 md:w-36 aspect-[3/5] bg-red-500/10 border-2 border-red-500/30 rounded-2xl p-1 shadow-lg">
            <Card type={botDeck[bIdx]?.id || 'BACK'} isFlipped={!isFighting && !lastResult} />
            <div className="absolute -bottom-2 -right-2 bg-red-600 w-8 h-8 rounded-full border-2 border-white/20 flex items-center justify-center font-black text-xs shadow-xl">{botDeck.length - bIdx}</div>
          </div>
        </div>

      </div>
    </div>
  );
}