import { Link } from '@tanstack/react-router';

export function NotFound({ children }: { children?: any }) {
  return (
    <div style={{ padding: '0.5rem' }}>
      <div style={{ color: '#4b5563' }}>
        {children || <p>The page you are looking for does not exist.</p>}
      </div>
      <p
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          flexWrap: 'wrap',
          marginTop: '0.5rem',
        }}
      >
        <button
          onClick={() => window.history.back()}
          style={{
            padding: '0.25rem 0.5rem',
            borderRadius: '0.125rem',
            color: 'white',
            textTransform: 'uppercase',
            fontWeight: 900,
            fontSize: '0.875rem',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: '#10b981',
          }}
        >
          Go back
        </button>
        <Link
          to='/'
          style={{
            padding: '0.25rem 0.5rem',
            borderRadius: '0.125rem',
            color: 'white',
            textTransform: 'uppercase',
            fontWeight: 900,
            fontSize: '0.875rem',
            cursor: 'pointer',
            backgroundColor: '#0891b2',
          }}
        >
          Start Over
        </Link>
      </p>
    </div>
  );
}
