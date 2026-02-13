import { EndpointDetail } from './endpoint-detail.tsx';
import { EndpointPlaceholder } from './endpoint-placeholder.tsx';
import { useSelectedEndpoint } from '@/entities/endpoint-selection';
import { useSpecStore } from '@/entities/openapi-spec';

export function EndpointContent() {
  const selectedEndpointKey = useSelectedEndpoint();
  const endpoints = useSpecStore((s) => s.endpoints);

  const selectedEndpoint = selectedEndpointKey
    ? (endpoints.find(
        (e) => e.path === selectedEndpointKey.path && e.method === selectedEndpointKey.method,
      ) ?? null)
    : null;

  if (!selectedEndpoint) return <EndpointPlaceholder />;

  return <EndpointDetail endpoint={selectedEndpoint} />;
}
