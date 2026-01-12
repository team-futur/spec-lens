import { ChevronDown, ChevronRight, Search, X } from 'lucide-react';

import {
  openAPIStoreActions,
  useOpenAPIStore,
  useSearchQuery,
  useSelectedEndpoint,
  useExpandedTags,
  useIsSidebarOpen,
  MethodBadge,
} from '@/entities/openapi';

export function Sidebar() {
  const spec = useOpenAPIStore((s) => s.spec);
  const searchQuery = useSearchQuery();
  const selectedEndpoint = useSelectedEndpoint();
  const expandedTags = useExpandedTags();
  const isSidebarOpen = useIsSidebarOpen();

  const endpointsByTag = openAPIStoreActions.getEndpointsByTag();
  const tagEntries = Object.entries(endpointsByTag);

  if (!spec) return null;

  if (!isSidebarOpen) {
    return null;
  }

  return (
    <aside
      style={{
        width: '320px',
        minWidth: '320px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#111111',
        borderRight: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '1.6rem',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div style={{ marginBottom: '1.2rem' }}>
          <h2
            style={{
              color: '#e5e5e5',
              fontSize: '1.4rem',
              fontWeight: 600,
              marginBottom: '0.4rem',
            }}
          >
            {spec.info.title}
          </h2>
          <span style={{ color: '#6b7280', fontSize: '1.2rem' }}>
            v{spec.info.version} • OpenAPI {spec.openapi}
          </span>
        </div>

        {/* Search */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            padding: '0.8rem 1.2rem',
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderRadius: '0.6rem',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <Search size={14} color='#6b7280' />
          <input
            type='text'
            value={searchQuery}
            onChange={(e) => openAPIStoreActions.setSearchQuery(e.target.value)}
            placeholder='Search endpoints...'
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#e5e5e5',
              fontSize: '1.3rem',
            }}
          />
          {searchQuery && (
            <button
              onClick={openAPIStoreActions.clearFilters}
              style={{
                padding: '0.2rem',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <X size={14} color='#6b7280' />
            </button>
          )}
        </div>
      </div>

      {/* Endpoint List */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0.8rem 0',
        }}
      >
        {tagEntries.length === 0 ? (
          <div
            style={{
              padding: '3.2rem 1.6rem',
              textAlign: 'center',
              color: '#6b7280',
              fontSize: '1.3rem',
            }}
          >
            No endpoints found
          </div>
        ) : (
          tagEntries.map(([tag, endpoints]) => {
            const isExpanded = expandedTags.includes(tag);
            return (
              <div key={tag} style={{ marginBottom: '0.4rem' }}>
                {/* Tag Header */}
                <button
                  onClick={() => openAPIStoreActions.toggleTagExpanded(tag)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.8rem',
                    padding: '1rem 1.6rem',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  {isExpanded ? (
                    <ChevronDown size={14} color='#6b7280' />
                  ) : (
                    <ChevronRight size={14} color='#6b7280' />
                  )}
                  <span
                    style={{
                      color: '#9ca3af',
                      fontSize: '1.2rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {tag}
                  </span>
                  <span
                    style={{
                      color: '#4b5563',
                      fontSize: '1.1rem',
                      marginLeft: 'auto',
                    }}
                  >
                    {endpoints.length}
                  </span>
                </button>

                {/* Endpoints */}
                {isExpanded && (
                  <div>
                    {endpoints.map((endpoint) => {
                      const isSelected =
                        selectedEndpoint?.path === endpoint.path &&
                        selectedEndpoint?.method === endpoint.method;

                      return (
                        <button
                          key={`${endpoint.method}-${endpoint.path}`}
                          onClick={() =>
                            openAPIStoreActions.selectEndpoint(endpoint.path, endpoint.method)
                          }
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '0.8rem 1.6rem 0.8rem 3.2rem',
                            backgroundColor: isSelected ? 'rgba(7, 93, 70, 0.15)' : 'transparent',
                            border: 'none',
                            borderLeft: isSelected ? '2px solid #075D46' : '2px solid transparent',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }
                          }}
                        >
                          <MethodBadge method={endpoint.method} size='sm' />
                          <span
                            style={{
                              color: isSelected ? '#e5e5e5' : '#9ca3af',
                              fontSize: '1.3rem',
                              fontFamily: 'monospace',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {endpoint.path}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
