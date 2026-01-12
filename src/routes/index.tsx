import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  beforeLoad: ({ cause }) => {
    // Avoid redirect during preload to prevent HMR issues
    if (cause === 'preload') return;
    throw redirect({ to: '/api-docs' });
  },
  component: () => null,
});
