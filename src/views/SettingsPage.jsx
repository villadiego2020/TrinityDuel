import { motion } from "framer-motion";

export default function SettingsPage({ volume, setVolume, onBack }) {
  return (
    <>
      {/* คลิกพื้นที่ว่างเพื่อปิด */}
      <div className="absolute inset-0" onClick={onBack} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()} // กันกดโดนกล่องแล้วปิด
        className="relative flex flex-col items-center justify-center w-full max-w-md bg-slate-900 border border-cyan-500/30 p-10 rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.8)]"
      >
        <h2 className="text-4xl font-black italic text-cyan-400 mb-10 tracking-widest uppercase">Audio Settings</h2>
        
        <div className="w-full space-y-8">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-end font-mono">
              <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Master Volume</label>
              <span className="text-xl text-cyan-400">{(volume * 100).toFixed(0)}%</span>
            </div>
            
            <input 
              type="range" min="0" max="1" step="0.01" 
              value={volume} 
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>
        </div>

        <button 
          onClick={onBack}
          className="mt-12 w-full py-4 bg-cyan-600 hover:bg-cyan-500 rounded-2xl font-black italic uppercase transition-all shadow-[0_0_20px_rgba(8,145,178,0.3)]"
        >
          Resume Game
        </button>
      </motion.div>
    </>
  );
}