import bgmMain from "../assets/sounds/bgm_main.mp3";
import sfxClick from "../assets/sounds/sfx_click.mp3";
import { useEffect } from "react";

export default function HomePage({ onStartGame, onOpenGuide }) {
  const playClick = () => new Audio(sfxClick).play();

  useEffect(() => {
    const bgm = new Audio(bgmMain);
    bgm.loop = true;
    bgm.volume = 0.3;
    bgm.play().catch(() => console.log("Audio blocked"));
    return () => bgm.pause(); // หยุดเพลงเมื่อเปลี่ยนหน้า
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-transparent relative z-20">
      <div className="mb-12 text-center">
        <h2 className="text-5xl md:text-7xl font-black italic text-yellow-500 tracking-widest uppercase animate-pulse">Main Menu</h2>
        <div className="h-1 w-48 bg-cyan-500 mx-auto mt-2 rounded-full shadow-[0_0_20px_#06b6d4]" />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <button 
          onClick={() => { playClick(); onStartGame(); }}
          className="group relative px-16 py-6 bg-cyan-600 hover:bg-cyan-500 rounded-2xl font-black text-xl transition-all shadow-[0_0_20px_rgba(8,145,178,0.4)]"
        >
          <span className="relative z-10 text-white uppercase italic tracking-wider">Start Duel</span>
        </button>

        <button 
          onClick={() => { playClick(); onOpenGuide(); }}
          className="group relative px-16 py-6 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl font-black text-xl border border-white/5 transition-all"
        >
          <span className="relative z-10 uppercase italic tracking-[0.2em]">Guide</span>
        </button>
      </div>
    </div>
  );
}