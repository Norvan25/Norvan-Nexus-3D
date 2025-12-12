import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { NodeData, GRAPH_DATA } from '../data/graphData';

interface HUDCardProps {
  node: NodeData | null;
  onClose: () => void;
}

export default function HUDCard({ node, onClose }: HUDCardProps) {
  if (!node) return null;

  const getDimensionColor = (): string => {
    if (node.group === 'DIMENSION') {
      return node.color || '#007FFF';
    }
    if (node.group === 'TOOL' && node.parent) {
      const parentNode = GRAPH_DATA.nodes.find(n => n.id === node.parent);
      return parentNode?.color || '#007FFF';
    }
    return '#007FFF';
  };

  const dimensionColor = getDimensionColor();

  const getBorderColor = () => {
    const colorMap: Record<string, string> = {
      '#007FFF': 'border-blue-500',
      '#7F4FC9': 'border-purple-500',
      '#F28500': 'border-orange-500',
      '#009E60': 'border-emerald-500',
      '#66D3FA': 'border-cyan-500',
    };
    return colorMap[dimensionColor] || 'border-blue-500';
  };

  const getTextColor = () => {
    const colorMap: Record<string, string> = {
      '#007FFF': 'text-blue-400',
      '#7F4FC9': 'text-purple-400',
      '#F28500': 'text-orange-400',
      '#009E60': 'text-emerald-400',
      '#66D3FA': 'text-cyan-400',
    };
    return colorMap[dimensionColor] || 'text-blue-400';
  };

  const getDropShadow = () => {
    const colorMap: Record<string, string> = {
      '#007FFF': 'drop-shadow-[0_0_10px_rgba(0,127,255,0.8)]',
      '#7F4FC9': 'drop-shadow-[0_0_10px_rgba(127,79,201,0.8)]',
      '#F28500': 'drop-shadow-[0_0_10px_rgba(242,133,0,0.8)]',
      '#009E60': 'drop-shadow-[0_0_10px_rgba(0,158,96,0.8)]',
      '#66D3FA': 'drop-shadow-[0_0_10px_rgba(102,211,250,0.8)]',
    };
    return colorMap[dimensionColor] || 'drop-shadow-[0_0_10px_rgba(0,127,255,0.8)]';
  };

  const parseLabel = (label: string) => {
    const prefix = label.slice(0, 3);
    const suffix = label.slice(3);
    return { prefix, suffix };
  };

  const { prefix, suffix } = parseLabel(node.label);

  return (
    <AnimatePresence>
      {/* Backdrop for mobile - tap to close, no blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/20 md:hidden pointer-events-auto z-[90]"
      />

      {/* Desktop HUD Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
        className="hidden md:block fixed top-20 right-10 w-96 pointer-events-auto z-50"
      >
        <div className={`relative rounded-xl border ${getBorderColor()} backdrop-blur-xl bg-[#0D1326]/90 shadow-2xl overflow-hidden`}>
          {/* Vertical Power Bar (for DIMENSION cards only) */}
          {node.group === 'DIMENSION' && (
            <div className="w-2 h-full absolute top-0 left-0" style={{ backgroundColor: dimensionColor }} />
          )}

          {/* Content Wrapper */}
          <div className="relative">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 active:bg-white/20 transition-colors border border-white/10 z-10"
            >
              <X className="w-4 h-4 text-white" />
            </button>

            {node.group === 'DIMENSION' ? (
              /* DIMENSION Layout */
              <div className="p-6 pl-8 text-left">
                {/* Header */}
                <div className="pr-10 mb-4">
                  <h2 className="text-3xl font-bold tracking-tight">
                    <span className="text-white font-semibold">{prefix}</span>
                    <span style={{ color: dimensionColor, textShadow: `0 0 10px ${dimensionColor}40` }} className="font-bold">{suffix}</span>
                  </h2>
                </div>

                {/* Tagline (Colored) */}
                {node.tagline && (
                  <p className="text-sm font-medium italic mb-3" style={{ color: dimensionColor }}>
                    {node.tagline}
                  </p>
                )}

                {/* Description */}
                {node.desc && (
                  <p className="text-sm text-gray-300 leading-relaxed mb-6">
                    {node.desc}
                  </p>
                )}

                {/* Tools List */}
                {node.toolsList && node.toolsList.length > 0 && (
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">
                      Available Tools
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {node.toolsList.map((toolId, idx) => {
                        const toolNode = GRAPH_DATA.nodes.find(n => n.id === toolId);
                        return (
                          <motion.span
                            key={toolId}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="px-2 py-1 rounded text-xs font-mono bg-white/5"
                            style={{
                              borderWidth: '1px',
                              borderColor: `${dimensionColor}40`,
                              color: dimensionColor
                            }}
                          >
                            • {toolNode?.label || toolId}
                          </motion.span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* NON-DIMENSION Layout */
              <>
                {/* Header */}
                <div className="relative p-6 pb-5 border-b border-white/10">
                  <div className="pr-10">
                    <h2 className="text-3xl font-bold tracking-tight">
                      <span className="text-white font-semibold">{prefix}</span>
                      <span className={`${getTextColor()} font-bold ${getDropShadow()}`}>{suffix}</span>
                    </h2>
                  </div>
                </div>

                {/* Body */}
                <div className="relative p-6 space-y-5">
                  {node.tagline && (
                    <p className="text-lg italic text-gray-200 leading-relaxed">
                      {node.tagline}
                    </p>
                  )}

                  {node.strengths && node.strengths.length > 0 && (
                    <div className="grid grid-cols-1 gap-3">
                      {node.strengths.map((strength, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-start gap-2 text-xs font-mono text-cyan-100/80"
                        >
                          <span className="text-yellow-400 flex-shrink-0">⚡</span>
                          <span>{strength}</span>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {node.desc && (
                    <p className="text-sm text-white/60 leading-relaxed pt-2 border-t border-white/10">
                      {node.desc}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Mobile Floating Modal */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 100,
          maxHeight: '60vh',
          overflowY: 'auto',
        }}
        className="md:hidden w-[90%] max-w-md pointer-events-auto"
      >
        <div className={`relative rounded-2xl border ${getBorderColor()} backdrop-blur-xl bg-[#0D1326]/95 shadow-2xl overflow-hidden`}>
          {/* Vertical Power Bar (for DIMENSION cards only) */}
          {node.group === 'DIMENSION' && (
            <div className="w-2 h-full absolute top-0 left-0" style={{ backgroundColor: dimensionColor }} />
          )}

          {/* Content Wrapper */}
          <div className="relative">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-4 rounded-lg bg-white/5 active:bg-white/20 transition-colors border border-white/10 z-10"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {node.group === 'DIMENSION' ? (
              /* DIMENSION Layout */
              <div className="p-5 pl-7 text-left">
                {/* Header */}
                <div className="pr-12 mb-3">
                  <h2 className="text-xl font-bold tracking-tight">
                    <span className="text-white font-semibold">{prefix}</span>
                    <span style={{ color: dimensionColor, textShadow: `0 0 10px ${dimensionColor}40` }} className="font-bold">{suffix}</span>
                  </h2>
                </div>

                {/* Tagline (Colored) */}
                {node.tagline && (
                  <p className="text-xs font-medium italic mb-3" style={{ color: dimensionColor }}>
                    {node.tagline}
                  </p>
                )}

                {/* Description */}
                {node.desc && (
                  <p className="text-xs text-gray-300 leading-relaxed mb-4">
                    {node.desc}
                  </p>
                )}

                {/* Tools List */}
                {node.toolsList && node.toolsList.length > 0 && (
                  <div>
                    <div className="text-[9px] uppercase tracking-widest text-gray-500 font-bold mb-1.5">
                      Available Tools
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {node.toolsList.map((toolId, idx) => {
                        const toolNode = GRAPH_DATA.nodes.find(n => n.id === toolId);
                        return (
                          <motion.span
                            key={toolId}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/5"
                            style={{
                              borderWidth: '1px',
                              borderColor: `${dimensionColor}40`,
                              color: dimensionColor
                            }}
                          >
                            • {toolNode?.label || toolId}
                          </motion.span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* NON-DIMENSION Layout */
              <>
                {/* Header */}
                <div className="relative p-5 pb-3 border-b border-white/10">
                  <div className="pr-12">
                    <h2 className="text-xl font-bold tracking-tight">
                      <span className="text-white font-semibold">{prefix}</span>
                      <span className={`${getTextColor()} font-bold ${getDropShadow()}`}>{suffix}</span>
                    </h2>
                  </div>
                </div>

                {/* Body */}
                <div className="relative p-5 space-y-3">
                  {node.tagline && (
                    <p className="text-sm italic text-gray-200 leading-relaxed">
                      {node.tagline}
                    </p>
                  )}

                  {node.strengths && node.strengths.length > 0 && (
                    <div className="grid grid-cols-1 gap-2">
                      {node.strengths.map((strength, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-start gap-1.5 text-[10px] font-mono text-cyan-100/80"
                        >
                          <span className="text-yellow-400 flex-shrink-0">⚡</span>
                          <span>{strength}</span>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {node.desc && (
                    <p className="text-xs text-white/60 leading-relaxed pt-2.5 border-t border-white/10">
                      {node.desc}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
