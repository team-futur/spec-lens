import { AlertCircle } from 'lucide-react';

import { useColors } from '@/shared/theme';

export function UploadErrorMessage({ errorMessage }: { errorMessage: string }) {
  const colors = useColors();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.8rem',
        marginTop: '1.2rem',
        padding: '1.2rem 1.6rem',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderRadius: '0.6rem',
        border: '1px solid rgba(239, 68, 68, 0.2)',
      }}
    >
      <AlertCircle size={16} color={colors.feedback.error} />
      <span style={{ color: colors.feedback.error, fontSize: '1.3rem' }}>{errorMessage}</span>
    </div>
  );
}
