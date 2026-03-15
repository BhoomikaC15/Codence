import React from 'react';
import { motion } from 'framer-motion';

function PixelButton({
  children,
  onClick,
  disabled,
  color = '#A8FF3E',
  shadowColor = '#2D5A1B',
  textColor = '#0D1F0D',
  fullWidth = false,
  className = '',
  style = {},
}) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.03 } : {}}
      whileTap={!disabled ? {
        scale: 0.96,
        boxShadow: 'none',
        y: 4,
      } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      className={`${fullWidth ? 'w-full' : ''} py-4 text-xs font-bold transition-colors ${className}`}
      style={{
        backgroundColor: disabled ? '#1E3A1E' : color,
        border: `4px solid ${disabled ? '#2D5A1B' : shadowColor}`,
        boxShadow: disabled ? 'none' : `4px 4px 0px ${shadowColor}`,
        color: disabled ? '#2D5A1B' : textColor,
        cursor: disabled ? 'not-allowed' : 'pointer',
        letterSpacing: '1px',
        ...style,
      }}
    >
      {children}
    </motion.button>
  );
}

export default PixelButton;