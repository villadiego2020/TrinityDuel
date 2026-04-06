import { motion } from 'framer-motion';
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
      style={{ width: '70px', height: '120px' }} // ใช้ Inline Style บังคับไปเลย
      className={`
        !relative !rounded-lg !cursor-pointer !overflow-hidden !border-2 !flex-shrink-0
        ${isSelected ? '!border-cyan-400' : '!border-white/10'}
        ${disabled ? '!opacity-40 !grayscale !pointer-events-none' : 'hover:!border-white/40'}
        !bg-slate-900
      `}
    >
      {currentImage ? (
        <img 
          src={currentImage} 
          alt={type} 
          className="!w-full !h-full !object-fill !pointer-events-none" 
        />
      ) : (
        <div className="!w-full !h-full !bg-black/50" />
      )}
    </motion.div>
  );
}