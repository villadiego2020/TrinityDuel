import { motion } from 'framer-motion';

// Import รูปภาพจาก assets
import hammerImg from '../../assets/HammerCard.png';
import scissorsImg from '../../assets/ScissorsCard.png';
import paperImg from '../../assets/PaperCard.png';
import backImg from '../../assets/BackCard.png';

export default function Card({ type, onClick, disabled, isSelected, isFlipped = false }) {
  
  const cardImages = {
    ROCK: hammerImg,
    SCISSORS: scissorsImg,
    PAPER: paperImg,
    BACK: backImg
  };

  const currentImage = isFlipped ? cardImages.BACK : cardImages[type];

  return (
    <motion.div
      layout
      whileHover={!disabled ? { y: -5, scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={onClick}
      // บังคับขนาดให้เล็กลงที่นี่ (w-20 = 80px, h-40 = 160px)
      className={`
        relative w-20 h-40 rounded-lg cursor-pointer overflow-hidden
        transition-all duration-300 border
        ${isSelected ? 'ring-2 ring-yellow-400 z-20 border-white' : 'border-white/10'}
        ${disabled ? 'opacity-50 grayscale-[0.5]' : 'hover:border-white/50'}
      `}
    >
      {currentImage ? (
        <img 
          src={currentImage} 
          alt={type} 
          // ใช้ w-full h-full และ object-fill เพื่อบังคับภาพให้ลงมาอยู่ในกรอบ 80x160
          className="w-full h-full object-fill select-none pointer-events-none" 
          draggable="false"
        />
      ) : (
        <div className="w-full h-full bg-slate-800 flex items-center justify-center text-[10px] text-slate-500 font-bold uppercase italic">
          Empty
        </div>
      )}

      {/* แสงเงาสะท้อนหน้าการ์ดแบบจางๆ */}
      {!disabled && (
        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity" />
      )}
    </motion.div>
  );
}