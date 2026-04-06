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
    // ใช้ w-full h-screen และ flex items-center justify-center เพื่อบังคับทุกอย่างมาไว้ตรงกลาง
    <main className="w-full h-screen bg-[#020617] flex items-center justify-center m-0 p-0 overflow-hidden">
      {currentScreen === "LANDING" && <LandingPage onEnter={() => setCurrentScreen("HOME")} />}
      {currentScreen === "HOME" && <HomePage onStartGame={() => setCurrentScreen("GAME")} />}
      {currentScreen === "GAME" && <GamePage onFinishSetup={handleGameEnd} />}
      {currentScreen === "RESULT" && <ResultPage winner={finalWinner} onRestart={() => {
        setMatchScore({ player: 0, bot: 0 });
        setCurrentScreen("HOME");
      }} />}
    </main>
  );
}

export default App;