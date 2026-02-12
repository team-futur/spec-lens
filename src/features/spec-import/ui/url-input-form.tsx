import { Link, Loader2 } from 'lucide-react';

import { UploadErrorMessage } from './upload-error-message';
import { useUrlSubmit } from '../model/use-url-submit';

export function UrlInputForm() {
  const { handleSubmit, url, setUrl, isLoading, localError, setLocalError } = useUrlSubmit();

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <div
        style={{
          display: 'flex',
          gap: '1.2rem',
          alignItems: 'stretch',
        }}
      >
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: '1.2rem',
            padding: '0 1.6rem',
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderRadius: '0.6rem',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <Link size={18} color='#6b7280' />
          <input
            type='text'
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setLocalError(null);
            }}
            placeholder='https://api.example.com/openapi.json'
            style={{
              flex: 1,
              padding: '1.4rem 0',
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#e5e5e5',
              fontSize: '1.4rem',
            }}
          />
        </div>

        <button
          type='submit'
          disabled={isLoading}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.8rem',
            padding: '0 2.4rem',
            backgroundColor: '#075D46',
            color: '#fff',
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
        </button>
      </div>

      {localError && <UploadErrorMessage errorMessage={localError} />}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </form>
  );
}
