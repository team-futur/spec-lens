import { useSpecStore } from '@/entities/openapi-spec';
import { SpecClearButton, SpecRefreshButton } from '@/features/spec-refresh';

export function ViewerToolbarActions() {
  const specSource = useSpecStore((s) => s.specSource);

  const canRefresh = specSource?.type === 'url';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
      {canRefresh && <SpecRefreshButton />}
      <SpecClearButton />
    </div>
  );
}
