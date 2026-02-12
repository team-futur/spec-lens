import type { SemanticColors } from './color-tokens';
import { useThemeStore } from '@/shared/theme';

export function useColors(): SemanticColors {
  return useThemeStore((state) => state.colors);
}
