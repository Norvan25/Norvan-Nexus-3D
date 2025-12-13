import { useState } from 'react';
import NorvanGraph from './components/NorvanGraph';
import HUDCard from './components/HUDCard';
import BrandHeader from './components/BrandHeader';
import { NodeData } from './data/graphData';
import { motion } from 'framer-motion';

function App() {
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);

  const handleNodeClick = (node: NodeData) => {
    setSelectedNode(node);
  };

  const handleCloseHUD = () => {
    setSelectedNode(null);
  };

  return (
    <div className="relative w-screen h-[100dvh] overflow-hidden bg-[#020410]">
      {/* Subtle nebula fog effect */}
      <div className="absolute inset-0 bg-gradient-radial from-blue-950/10 via-transparent to-transparent pointer-events-none" />

      {/* Brand Header */}
      <BrandHeader />

      {/* Main Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="absolute top-20 md:top-24 left-0 right-0 z-10 flex flex-col items-center text-center px-4"
      >
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-2" style={{ textShadow: '0 0 20px rgba(255, 255, 255, 0.5), 0 0 40px rgba(255, 255, 255, 0.3)' }}>
          The Brain Behind Norvan
        </h1>
        <p className="text-base md:text-xl lg:text-2xl font-light bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent tracking-wide">
          32 interconnected intelligence nodes
        </p>
      </motion.div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute top-4 md:top-8 right-4 md:right-8 z-10 text-white/30 md:text-white/40 text-[10px] md:text-xs space-y-0.5 md:space-y-1 font-mono text-right"
      >
        <p className="hidden md:block">Left Click: Rotate</p>
        <p className="hidden md:block">Right Click: Pan</p>
        <p className="hidden md:block">Scroll: Zoom</p>
        <p className="md:hidden">Touch: Rotate</p>
        <p className="md:hidden">Pinch: Zoom</p>
        <p>Tap Node: Focus</p>
      </motion.div>

      {/* 3D Graph */}
      <div className="absolute inset-0">
        <NorvanGraph onNodeClick={handleNodeClick} />
      </div>

      {/* HUD Card */}
      {selectedNode && (
        <HUDCard node={selectedNode} onClose={handleCloseHUD} />
      )}
    </div>
  );
}

export default App;
