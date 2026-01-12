import { useState } from 'react';

import { useSpec } from '@/entities/openapi';
import { ViewerLayout } from '@/widgets/openapi-viewer';
import {
  SpecLoaderHeader,
  SpecInputModeTabs,
  SpecLoaderContent,
  type SpecLoaderType,
} from '@/widgets/spec-loader';

export function APIDocsPage() {
  const spec = useSpec();
  const [inputMode, setInputMode] = useState<SpecLoaderType>('file');

  if (spec) {
    return <ViewerLayout />;
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        minHeight: '100%',
        padding: '3.2rem',
        paddingTop: '12rem',
        backgroundColor: '#0a0a0a',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '52rem',
        }}
      >
        <SpecLoaderHeader />

        <SpecInputModeTabs inputMode={inputMode} setInputMode={setInputMode} />

        <SpecLoaderContent inputMode={inputMode} />

        {/* <SupportedFormatsInfo /> */}
      </div>
    </div>
  );
}
