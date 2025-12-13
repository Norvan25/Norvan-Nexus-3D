import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Mic, MessageSquare, Rocket } from 'lucide-react';

interface ButtonSectionProps {
  icon: React.ReactNode;
  hints: string[];
  onClick?: () => void;
  isLast?: boolean;
}

const ButtonSection = ({ icon, hints, onClick, isLast }: ButtonSectionProps) => {
  const [currentHintIndex, setCurrentHintIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHintIndex((prev) => (prev + 1) % hints.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [hints.length]);

  return (
    <button
      onClick={onClick}
      className={`group relative flex-1 px-2 md:px-6 py-3 md:py-3.5
                 hover:bg-cyan-500/10 transition-all duration-300 ease-out
                 active:scale-95 ${!isLast ? 'border-r border-cyan-400/20' : ''}`}
    >
      <div className="flex items-center justify-center gap-1.5 md:gap-3">
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="text-cyan-400 flex-shrink-0"
        >
          {icon}
        </motion.div>

        <div className="relative h-5 md:h-6 w-16 md:w-32 overflow-hidden">
          {hints.map((hint, index) => (
            <motion.span
              key={hint}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: currentHintIndex === index ? 1 : 0,
                y: currentHintIndex === index ? 0 : -20,
              }}
              transition={{ duration: 0.5 }}
              className="absolute left-0 top-0 text-xs md:text-sm font-medium text-cyan-100 whitespace-nowrap"
            >
              {hint}
            </motion.span>
          ))}
        </div>
      </div>
    </button>
  );
};

const ActionButtons = () => {
  const talkHints = [
    'Voice mode',
    'Speak now',
    'Talk to AI',
    'Voice chat',
  ];

  const chatHints = [
    'Text chat',
    'Type here',
    'Quick help',
    'Message AI',
  ];

  const deployHints = [
    'Launch',
    'Go live',
    'Deploy now',
    'Push prod',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.8 }}
      className="absolute bottom-6 md:bottom-8 left-0 right-0 z-20 flex justify-center px-2"
    >
      <div className="relative bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-cyan-500/10
                      border border-cyan-400/30 hover:border-cyan-400/50
                      rounded-full backdrop-blur-md
                      shadow-lg hover:shadow-cyan-500/20
                      transition-all duration-300 ease-out
                      overflow-hidden
                      w-full max-w-md md:max-w-2xl">
        {/* Animated glow effect */}
        <motion.div
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 2,
            ease: 'easeInOut',
          }}
          className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent pointer-events-none"
        />

        <div className="relative flex items-center divide-x divide-cyan-400/20">
          <ButtonSection
            icon={<Mic size={18} className="md:w-5 md:h-5" />}
            hints={talkHints}
            onClick={() => console.log('Talk to Nexus clicked')}
          />

          <ButtonSection
            icon={<MessageSquare size={18} className="md:w-5 md:h-5" />}
            hints={chatHints}
            onClick={() => console.log('Chat to Nexus clicked')}
          />

          <ButtonSection
            icon={<Rocket size={18} className="md:w-5 md:h-5" />}
            hints={deployHints}
            onClick={() => console.log('Deploy clicked')}
            isLast
          />
        </div>
      </div>
    </motion.div>
  );
};

export default ActionButtons;
