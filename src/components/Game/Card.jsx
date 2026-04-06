import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import hammerImg from '../../assets/HammerCard.png';
import scissorsImg from '../../assets/ScissorsCard.png';
import paperImg from '../../assets/PaperCard.png';
import backImg from '../../assets/BackCard.png';

// --- Import รูปชุด _small ---
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
  const previewImage = smallCardImages[type] || currentImage;
  const info = cardDetails[type] || {};

  return (
    <div className="relative group w-full h-full">
      {/* ตัวการ์ดปกติ: 
         - ลบ style width/height ออกเพื่อให้ยืดตาม Parent (Grid)
         - เพิ่ม aspect-[3/5] เพื่อรักษาทรงการ์ด
      */}
      <motion.div
        layout
        onMouseEnter={() => !disabled && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={!disabled ? { y: -5, scale: 1.05, zIndex: 50 } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
        onClick={onClick}
        className={`
          relative w-full aspect-[3/5] rounded-lg md:rounded-xl cursor-pointer overflow-hidden border-[1px] md:border-2 transition-all duration-300
          ${isSelected ? 'border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.6)]' : 'border-white/10'}
          ${disabled ? 'opacity-40 grayscale pointer-events-none' : 'hover:border-white/40'}
          bg-slate-900 shadow-lg flex-shrink-0
        `}
      >
        {currentImage ? (
          <img src={currentImage} alt={type} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[8px] md:text-[10px] font-bold text-slate-500 italic">
            {type}
          </div>
        )}

        {!disabled && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}
      </motion.div>

    {/* --- Pop-up รายละเอียดตอน Hover (เวอร์ชันตัดรูปออกเพื่อกันทะลุจอ) --- */}
      <AnimatePresence>
        {isHovered && !isFlipped && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.9 }}
            style={{ 
              bottom: '110%', // ขยับขึ้นมาเหนือตัวการ์ดเล็กน้อย
              left: '50%',
              translateX: '-50%'
            }}
            // ปรับความกว้างให้กะทัดรัด (w-32 บนมือถือ, w-40 บนจอใหญ่)
            className="absolute w-32 md:w-40 bg-black/95 border border-cyan-500/50 p-2 md:p-3 rounded-xl backdrop-blur-xl z-[200] pointer-events-none shadow-2xl"
          >
            {/* ❌ ตัดส่วน <div className="w-full h-32..."> ที่โชว์รูปภาพออกไปแล้ว */}

            <div className="flex flex-col items-center gap-0.5 text-center">
              {/* ชื่อการ์ด: ปรับให้เล็กลงแต่ยังอ่านง่าย */}
              <div className={`text-sm md:text-lg font-black uppercase italic tracking-tight ${info.color}`}>
                {info.label}
              </div>
              
              {/* คำอธิบาย: เหลือแค่บรรทัดเดียวสั้นๆ หรือตัดออกถ้าจอเล็กมาก */}
              <div className="hidden md:block text-[9px] text-white/70 leading-tight font-medium px-1 mb-1">
                {info.desc}
              </div>
              
              {/* Tactical Advantage: ส่วนสำคัญที่สุดที่ต้องโชว์ */}
              <div className="mt-1 pt-1 border-t border-white/10 flex flex-col items-center w-full">
                <span className="text-[7px] text-slate-500 uppercase font-black tracking-[0.2em]">BEATS</span>
                <span className="text-[10px] md:text-xs text-green-400 font-black italic uppercase">
                   {info.beats}
                </span>
              </div>
            </div>
            
            {/* ติ่งสามเหลี่ยมด้านล่าง */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black border-r border-b border-cyan-500/50 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}