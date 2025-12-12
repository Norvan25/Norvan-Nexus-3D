import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Mic, Activity } from 'lucide-react';

export default function InputPill() {
  const [text, setText] = useState('');
  const fullText = 'Ask Nexus...';
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (isTyping && text.length < fullText.length) {
      const timeout = setTimeout(() => {
        setText(fullText.slice(0, text.length + 1));
      }, 100);
      return () => clearTimeout(timeout);
    } else if (text.length === fullText.length) {
      const timeout = setTimeout(() => {
        setIsTyping(false);
        setTimeout(() => {
          setText('');
          setIsTyping(true);
        }, 2000);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [text, isTyping]);

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, type: 'spring', damping: 20 }}
      className="fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-1/2 transform -translate-x-1/2 w-[90%] max-w-[600px] h-14 z-50 flex items-center justify-between px-4 bg-[#0D1326]/80 backdrop-blur-xl rounded-full border border-white/10 shadow-[0_4px_20px_rgba(0,192,255,0.2)]"
    >
      {/* Plus Button */}
      <button className="p-2 md:p-2 rounded-full bg-white/10 active:bg-white/20 md:hover:bg-white/20 transition-colors border border-white/20 touch-manipulation">
        <Plus className="w-4 h-4 md:w-5 md:h-5 text-white" />
      </button>

      {/* Input Area */}
      <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
        <Activity className="w-4 h-4 md:w-5 md:h-5 text-cyan-400 animate-pulse flex-shrink-0" />
        <span className="text-white/70 text-sm md:text-lg font-light truncate">
          {text}
          {isTyping && text.length < fullText.length && (
            <span className="inline-block w-0.5 h-4 md:h-5 bg-cyan-400 ml-1 animate-pulse" />
          )}
        </span>
      </div>

      {/* Mic Button */}
      <button className="p-2 md:p-2 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 active:from-cyan-500/30 active:to-blue-500/30 md:hover:from-cyan-500/30 md:hover:to-blue-500/30 transition-colors border border-cyan-400/30 touch-manipulation">
        <Mic className="w-4 h-4 md:w-5 md:h-5 text-cyan-300" />
      </button>
    </motion.div>
  );
}
