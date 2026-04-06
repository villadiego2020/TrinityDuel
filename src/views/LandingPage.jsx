export default function LandingPage({ onEnter }) {
  return (
    <div 
      className="w-full h-full flex flex-col items-center justify-center cursor-pointer bg-[#020617] transition-all duration-500 hover:bg-[#03081d]"
      onClick={onEnter}
    >
      <h1 className="text-7xl font-black text-white tracking-tighter italic uppercase animate-pulse">
        TRINITY <span className="text-cyan-400">DUEL</span>
      </h1>
      <p className="mt-6 text-slate-500 font-bold tracking-[0.3em] uppercase text-sm">
        — Click to Initiate —
      </p>
      
      {/* ตกแต่งเพิ่มให้ดูเหมือนเกมจริงๆ */}
      <div className="absolute bottom-10 text-[10px] text-slate-700 font-mono">
        SYSTEM READY // NEURAL LINK STABLE
      </div>
    </div>
  );
}