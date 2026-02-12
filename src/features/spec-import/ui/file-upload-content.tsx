import { FileJson, Upload } from 'lucide-react';

import { useFileHandler } from '../model/use-file-drag-and-drop';

export function FileUploadContent() {
  const { fileName, isDragging, handleFileInput, handleDragOver, handleDragLeave, handleDrop } =
    useFileHandler();

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
        border: `2px dashed ${isDragging ? '#075D46' : 'rgba(255,255,255,0.2)'}`,
        backgroundColor: isDragging ? 'rgba(7, 93, 70, 0.1)' : 'rgba(255,255,255,0.02)',
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
          backgroundColor: isDragging ? 'rgba(7, 93, 70, 0.2)' : 'rgba(255,255,255,0.05)',
          transition: 'all 0.2s ease',
        }}
      >
        {fileName ? (
          <FileJson size={28} color={isDragging ? '#075D46' : '#9ca3af'} />
        ) : (
          <Upload size={28} color={isDragging ? '#075D46' : '#9ca3af'} />
        )}
      </div>

      <div style={{ textAlign: 'center' }}>
        <p
          style={{
            color: '#e5e5e5',
            fontSize: '1.5rem',
            fontWeight: 500,
            marginBottom: '0.8rem',
          }}
        >
          {fileName || 'Drop OpenAPI spec file here'}
        </p>
        {!fileName && (
          <p style={{ color: '#6b7280', fontSize: '1.3rem' }}>or click to browse (.json)</p>
        )}
      </div>
    </label>
  );
}
