import { motion } from 'framer-motion';

export default function BrandHeader() {
  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.2, type: 'spring', damping: 20 }}
      className="fixed top-4 left-4 md:top-6 md:left-6 z-50"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <img
        src="/icons/norvan-logo.png"
        alt="Norvan Logo"
        className="h-10 md:h-12 w-auto"
        style={{
          filter: 'drop-shadow(0 0 12px rgba(34, 211, 238, 0.4)) drop-shadow(0 0 24px rgba(96, 165, 250, 0.3)) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
        }}
      />
    </motion.div>
  );
}
