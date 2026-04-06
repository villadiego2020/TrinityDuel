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
    // 1. อัปเดตคะแนนรอบ
    const newScore = {
      ...matchScore,
      [roundWinner.toLowerCase()]: matchScore[roundWinner.toLowerCase()] + 1
    };
    setMatchScore(newScore);

    // 2. เช็คว่าใครชนะครบ 2 ใน 3 หรือยัง
    if (newScore.player === 2 || newScore.bot === 2) {
      setFinalWinner(newScore.player === 2 ? 'PLAYER' : 'BOT');
      setCurrentScreen("RESULT");
    } else {
      // ถ้ายังไม่ครบ 2 ให้กลับไปหน้า Game เพื่อจัด Deck ใหม่ (รอบถัดไป)
      // เคล็ดลับ: เราจะ Force Remount GamePage เพื่อรีเซ็ตค่าข้างใน
      setCurrentScreen("HOME"); 
      alert(`Round Over! ${roundWinner} won this round. Ready for next?`);
      setCurrentScreen("GAME");
    }
  };

  const restartGame = () => {
    setMatchScore({ player: 0, bot: 0 });
    setFinalWinner(null);
    setCurrentScreen("HOME");
  };

  return (
    <div className="min-h-screen bg-slate-900 overflow-hidden">
      {/* ส่วนแสดงคะแนน BO3 ด้านบน (โชว์เฉพาะหน้าเกม) */}
      {currentScreen === "GAME" && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-black/50 px-6 py-2 rounded-full border border-white/10 backdrop-blur-md">
          <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-[0.2em] mb-1">BO3 Match</p>
          <div className="flex gap-4 font-black text-xl">
             <span className={matchScore.player > 0 ? "text-blue-400" : "text-slate-600"}>P: {matchScore.player}</span>
             <span className="text-white/20">|</span>
             <span className={matchScore.bot > 0 ? "text-red-400" : "text-slate-600"}>B: {matchScore.bot}</span>
          </div>
        </div>
      )}

      {currentScreen === "LANDING" && (
        <LandingPage onEnter={() => setCurrentScreen("HOME")} />
      )}

      {currentScreen === "HOME" && (
        <HomePage onStartGame={() => setCurrentScreen("GAME")} />
      )}

      {currentScreen === "GAME" && (
        <GamePage key={`${matchScore.player}-${matchScore.bot}`} onFinishSetup={handleGameEnd} />
      )}

      {currentScreen === "RESULT" && (
        <ResultPage 
          winner={finalWinner} 
          finalScore={matchScore} 
          onRestart={restartGame} 
        />
      )}
    </div>
  );
}

export default App;