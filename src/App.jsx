import { useState } from "react";
import LandingPage from "./views/LandingPage";
import HomePage from "./views/HomePage";
import GamePage from "./views/GamePage";
import ResultPage from "./views/ResultPage";

function App() {
  const [currentScreen, setCurrentScreen] = useState("LANDING");
  const [matchScore, setMatchScore] = useState({ player: 0, bot: 0 });
  const [finalWinner, setFinalWinner] = useState(null);

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
    }
  };

  return (
    // เปลี่ยนbgตรงนี้เป็น bg-neural เพื่อใช้พื้นหลังแบบโครงข่ายประสาท
    <main className="fixed inset-0 w-screen h-screen bg-neural flex items-center justify-center overflow-hidden m-0 p-0 font-sans text-white z-0">
      
      {/* เอฟเฟกต์ Scan line (ใส่เพิ่ม) */}
      <div className="scanlines"></div>

      {/* คะแนน Match Score ( HUD ) */}
      {currentScreen === "GAME" && (
        <div className="fixed top-6 z-50 bg-black/60 px-8 py-2 rounded-full border border-white/10 backdrop-blur-md flex items-center gap-6 shadow-2xl">
           <div className="flex flex-col items-center">
             <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Player</span>
             <span className="text-cyan-400 text-2xl font-black">{matchScore.player}</span>
           </div>
           <span className="text-white/20 text-2xl font-light">vs</span>
           <div className="flex flex-col items-center">
             <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Bot</span>
             <span className="text-red-400 text-2xl font-black">{matchScore.bot}</span>
           </div>
        </div>
      )}

      {/* เรียกหน้าเมนูต่างๆ (อยู่เหนือ Scan line นิดหน่อย) */}
      <div className="w-full h-full flex items-center justify-center relative z-20">
        {currentScreen === "LANDING" && <LandingPage onEnter={() => setCurrentScreen("HOME")} />}
        {currentScreen === "HOME" && <HomePage onStartGame={() => setCurrentScreen("GAME")} />}
        {currentScreen === "GAME" && <GamePage onFinishSetup={handleGameEnd} />}
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