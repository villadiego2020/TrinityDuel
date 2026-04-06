import { useState, useEffect } from 'react';
import { checkRoundWinner, generateDeck } from '../../utils/gameLogic';
import Card from './Card';
import { motion, AnimatePresence } from 'framer-motion';

// Assets - เช็ค Path ให้ดีนะมึง
import bgImage from '../../assets/Background.png';
import bgmBattle from "../../assets/sounds/bgm_battle.mp3";
import sfxWin from "../../assets/sounds/sfx_win.mp3";
import sfxLose from "../../assets/sounds/sfx_lose.mp3";
import sfxDraw from "../../assets/sounds/sfx_draw.mp3";
import sfxPopup from "../../assets/sounds/sfx_round_end.mp3"; 

export default function BattleArena({ playerDeck, onFinishGame, globalVolume = 0.5 }) {
  const [botDeck, setBotDeck] = useState([]);
  const [pIdx, setPIdx] = useState(0); 
  const [bIdx, setBIdx] = useState(0); 
  const [statusText, setStatusText] = useState("PREPARING...");
  const [isFighting, setIsFighting] = useState(false);
  const [lastResult, setLastResult] = useState(null); 

  // State สำหรับ Popup
  const [showRoundPopup, setShowRoundPopup] = useState(false);
  const [roundWinnerName, setRoundWinnerName] = useState("");
  const [countdown, setCountdown] = useState(3);

  // --- 🔊 ระบบจัดการเสียง SFX ---
  const playSFX = (file) => {
    const audio = new Audio(file);
    audio.volume = globalVolume; // ใช้ค่า Master Volume จาก Setting
    audio.play().catch(e => console.log("SFX Blocked"));
  };

  // --- 🎵 ระบบจัดการเพลง Battle (BGM) ---
  useEffect(() => {
    const bgm = new Audio(bgmBattle);
    bgm.loop = true;
    bgm.volume = globalVolume;
    bgm.play().catch(e => console.log("BGM Blocked"));

    return () => {
      bgm.pause();
      bgm.currentTime = 0;
    };
  }, [globalVolume]); // ถ้าปรับ Setting ระหว่างสู้ เพลงจะดัง/เบาทันที

  useEffect(() => {
    setBotDeck(generateDeck());
    const startTimer = setTimeout(() => { 
      setStatusText("BATTLE START"); 
      setIsFighting(true); 
    }, 2000);
    return () => clearTimeout(startTimer);
  }, []);

  // Loop การต่อสู้
  useEffect(() => {
    if (!isFighting || showRoundPopup) return;

    const roundTimer = setTimeout(() => {
      // 1. เช็คจบรอบ (10 ใบ)
      if (pIdx >= playerDeck.length || bIdx >= botDeck.length) {
        setIsFighting(false);
        const winner = pIdx >= playerDeck.length ? "BOT" : "PLAYER";
        setRoundWinnerName(winner);
        setShowRoundPopup(true);
        playSFX(sfxPopup); 
        return;
      }

      // 2. คำนวณผล
      const result = checkRoundWinner(playerDeck[pIdx], botDeck[bIdx]);
      setLastResult(result);
      
      if (result === 'PLAYER') { 
          playSFX(sfxWin); 
          setStatusText("TARGET NEUTRALIZED"); 
          setBIdx(prev => prev + 1); 
      } else if (result === 'BOT') { 
          playSFX(sfxLose);
          setStatusText("SYSTEM BREACHED"); 
          setPIdx(prev => prev + 1); 
      } else { 
          playSFX(sfxDraw);
          setStatusText("KINETIC CLASH"); 
          setPIdx(prev => prev + 1); 
          setBIdx(prev => prev + 1); 
      }
    }, 1500);
    return () => clearTimeout(roundTimer);
  }, [isFighting, pIdx, bIdx, playerDeck, botDeck, showRoundPopup]);

  // Logic นับถอยหลัง
  useEffect(() => {
    let timer;
    if (showRoundPopup && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (showRoundPopup && countdown === 0) {
      onFinishGame(roundWinnerName);
    }
    return () => clearTimeout(timer);
  }, [showRoundPopup, countdown, roundWinnerName]);

  return (
    <div className="fixed inset-0 w-screen h-screen flex flex-col items-center justify-center p-10 overflow-hidden relative z-0">
      
      {/* Background */}
      <div className="absolute inset-0 z-[-1] bg-cover bg-center bg-no-repeat blur-sm scale-110"
           style={{ backgroundImage: `url(${bgImage})` }} />
      <div className="absolute inset-0 z-[-1] bg-black/70" />
      
      {/* STATUS CENTER BAR */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 w-full">
         <div className="h-[220px] bg-black/20 backdrop-blur-sm border-y-2 border-cyan-500/20 flex items-center justify-center relative z-10">
            <h2 className="text-7xl font-black italic text-white/5 uppercase tracking-[1.5em] select-none">Engaging</h2>
         </div>
         
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center w-96 z-20 backdrop-blur-xl bg-black/50 p-6 rounded-2xl border-2 border-white/10 shadow-[0_0_50px_rgba(255,255,255,0.1)]">
           <motion.div 
             key={statusText}
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className={`text-4xl font-black italic uppercase tracking-tighter text-center mb-3 leading-none
               ${statusText === 'TARGET NEUTRALIZED' ? 'text-cyan-400 drop-shadow-[0_0_10px_#22d3ee]' :
                 statusText === 'SYSTEM BREACHED' ? 'text-red-500 drop-shadow-[0_0_10px_#ef4444]' :
                 'text-white'}
             `}>
             {statusText}
           </motion.div>
           <div className="text-yellow-500 font-mono text-base bg-black/60 px-4 py-1 rounded-full border border-yellow-500/30 shadow-md uppercase">Operation Status</div>
        </div>
      </div>

      {/* BATTLE FIELD */}
      <div className="w-full max-w-7xl flex flex-row items-center justify-between z-10 gap-32 relative">
        <div className="flex flex-col items-center gap-8">
          <div className="text-cyan-400 font-black italic tracking-widest bg-black/50 px-6 py-2 rounded-xl border-l-4 border-cyan-500 uppercase text-lg backdrop-blur-md">Pilot: Player</div>
          <motion.div 
            key={`p-${pIdx}`} 
            initial={{ x: -100, opacity: 0 }} 
            animate={{ 
                x: 0, opacity: 1,
                rotate: lastResult === 'BOT' ? [0, -5, 5, -5, 5, 0] : 0 
            }} 
            className="shadow-[0_0_80px_rgba(8,145,178,0.4)] rounded-3xl"
          >
             <Card type={playerDeck[pIdx]?.id} isFlipped={false} />
          </motion.div>
          <div className="w-64 h-3 bg-slate-900/80 rounded-full overflow-hidden border-2 border-cyan-500/40 p-[1px]">
             <motion.div animate={{ width: `${((10 - pIdx) / 10) * 100}%` }} className="h-full bg-cyan-500 shadow-[0_0_15px_#06b6d4]" />
          </div>
        </div>

        <div className="flex flex-col items-center gap-8">
          <div className="text-red-400 font-black italic tracking-widest bg-black/50 px-6 py-2 rounded-xl border-r-4 border-red-500 uppercase text-lg backdrop-blur-md">System: AI_BOT</div>
          <motion.div 
            key={`b-${bIdx}`} 
            initial={{ x: 100, opacity: 0 }} 
            animate={{ 
                x: 0, opacity: 1,
                rotate: lastResult === 'PLAYER' ? [0, 5, -5, 5, -5, 0] : 0 
            }} 
            className="shadow-[0_0_80px_rgba(239,68,68,0.4)] rounded-3xl"
          >
             <Card type={botDeck[bIdx]?.id} isFlipped={false} />
          </motion.div>
          <div className="w-64 h-3 bg-slate-900/80 rounded-full overflow-hidden border-2 border-red-500/40 p-[1px]">
             <motion.div animate={{ width: `${((10 - bIdx) / 10) * 100}%` }} className="h-full bg-red-600 shadow-[0_0_15px_#ef4444]" />
          </div>
        </div>
      </div>

      {/* POPUP RESULT */}
      <AnimatePresence>
        {showRoundPopup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/95 backdrop-blur-xl" />
            <motion.div 
              initial={{ scale: 0.8, opacity: 0, y: 50 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              className="relative bg-slate-950 border-2 border-white/10 p-12 rounded-[3rem] flex flex-col items-center max-w-sm w-full shadow-[0_0_100px_rgba(255,255,255,0.1)]"
            >
              <div className="text-slate-500 font-mono text-[10px] tracking-[0.5em] mb-4 uppercase italic">Data Stream Terminated</div>
              <h3 className="text-sm font-black text-white/30 uppercase tracking-widest mb-1">Round Winner</h3>
              <div className={`text-6xl font-black italic uppercase tracking-tighter mb-10 
                ${roundWinnerName === 'PLAYER' ? 'text-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.6)]' : 'text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.6)]'}`}>
                {roundWinnerName}
              </div>
              
              <div className="flex flex-col items-center">
                <div className="text-xs text-slate-500 uppercase tracking-widest mb-2 font-bold italic">Initializing Next Phase</div>
                <div className="text-7xl font-black italic text-yellow-500 tabular-nums">{countdown}</div>
              </div>
              
              <div className="mt-12 w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: "100%" }} 
                  animate={{ width: "0%" }} 
                  transition={{ duration: 3, ease: "linear" }}
                  className="h-full bg-cyan-500" 
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <div className="absolute bottom-6 w-full flex justify-between items-center px-16 z-10 opacity-60">
        <div className="bg-cyan-950/30 border-l-2 border-cyan-500 px-4 py-2 font-mono text-xs text-cyan-400">P_DECK: {10 - pIdx}</div>
        <div className="text-xs font-mono text-white/40 animate-pulse tracking-[0.5em]">BATTLE_SEQUENCE_ACTIVE</div>
        <div className="bg-red-950/30 border-r-2 border-red-500 px-4 py-2 font-mono text-xs text-red-400 text-right">B_DECK: {10 - bIdx}</div>
      </div>
    </div>
  );
}