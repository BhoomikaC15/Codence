import React from 'react';
import { motion } from 'framer-motion';

// Curtain slam timing — sharp ease-in (slam), slow ease-out (reveal)
const slam   = { duration: 0.38, ease: [0.76, 0, 0.24, 1] };
const reveal = { duration: 0.45, ease: [0.76, 0, 0.24, 1], delay: 0.05 };

// Shared curtain style
const curtainBase = {
  position: 'fixed',
  left: 0,
  right: 0,
  height: '51%',          // 51% so there's zero gap at the seam
  background: '#0a0a0f',
  zIndex: 9999,
  pointerEvents: 'none',
};

function PageTransition({ children }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>

      {/* Top curtain — slides down on exit, retracts up on enter */}
      <motion.div
        style={{
          ...curtainBase,
          top: 0,
          borderBottom: '3px solid #FFE566',
          boxShadow: '0 4px 18px rgba(255, 229, 102, 0.55)',
        }}
        initial={{ y: 0 }}
        animate={{ y: '-101%', transition: reveal }}
        exit={{ y: 0, transition: slam }}
      />

      {/* Bottom curtain — slides up on exit, retracts down on enter */}
      <motion.div
        style={{
          ...curtainBase,
          bottom: 0,
          borderTop: '3px solid #FFE566',
          boxShadow: '0 -4px 18px rgba(255, 229, 102, 0.55)',
        }}
        initial={{ y: 0 }}
        animate={{ y: '101%', transition: reveal }}
        exit={{ y: 0, transition: slam }}
      />

      {/* Page content — fades in with subtle upward drift after curtains open */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.38, duration: 0.32, ease: 'easeOut' } }}
        exit={{ opacity: 0, transition: { duration: 0.15 } }}
        style={{ width: '100%', height: '100%' }}
      >
        {children}
      </motion.div>

    </div>
  );
}

export default PageTransition;