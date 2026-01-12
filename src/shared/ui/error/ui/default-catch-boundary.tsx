import {
  ErrorComponent,
  Link,
  rootRouteId,
  useMatch,
  useRouter,
  type ErrorComponentProps,
} from '@tanstack/react-router';

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  const router = useRouter();
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  });

  console.error(error);

  return (
    <div
      style={{
        minWidth: 0,
        flex: 1,
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.5rem',
      }}
    >
      <ErrorComponent error={error} />
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <button
          onClick={() => {
            router.invalidate();
          }}
          style={{
            padding: '0.25rem 0.5rem',
            backgroundColor: '#4b5563',
            borderRadius: '0.125rem',
            color: 'white',
            textTransform: 'uppercase',
            fontWeight: 800,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Try Again
        </button>
        {isRoot ? (
          <Link
            to='/'
            style={{
              padding: '0.25rem 0.5rem',
              backgroundColor: '#4b5563',
              borderRadius: '0.125rem',
              color: 'white',
              textTransform: 'uppercase',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            Home
          </Link>
        ) : (
          <Link
            to='/'
            style={{
              padding: '0.25rem 0.5rem',
              backgroundColor: '#4b5563',
              borderRadius: '0.125rem',
              color: 'white',
              textTransform: 'uppercase',
              fontWeight: 800,
              cursor: 'pointer',
            }}
            onClick={(e) => {
              e.preventDefault();
              window.history.back();
            }}
          >
            Go Back
          </Link>
        )}
      </div>
    </div>
  );
}
