import { motion, type Transition, type Variants } from 'framer-motion';
import type { CSSProperties, ReactNode } from 'react';

import { useThemeStore } from '@/shared/store';

type ThemeMode = 'light' | 'dark';

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
  style?: CSSProperties;
  variant?: 'pulse' | 'wave' | 'shimmer';
  animation?: 'default' | 'subtle' | 'none';
  themeMode?: ThemeMode; // 추가
  children?: ReactNode;
}

export const skeletonColors = {
  light: {
    base: '#E0E4E8',
    waveStop1: 'rgba(255,255,255,0.55)',
    waveStop2: 'rgba(255,255,255,0.85)',
    shimmer: 'rgba(255,255,255,0.7)',
  },
  dark: {
    base: '#2A2D34', // 다크 카드(#1F2228 가정)보다 연하게
    waveStop1: 'rgba(255,255,255,0.14)',
    waveStop2: 'rgba(255,255,255,0.24)',
    shimmer: 'rgba(255,255,255,0.18)',
  },
};

const linearLoop: Transition = { duration: 2, repeat: Infinity, ease: 'linear' };
const easeInOutLoop: Transition = { duration: 1.5, repeat: Infinity, ease: 'easeInOut' };

const pulseAnimation: Variants = {
  initial: { opacity: 1 },
  animate: { opacity: [1, 0.55, 1], transition: easeInOutLoop },
};

const waveAnimation = {
  initial: { backgroundPosition: '200% 0' },
  animate: { backgroundPosition: '-200% 0', transition: linearLoop },
} satisfies Variants;

const shimmerAnimation: Variants = {
  initial: { x: '-100%' },
  animate: {
    x: '100%',
    transition: { duration: 1.4, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.35 },
  },
};

export function Skeleton({
  width = '100%',
  height = '2.24rem',
  borderRadius = '0.4rem',
  className,
  style,
  variant = 'shimmer',
  animation = 'default',
  children,
}: SkeletonProps) {
  const themeMode = useThemeStore((state) => state.themeMode);
  const palette = skeletonColors[themeMode];

  const baseStyle: CSSProperties = {
    width,
    height,
    borderRadius,
    backgroundColor: palette.base,
    position: 'relative',
    overflow: 'hidden',
    ...style,
  };

  if (animation === 'none') {
    return (
      <div className={className} style={baseStyle}>
        {children}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <motion.div
        className={className}
        style={baseStyle}
        variants={pulseAnimation}
        initial='initial'
        animate='animate'
      >
        {children}
      </motion.div>
    );
  }

  if (variant === 'wave') {
    return (
      <motion.div
        className={className}
        style={{
          ...baseStyle,
          background: `linear-gradient(
            90deg,
            ${palette.base} 25%,
            ${palette.waveStop1} 50%,
            ${palette.base} 75%
          )`,
          backgroundSize: '200% 100%',
        }}
        variants={waveAnimation}
        initial='initial'
        animate='animate'
      >
        {children}
      </motion.div>
    );
  }

  // shimmer (default)
  return (
    <div className={className} style={baseStyle}>
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(90deg, transparent, ${palette.shimmer}, transparent)`,
        }}
        variants={shimmerAnimation}
        initial='initial'
        animate='animate'
      />
      {children}
    </div>
  );
}
