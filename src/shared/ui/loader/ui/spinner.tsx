import { motion } from 'framer-motion';
import type { CSSProperties } from 'react';

export function Spinner({ style }: { style?: CSSProperties }) {
  return (
    <motion.div
      style={{
        width: '2.24rem',
        height: '2.24rem',
        border: '0.32rem solid #e0e0e0',
        borderTop: '0.32rem solid #666',
        borderRadius: '50%',
        ...style,
      }}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
}
