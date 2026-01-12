import { motion } from 'framer-motion';
import type { ComponentType, CSSProperties } from 'react';

interface IconButtonProps {
  icon: ComponentType;
  onClick?: () => void;
  style?: CSSProperties;
  disabled?: boolean;
}

export function IconButton({ icon: Icon, onClick, style, disabled = false }: IconButtonProps) {
  return (
    <motion.button
      type='button'
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.9 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 17,
      }}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        background: 'transparent',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        willChange: 'transform',
        ...style,
      }}
    >
      <Icon />
    </motion.button>
  );
}
