import { createFileRoute } from '@tanstack/react-router';

import { APIDocsPage } from '@/pages/api-docs';

export const Route = createFileRoute('/api-docs')({
  component: APIDocsPage,
});
