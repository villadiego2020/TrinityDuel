import { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion"; // เพิ่ม AnimatePresence เข้ามาด้วย
import LandingPage from "./views/LandingPage";
import HomePage from "./views/HomePage";
import GamePage from "./views/GamePage";
import ResultPage from "./views/ResultPage";
import GuidePage from "./views/GuidePage";
import SettingsPage from "./views/SettingsPage";

// Assets
import bgmMain from "./assets/sounds/bgm_main.mp3";

function App() {
  const [currentScreen, setCurrentScreen] = useState("LANDING");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // ใช้ state เปิด/ปิด Overlay แทนเปลี่ยนหน้า
  const [matchScore, setMatchScore] = useState({ player: 0, bot: 0 });
  const [finalWinner, setFinalWinner] = useState(null);
  
  // --- 🔊 ระบบเสียง Master Volume ---
  const [volume, setVolume] = useState(0.5);
  const mainBgmRef = useRef(null);

  useEffect(() => {
    mainBgmRef.current = new Audio(bgmMain);
    mainBgmRef.current.loop = true;
    
    return () => {
      if (mainBgmRef.current) {
        mainBgmRef.current.pause();
        mainBgmRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mainBgmRef.current) return;

    mainBgmRef.current.volume = volume;

    // เพลง Main จะเล่นในหน้าเหล่านี้ (รวมถึงตอนเปิด Settings Overlay ด้วย)
    const mainScreens = ["HOME", "GUIDE", "GAME"];
    
    if (mainScreens.includes(currentScreen)) {
      mainBgmRef.current.play().catch(() => console.log("Waiting for user interaction..."));
    } else {
      mainBgmRef.current.pause();
    }
  }, [currentScreen, volume]);

  // --- ⚔️ ระบบจัดการจบเกม (BO3) ---
  const handleGameEnd = (roundWinner) => {
    const newScore = {
      ...matchScore,
      [roundWinner.toLowerCase()]: matchScore[roundWinner.toLowerCase()] + 1
    };
    setMatchScore(newScore);

    if (newScore.player === 2 || newScore.bot === 2) {
      setFinalWinner(newScore.player === 2 ? 'PLAYER' : 'BOT');
      setCurrentScreen("RESULT");
    } else {
      setCurrentScreen("HOME"); 
      setTimeout(() => {
        setCurrentScreen("GAME");
      }, 10); 
    }
  };

  return (
    <main className="fixed inset-0 w-screen h-screen bg-slate-950 flex items-center justify-center overflow-hidden m-0 p-0 font-sans text-white z-0">
      
      {/* เอฟเฟกต์ Scan line */}
      <div className="scanlines pointer-events-none absolute inset-0 z-50"></div>

      {/* ⚙️ ปุ่ม Settings ลอยตัว - เปลี่ยนเป็นสั่งเปิด/ปิด Overlay */}
      {["HOME", "GUIDE", "GAME"].includes(currentScreen) && (
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="fixed top-6 right-6 z-[100] bg-black/40 hover:bg-cyan-500/20 p-3 rounded-full border border-white/10 backdrop-blur-md transition-all group shadow-xl active:scale-90"
        >
          <span className="text-xl group-hover:rotate-90 transition-transform inline-block">⚙️</span>
        </button>
      )}

      {/* 🔊 SETTINGS OVERLAY (Real-time) */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <SettingsPage 
              volume={volume} 
              setVolume={setVolume} 
              onBack={() => setIsSettingsOpen(false)} 
            />
          </div>
        )}
      </AnimatePresence>

      {/* 🖥️ ส่วนแสดงผลหน้า View ต่างๆ (ไม่ Unmount ตอนเปิด Settings) */}
      <div className="w-full h-full flex items-center justify-center relative z-20">
        
        {currentScreen === "LANDING" && (
            <LandingPage onEnter={() => setCurrentScreen("HOME")} />
        )}

        {currentScreen === "HOME" && (
            <HomePage 
                onStartGame={() => {
                    setMatchScore({ player: 0, bot: 0 });
                    setCurrentScreen("GAME");
                }} 
                onOpenGuide={() => setCurrentScreen("GUIDE")}
            />
        )}

        {currentScreen === "GUIDE" && (
            <GuidePage onBack={() => setCurrentScreen("HOME")} />
        )}

        {currentScreen === "GAME" && (
            <GamePage onFinishSetup={handleGameEnd} globalVolume={volume} />
        )}

        {currentScreen === "RESULT" && (
          <ResultPage 
            winner={finalWinner} 
            finalScore={matchScore} 
            onRestart={() => {
              setMatchScore({ player: 0, bot: 0 });
              setCurrentScreen("HOME");
            }} 
          />
        )}
        
      </div>
    </main>
  );
}

export default App;