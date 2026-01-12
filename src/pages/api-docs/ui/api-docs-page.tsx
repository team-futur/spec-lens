import { useState } from 'react';

import { FileJson, ExternalLink } from 'lucide-react';

import { useSpec, useOpenAPIStore } from '@/entities/openapi';
import { FileUploadZone, UrlInputForm } from '@/features/openapi-loader';
import { ViewerLayout } from '@/widgets/openapi-viewer';

export function APIDocsPage() {
  const spec = useSpec();
  const { clearSpec } = useOpenAPIStore();
  const [inputMode, setInputMode] = useState<'file' | 'url'>('file');

  // If spec is loaded, show the viewer
  if (spec) {
    return <ViewerLayout onReset={clearSpec} />;
  }

  // Otherwise, show the upload/input UI
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100%',
        padding: '2rem',
        backgroundColor: '#0a0a0a',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              marginBottom: '0.75rem',
            }}
          >
            <FileJson size={32} color='#075D46' />
            <h1
              style={{
                color: '#e5e5e5',
                fontSize: '1.75rem',
                fontWeight: 700,
                margin: 0,
              }}
            >
              SpecLens
            </h1>
          </div>
          <p style={{ color: '#9ca3af', fontSize: '0.9375rem' }}>
            OpenAPI/Swagger 스펙을 시각화하고 API를 테스트하세요
          </p>
        </div>

        {/* Mode Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '0.25rem',
            marginBottom: '1.5rem',
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderRadius: '0.5rem',
            padding: '0.25rem',
          }}
        >
          <button
            onClick={() => setInputMode('file')}
            style={{
              flex: 1,
              padding: '0.625rem 1rem',
              backgroundColor: inputMode === 'file' ? '#075D46' : 'transparent',
              border: 'none',
              borderRadius: '0.375rem',
              color: inputMode === 'file' ? '#fff' : '#9ca3af',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            파일 업로드
          </button>
          <button
            onClick={() => setInputMode('url')}
            style={{
              flex: 1,
              padding: '0.625rem 1rem',
              backgroundColor: inputMode === 'url' ? '#075D46' : 'transparent',
              border: 'none',
              borderRadius: '0.375rem',
              color: inputMode === 'url' ? '#fff' : '#9ca3af',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            URL 입력
          </button>
        </div>

        {/* Input Content */}
        <div
          style={{
            padding: '1.5rem',
            backgroundColor: 'rgba(255,255,255,0.02)',
            borderRadius: '0.75rem',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          {inputMode === 'file' ? <FileUploadZone /> : <UrlInputForm />}
        </div>

        {/* Info */}
        <div
          style={{
            marginTop: '1.5rem',
            padding: '1rem',
            backgroundColor: 'rgba(7, 93, 70, 0.1)',
            borderRadius: '0.5rem',
            border: '1px solid rgba(7, 93, 70, 0.2)',
          }}
        >
          <h3
            style={{
              color: '#10b981',
              fontSize: '0.8125rem',
              fontWeight: 600,
              marginBottom: '0.5rem',
            }}
          >
            지원 포맷
          </h3>
          <ul
            style={{
              color: '#9ca3af',
              fontSize: '0.8125rem',
              lineHeight: 1.6,
              margin: 0,
              paddingLeft: '1.25rem',
            }}
          >
            <li>OpenAPI 3.0.x JSON 파일</li>
            <li>Swagger 2.0은 아직 지원되지 않습니다</li>
          </ul>
        </div>

        {/* Example Link */}
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <a
            href='https://petstore3.swagger.io/api/v3/openapi.json'
            target='_blank'
            rel='noopener noreferrer'
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              color: '#6b7280',
              fontSize: '0.8125rem',
              textDecoration: 'none',
            }}
          >
            <ExternalLink size={14} />
            예시: Petstore API
          </a>
        </div>
      </div>
    </div>
  );
}
