export default function HomePage({ onStartGame }) {
  return (
    <div className="flex flex-col h-screen items-center justify-center bg-slate-900 text-white">
      <h2 className="text-3xl mb-12 font-bold text-yellow-500">MAIN MENU</h2>
      <div className="flex flex-col gap-4">
        <button 
          onClick={onStartGame}
          className="px-12 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-all"
        >
          START GAME (BOT)
        </button>
        <button className="px-12 py-4 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold">
          HOW TO PLAY
        </button>
      </div>
    </div>
  );
}