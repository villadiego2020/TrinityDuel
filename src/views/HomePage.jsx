export default function HomePage({ onStartGame, onOpenGuide }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-transparent relative z-20">
      {/* ส่วนหัวเกม */}
      <div className="mb-12 text-center">
        <h2 className="text-5xl md:text-7xl font-black italic text-yellow-500 tracking-widest uppercase animate-pulse">
          Main Menu
        </h2>
        <div className="h-1 w-48 bg-cyan-500 mx-auto mt-2 rounded-full shadow-[0_0_20px_#06b6d4]" />
      </div>

      {/* ปุ่มกดแบบแนวนอน */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* ปุ่มเริ่มเกม */}
        <button 
          onClick={onStartGame}
          className="group relative px-16 py-6 bg-cyan-600 hover:bg-cyan-500 rounded-2xl font-black text-xl transition-all shadow-[0_0_20px_rgba(8,145,178,0.4)] hover:scale-105 active:scale-95"
        >
          <span className="relative z-10 text-white uppercase italic tracking-wider">Start Duel (VS BOT)</span>
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity" />
        </button>

        {/* ปุ่ม GUIDE - เพิ่ม onClick และ Effect */}
        <button 
          onClick={onOpenGuide}
          className="group relative px-16 py-6 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-2xl font-black text-xl border border-white/5 transition-all hover:scale-105 active:scale-95 shadow-xl"
        >
          <span className="relative z-10 uppercase italic tracking-[0.2em]">Guide</span>
          <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity" />
        </button>
      </div>
    </div>
  );
}