import { FileUploadContent } from './file-upload-content';
import { UploadErrorMessage } from './upload-error-message';
import { useFileHandler } from '../model/use-file-drag-and-drop';

export function FileUploadZone() {
  const {
    error,
    fileName,
    isDragging,
    handleFileInput,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  } = useFileHandler();

  return (
    <div style={{ width: '100%' }}>
      <FileUploadContent
        fileName={fileName}
        isDragging={isDragging}
        handleFileInput={handleFileInput}
        handleDragOver={handleDragOver}
        handleDragLeave={handleDragLeave}
        handleDrop={handleDrop}
      />
      {error && <UploadErrorMessage errorMessage={error} />}
    </div>
  );
}
