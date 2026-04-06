import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import hammerImg from '../../assets/HammerCard.png';
import scissorsImg from '../../assets/ScissorsCard.png';
import paperImg from '../../assets/PaperCard.png';
import backImg from '../../assets/BackCard.png';

// --- Import รูปชุด _small เพิ่มตรงนี้ ---
import hammerSmallImg from '../../assets/HammerCard_small.png';
import scissorsSmallImg from '../../assets/ScissorsCard_small.png';
import paperSmallImg from '../../assets/PaperCard_small.png';

export default function Card({ type, onClick, disabled, isSelected, isFlipped = false }) {
  const [isHovered, setIsHovered] = useState(false);

  const cardImages = {
    ROCK: hammerImg,
    SCISSORS: scissorsImg,
    PAPER: paperImg,
    BACK: backImg
  };

  // --- สร้าง Object สำหรับเก็บรูปชุดเล็ก ---
  const smallCardImages = {
    ROCK: hammerSmallImg,
    SCISSORS: scissorsSmallImg,
    PAPER: paperSmallImg
  };

  const cardDetails = {
    ROCK: { label: 'ROCK', color: 'text-red-500', beats: 'SCISSORS', desc: 'UNSTOPPABLE FORCE' },
    PAPER: { label: 'PAPER', color: 'text-blue-400', beats: 'ROCK', desc: 'TACTICAL NEURAL WRAP' },
    SCISSORS: { label: 'SCISSORS', color: 'text-yellow-400', beats: 'PAPER', desc: 'PRECISION QUANTUM CUT' }
  };

  const currentImage = isFlipped ? cardImages.BACK : cardImages[type];
  
  // --- Logic เลือกรูปที่จะโชว์ใน Pop-up (ถ้าหารูป _small ไม่เจอ ให้ถอยไปใช้รูปปกติกันพัง) ---
  const previewImage = smallCardImages[type] || currentImage;
  
  const info = cardDetails[type] || {};

  return (
    <div className="relative group">
      {/* ตัวการ์ดปกติ */}
      <motion.div
        layout
        onMouseEnter={() => !disabled && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={!disabled ? { y: -10, scale: 1.1, zIndex: 100 } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
        onClick={onClick}
        style={{ width: '75px', height: '125px' }}
        className={`
          relative rounded-xl cursor-pointer overflow-hidden border-2 flex-shrink-0 transition-colors duration-300
          ${isSelected ? 'border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.7)]' : 'border-white/20'}
          ${disabled ? 'opacity-40 grayscale pointer-events-none' : 'hover:border-white/60'}
          bg-slate-900 shadow-xl
        `}
      >
        {currentImage ? (
          <img src={currentImage} alt={type} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-slate-500 italic">
            {type}
          </div>
        )}

        {!disabled && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}
      </motion.div>

      {/* --- Pop-up รายละเอียดตอน Hover --- */}
      <AnimatePresence>
        {isHovered && !isFlipped && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.5 }}
            style={{ 
              bottom: '110%', 
              transformOrigin: 'bottom center',
              left: '50%',
              translateX: '-50%'
            }}
            className="absolute w-48 bg-black/95 border-2 border-cyan-500/50 p-3 rounded-2xl backdrop-blur-xl z-[200] pointer-events-none shadow-[0_0_50px_rgba(0,0,0,0.9)]"
          >
            {/* รูปขยายใหญ่ที่เรียกจากชุด _small */}
            <div className="w-full h-32 rounded-xl overflow-hidden border border-white/10 mb-2 bg-slate-800">
              {previewImage ? (
                <img src={previewImage} alt={`${type} preview`} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">{type}</div>
              )}
            </div>

            <div className="flex flex-col items-center gap-1 text-center">
              <div className={`text-xl font-black uppercase italic tracking-tighter ${info.color}`}>
                {info.label}
              </div>
              <div className="text-[10px] text-white/80 leading-snug font-medium px-1">
                {info.desc}
              </div>
              
              <div className="mt-2 pt-1 border-t border-white/10 flex flex-col items-center w-full">
                <span className="text-[8px] text-slate-500 uppercase font-black tracking-widest">TACTICAL ADVANTAGE:</span>
                <span className="text-xs text-green-400 font-black italic uppercase">BEATS {info.beats}</span>
              </div>
            </div>
            
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-black border-r-2 border-b-2 border-cyan-500/50 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}