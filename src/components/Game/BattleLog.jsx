// components/Game/BattleLog.jsx
import { motion, AnimatePresence } from 'framer-motion';

export const BattleLog = ({ logs }) => {
  return (
    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-48 hidden lg:flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {logs.slice(-5).map((log, i) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="text-[10px] font-mono text-cyan-400/60 bg-cyan-950/20 border-l-2 border-cyan-500/50 p-2 backdrop-blur-sm"
          >
            <span className="text-cyan-500 mr-2">[{log.time}]</span>
            {log.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};