import { useState, type FormEvent } from 'react';

import { Link, Loader2, AlertCircle } from 'lucide-react';

import { type OpenAPISpec, validateOpenAPISpec, useOpenAPIStore } from '@/entities/openapi';

export function UrlInputForm({ onSuccess }: { onSuccess?: () => void }) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoadingLocal] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const { setSpec, setLoading, setError: setStoreError } = useOpenAPIStore();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!url.trim()) {
      setLocalError('Please enter a URL');
      return;
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      setLocalError('Please enter a valid URL');
      return;
    }

    setIsLoadingLocal(true);
    setLocalError(null);
    setLoading(true);

    try {
      const response = await fetch(url, {
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const json = await response.json();

      const validation = validateOpenAPISpec(json);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      setSpec(json as OpenAPISpec, { type: 'url', name: url });
      setUrl('');
      onSuccess?.();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message.includes('Failed to fetch')
            ? 'Failed to fetch. The URL might be blocked by CORS policy.'
            : err.message
          : 'Failed to fetch spec';
      setLocalError(message);
      setStoreError(message);
    } finally {
      setIsLoadingLocal(false);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <div
        style={{
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'stretch',
        }}
      >
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0 1rem',
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderRadius: '0.375rem',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <Link size={18} color="#6b7280" />
          <input
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setLocalError(null);
            }}
            placeholder="https://api.example.com/openapi.json"
            style={{
              flex: 1,
              padding: '0.875rem 0',
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#e5e5e5',
              fontSize: '0.875rem',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0 1.5rem',
            backgroundColor: '#075D46',
            color: '#fff',
            border: 'none',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.7 : 1,
            transition: 'all 0.2s ease',
            minWidth: '5.5rem',
          }}
        >
          {isLoading ? (
            <>
              <Loader2
                size={16}
                className="animate-spin"
                style={{ animation: 'spin 1s linear infinite' }}
              />
              <span>Loading</span>
            </>
          ) : (
            'Fetch'
          )}
        </button>
      </div>

      {localError && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: '0.75rem',
            padding: '0.75rem 1rem',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderRadius: '0.375rem',
            border: '1px solid rgba(239, 68, 68, 0.2)',
          }}
        >
          <AlertCircle size={16} color="#ef4444" />
          <span style={{ color: '#ef4444', fontSize: '0.8125rem' }}>{localError}</span>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </form>
  );
}
