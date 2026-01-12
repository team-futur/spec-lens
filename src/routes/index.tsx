import { createFileRoute } from '@tanstack/react-router';

import { SpecLoaderPage } from '@/pages/spec-loader';

export const Route = createFileRoute('/')({
  component: SpecLoaderPage,
});
