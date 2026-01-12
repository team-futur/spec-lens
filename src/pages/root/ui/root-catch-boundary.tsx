import type { ErrorComponentProps } from '@tanstack/react-router';

import { RootDocument } from './root-document';
import { DefaultCatchBoundary } from '@/shared/ui/error';

export function RootCatchBoundary({ ...props }: ErrorComponentProps) {
  return (
    <RootDocument>
      <DefaultCatchBoundary {...props} />
    </RootDocument>
  );
}
