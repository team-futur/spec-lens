import { FileUploadContent } from './file-upload-content';
import { UploadErrorMessage } from './upload-error-message';
import { useError } from '@/entities/openapi-spec';

export function FileUploadZone() {
  const error = useError();

  return (
    <div style={{ width: '100%' }}>
      <FileUploadContent />
      {error && <UploadErrorMessage errorMessage={error} />}
    </div>
  );
}
