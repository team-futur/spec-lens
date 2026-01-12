import { getMethodColor } from '../lib/openapi-parser.ts';
import type { HttpMethod } from '../model/openapi-types.ts';

export function MethodBadge({
  method,
  size = 'md',
}: {
  method: HttpMethod;
  size?: 'sm' | 'md' | 'lg';
}) {
  const color = getMethodColor(method);

  const sizeStyles = {
    sm: {
      fontSize: '0.625rem',
      padding: '0.125rem 0.375rem',
      minWidth: '2.5rem',
    },
    md: {
      fontSize: '0.6875rem',
      padding: '0.25rem 0.5rem',
      minWidth: '3.5rem',
    },
    lg: {
      fontSize: '0.75rem',
      padding: '0.375rem 0.75rem',
      minWidth: '4rem',
    },
  };

  const styles = sizeStyles[size];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: `${color}20`,
        color: color,
        border: `1px solid ${color}40`,
        borderRadius: '0.25rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        fontFamily: 'monospace',
        letterSpacing: '0.025em',
        flexShrink: 0,
        ...styles,
      }}
    >
      {method}
    </span>
  );
}
