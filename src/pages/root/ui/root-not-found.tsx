import { RootDocument } from './root-document';
import { NotFound } from '@/shared/ui/error';

export function RootNotFound() {
  return (
    <RootDocument>
      <NotFound />
    </RootDocument>
  );
}
