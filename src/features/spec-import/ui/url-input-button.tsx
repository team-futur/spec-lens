import { Loader2 } from 'lucide-react';

import { useColors } from '@/shared/theme';

export function UrlInputButton({ isLoading }: { isLoading: boolean }) {
  const colors = useColors();

  return (
    <button
      type='submit'
      disabled={isLoading}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.8rem',
        padding: '0 2.4rem',
        backgroundColor: colors.interactive.primary,
        color: colors.text.onBrand,
        border: 'none',
        borderRadius: '0.6rem',
        fontSize: '1.4rem',
        fontWeight: 500,
        cursor: isLoading ? 'not-allowed' : 'pointer',
        opacity: isLoading ? 0.7 : 1,
        transition: 'all 0.2s ease',
        minWidth: '8.8rem',
      }}
    >
      {isLoading ? (
        <>
          <Loader2
            size={16}
            className='animate-spin'
            style={{ animation: 'spin 1s linear infinite' }}
          />
          <span>Loading</span>
        </>
      ) : (
        'Fetch'
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
}
