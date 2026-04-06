export default function ResultPage({ winner, finalScore, onRestart }) {
  return (
    <div className="flex flex-col h-screen items-center justify-center bg-slate-900 text-white p-6">
      <h1 className="text-5xl font-black mb-2 text-yellow-500 italic uppercase tracking-tighter">
        {winner === 'PLAYER' ? '🏆 YOU WIN!' : '💀 BOT WINS!'}
      </h1>
      
      <div className="bg-slate-800 p-8 rounded-3xl border-2 border-slate-700 mb-10 text-center w-64 shadow-2xl">
        <p className="text-slate-400 uppercase text-xs font-bold tracking-widest mb-2">Final Match Score</p>
        <div className="text-4xl font-black flex justify-around items-center">
          <span className="text-blue-500">{finalScore.player}</span>
          <span className="text-slate-600">:</span>
          <span className="text-red-500">{finalScore.bot}</span>
        </div>
      </div>

      <button 
        onClick={onRestart}
        className="px-12 py-4 bg-white text-black font-black rounded-full hover:bg-yellow-400 transition-all uppercase tracking-tighter"
      >
        Back to Home
      </button>
    </div>
  );
}