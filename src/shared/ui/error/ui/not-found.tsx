import { Link } from '@tanstack/react-router';

export function NotFound({ children }: { children?: any }) {
  return (
    <div style={{ padding: '0.8rem' }}>
      <div style={{ color: '#4b5563' }}>
        {children || <p>The page you are looking for does not exist.</p>}
      </div>
      <p
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.8rem',
          flexWrap: 'wrap',
          marginTop: '0.8rem',
        }}
      >
        <button
          onClick={() => window.history.back()}
          style={{
            padding: '0.4rem 0.8rem',
            borderRadius: '0.2rem',
            color: 'white',
            textTransform: 'uppercase',
            fontWeight: 900,
            fontSize: '1.4rem',
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
            padding: '0.4rem 0.8rem',
            borderRadius: '0.2rem',
            color: 'white',
            textTransform: 'uppercase',
            fontWeight: 900,
            fontSize: '1.4rem',
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
