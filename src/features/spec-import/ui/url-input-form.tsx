import { UploadErrorMessage } from './upload-error-message';
import { UrlInput } from './url-input';
import { UrlInputButton } from './url-input-button';
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
        <UrlInput url={url} setUrl={setUrl} setLocalError={setLocalError} />

        <UrlInputButton isLoading={isLoading} />
      </div>

      {localError && <UploadErrorMessage errorMessage={localError} />}
    </form>
  );
}
