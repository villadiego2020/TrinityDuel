export default function HomePage({ onStartGame }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-transparent">
      {/* ส่วนหัวเกม */}
      <div className="mb-12 text-center">
        <h2 className="text-5xl font-black italic text-yellow-500 tracking-widest uppercase animate-bounce">
          Main Menu
        </h2>
        <div className="h-1 w-32 bg-cyan-500 mx-auto mt-2 rounded-full shadow-[0_0_15px_#06b6d4]" />
      </div>

      {/* ปุ่มกดแบบแนวนอนสวยๆ */}
      <div className="flex flex-row gap-6">
        <button 
          onClick={onStartGame}
          className="group relative px-16 py-6 bg-cyan-600 hover:bg-cyan-500 rounded-2xl font-black text-xl transition-all shadow-[0_0_20px_rgba(8,145,178,0.3)] hover:scale-105 active:scale-95"
        >
          <span className="relative z-10 text-white uppercase italic">Start Duel (VS BOT)</span>
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity" />
        </button>

        <button className="px-16 py-6 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl font-black text-xl border border-white/5 transition-all">
          OPERATIONS MANUAL
        </button>
      </div>

      {/* ตกแต่งข้างล่าง */}
      <div className="mt-20 flex gap-10 opacity-20">
        <div className="text-[10px] font-mono tracking-tighter">ENCRYPTION: AES-256</div>
        <div className="text-[10px] font-mono tracking-tighter">CONNECTION: SECURE</div>
      </div>
    </div>
  );
}