import { motion } from 'framer-motion';

export default function BrandHeader() {
  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.2, type: 'spring', damping: 20 }}
      className="fixed top-4 left-4 md:top-6 md:left-6 z-50 scale-90 md:scale-100"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="flex items-center gap-3 px-4 md:px-5 py-2.5 md:py-3 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl">
        <img
          src="/icons/norvan-logo.png"
          alt="Norvan Logo"
          className="h-8 md:h-10 w-auto"
        />

        <span className="text-xl md:text-2xl font-light bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent tracking-wide">
          NEXUS
        </span>
      </div>
    </motion.div>
  );
}
