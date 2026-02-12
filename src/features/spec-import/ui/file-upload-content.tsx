import type { ChangeEvent, DragEvent as ReactDragEvent } from 'react';

import { FileJson, Upload } from 'lucide-react';

import { useColors } from '@/shared/theme';

export function FileUploadContent({
  fileName,
  isDragging,
  handleFileInput,
  handleDragOver,
  handleDragLeave,
  handleDrop,
}: {
  fileName: string | null;
  isDragging: boolean;
  handleFileInput: (e: ChangeEvent<HTMLInputElement>) => void;
  handleDragOver: (e: ReactDragEvent) => void;
  handleDragLeave: (e: ReactDragEvent) => void;
  handleDrop: (e: ReactDragEvent) => void;
}) {
  const colors = useColors();

  return (
    <label
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.6rem',
        padding: '4rem 3.2rem',
        borderRadius: '0.8rem',
        border: `2px dashed ${isDragging ? colors.interactive.primary : colors.border.default}`,
        backgroundColor: isDragging ? 'rgba(7, 93, 70, 0.1)' : colors.bg.overlay,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
    >
      <input
        type='file'
        accept='.json,application/json'
        onChange={handleFileInput}
        style={{ display: 'none' }}
      />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '6.4rem',
          height: '6.4rem',
          borderRadius: '50%',
          backgroundColor: isDragging ? 'rgba(7, 93, 70, 0.2)' : colors.bg.overlay,
          transition: 'all 0.2s ease',
        }}
      >
        {fileName ? (
          <FileJson
            size={28}
            color={isDragging ? colors.interactive.primary : colors.text.secondary}
          />
        ) : (
          <Upload
            size={28}
            color={isDragging ? colors.interactive.primary : colors.text.secondary}
          />
        )}
      </div>

      <div style={{ textAlign: 'center' }}>
        <p
          style={{
            color: colors.text.primary,
            fontSize: '1.5rem',
            fontWeight: 500,
            marginBottom: '0.8rem',
          }}
        >
          {fileName || 'Drop OpenAPI spec file here'}
        </p>
        {!fileName && (
          <p style={{ color: colors.text.tertiary, fontSize: '1.3rem' }}>
            or click to browse (.json)
          </p>
        )}
      </div>
    </label>
  );
}
