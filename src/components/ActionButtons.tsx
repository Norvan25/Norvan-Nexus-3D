import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Mic, MessageSquare, Rocket } from 'lucide-react';

interface AnimatedButtonProps {
  icon: React.ReactNode;
  hints: string[];
  onClick?: () => void;
  delay?: number;
}

const AnimatedButton = ({ icon, hints, onClick, delay = 0 }: AnimatedButtonProps) => {
  const [currentHintIndex, setCurrentHintIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHintIndex((prev) => (prev + 1) % hints.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [hints.length]);

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      onClick={onClick}
      className="group relative px-6 py-3.5 bg-gradient-to-r from-cyan-500/10 to-blue-500/10
                 hover:from-cyan-500/20 hover:to-blue-500/20
                 border border-cyan-400/30 hover:border-cyan-400/60
                 rounded-full backdrop-blur-sm
                 transition-all duration-300 ease-out
                 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20
                 active:scale-95"
    >
      <div className="flex items-center gap-3">
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="text-cyan-400"
        >
          {icon}
        </motion.div>

        <div className="relative h-6 w-40 overflow-hidden">
          {hints.map((hint, index) => (
            <motion.span
              key={hint}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: currentHintIndex === index ? 1 : 0,
                y: currentHintIndex === index ? 0 : -20,
              }}
              transition={{ duration: 0.5 }}
              className="absolute left-0 top-0 text-sm font-medium text-cyan-100 whitespace-nowrap"
            >
              {hint}
            </motion.span>
          ))}
        </div>

        <motion.div
          animate={{ x: [0, 3, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
          className="text-cyan-400/50 group-hover:text-cyan-400/80 transition-colors"
        >
          →
        </motion.div>
      </div>
    </motion.button>
  );
};

const ActionButtons = () => {
  const talkHints = [
    'Voice commands',
    'Speak to AI assistant',
    'Natural conversation',
    'Hands-free control',
  ];

  const chatHints = [
    'Text messaging',
    'Quick questions',
    'Get instant help',
    'Type your queries',
  ];

  const deployHints = [
    'Launch your project',
    'Push to production',
    'Go live now',
    'Deploy instantly',
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.8 }}
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
    >
      <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
        <AnimatedButton
          icon={<Mic size={20} />}
          hints={talkHints}
          delay={1.3}
          onClick={() => console.log('Talk to Nexus clicked')}
        />

        <AnimatedButton
          icon={<MessageSquare size={20} />}
          hints={chatHints}
          delay={1.5}
          onClick={() => console.log('Chat to Nexus clicked')}
        />

        <AnimatedButton
          icon={<Rocket size={20} />}
          hints={deployHints}
          delay={1.7}
          onClick={() => console.log('Deploy clicked')}
        />
      </div>
    </motion.div>
  );
};

export default ActionButtons;
