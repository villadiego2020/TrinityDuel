import { useState, useEffect, useRef } from "react";
import LandingPage from "./views/LandingPage";
import HomePage from "./views/HomePage";
import GamePage from "./views/GamePage";
import ResultPage from "./views/ResultPage";
import GuidePage from "./views/GuidePage";

// Import BGM หลัก (เช็ค path มึงให้ดีนะ)
import bgmMain from "./assets/sounds/bgm_main.mp3";

function App() {
  const [currentScreen, setCurrentScreen] = useState("LANDING");
  const [matchScore, setMatchScore] = useState({ player: 0, bot: 0 });
  const [finalWinner, setFinalWinner] = useState(null);
  
  // ใช้ useRef เพื่อไม่ให้ Audio object ถูกสร้างใหม่ทุกครั้งที่ Re-render
  const mainBgmRef = useRef(null);

  // --- 1. ระบบจัดการเพลงหลัก (Global BGM) ---
  useEffect(() => {
    mainBgmRef.current = new Audio(bgmMain);
    mainBgmRef.current.loop = true;
    mainBgmRef.current.volume = 0.3;

    return () => {
      if (mainBgmRef.current) {
        mainBgmRef.current.pause();
        mainBgmRef.current = null;
      }
    };
  }, []);

  // เช็คการเปลี่ยนหน้าเพื่อ เล่น/หยุด เพลง
  useEffect(() => {
    if (!mainBgmRef.current) return;

    // รายชื่อหน้าที่ต้องการให้เพลง Main เล่นต่อเนื่อง
    const mainScreens = ["HOME", "GUIDE", "GAME"];
    
    if (mainScreens.includes(currentScreen)) {
      // Browser จะยอมให้ play() ก็ต่อเมื่อ User เคยคลิกหน้าจอแล้วอย่างน้อย 1 ครั้ง
      mainBgmRef.current.play().catch(() => console.log("Waiting for user interaction..."));
    } else {
      mainBgmRef.current.pause();
    }
  }, [currentScreen]);

  // --- 2. ระบบจัดการจบเกม (BO3) ---
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
      // รีเซ็ตหน้า Game เพื่อเริ่มรอบใหม่
      setCurrentScreen("HOME"); 
      setTimeout(() => {
        setCurrentScreen("GAME");
      }, 10); 
    }
  };

  return (
    <main className="fixed inset-0 w-screen h-screen bg-slate-950 flex items-center justify-center overflow-hidden m-0 p-0 font-sans text-white z-0">
      
      {/* เอฟเฟกต์ Scan line */}
      <div className="scanlines"></div>

      {/* คะแนน Match Score ( HUD ) */}
      {currentScreen === "GAME" && (
        <div className="fixed top-6 z-50 bg-black/60 px-8 py-2 rounded-full border border-white/10 backdrop-blur-md flex items-center gap-6 shadow-2xl scale-90 md:scale-100">
           <div className="flex flex-col items-center">
             <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Player</span>
             <span className="text-cyan-400 text-2xl font-black">{matchScore.player}</span>
           </div>
           <div className="flex flex-col items-center opacity-30">
             <span className="text-[8px] uppercase font-black">BO3</span>
             <span className="text-white text-xl font-light">VS</span>
           </div>
           <div className="flex flex-col items-center">
             <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Bot</span>
             <span className="text-red-400 text-2xl font-black">{matchScore.bot}</span>
           </div>
        </div>
      )}

      {/* เรียกหน้า View ต่างๆ */}
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
            <GamePage onFinishSetup={handleGameEnd} />
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