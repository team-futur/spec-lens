import { useState, useEffect } from 'react';

import { Play, Loader2, Copy, Check, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';

import {
  useApiTesterStore,
  useSelectedServer,
  usePathParams,
  useQueryParams,
  useHeaders,
  useRequestBody,
  useResponse,
  useIsExecuting,
  useExecuteError,
} from '@/entities/api-tester';
import { executeRequest, getStatusColor } from '../api/execute-request.ts';
import {
  type ParsedEndpoint,
  type OpenAPISpec,
  type ParameterObject,
  getMergedParameters,
  isReferenceObject,
} from '@/entities/openapi';

export function TryItPanel({ endpoint, spec }: { endpoint: ParsedEndpoint; spec: OpenAPISpec }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showHeaders, setShowHeaders] = useState(false);
  const [copiedResponse, setCopiedResponse] = useState(false);

  const selectedServer = useSelectedServer();
  const pathParams = usePathParams();
  const queryParams = useQueryParams();
  const headers = useHeaders();
  const requestBody = useRequestBody();
  const response = useResponse();
  const isExecuting = useIsExecuting();
  const executeError = useExecuteError();

  const {
    setSelectedServer,
    setPathParam,
    setQueryParam,
    setHeader,
    setRequestBody,
    setResponse,
    setExecuting,
    setExecuteError,
    clearResponse,
    resetParams,
    addToHistory,
  } = useApiTesterStore();

  // Get servers from spec
  const servers = spec.servers || [{ url: 'http://localhost:3000', description: 'Local' }];

  // Initialize server selection
  useEffect(() => {
    if (!selectedServer && servers.length > 0) {
      setSelectedServer(servers[0].url);
    }
  }, [servers, selectedServer, setSelectedServer]);

  // Reset params when endpoint changes
  useEffect(() => {
    resetParams();
  }, [endpoint.path, endpoint.method, resetParams]);

  // Parse parameters
  const merged = getMergedParameters(endpoint);
  const parameters = merged.filter((p): p is ParameterObject => !isReferenceObject(p));

  const pathParameters = parameters.filter((p) => p.in === 'path');
  const queryParameters = parameters.filter((p) => p.in === 'query');

  // Check if endpoint has request body
  const hasRequestBody = !!endpoint.operation.requestBody;

  // Handle execute
  async function handleExecute() {
    if (!selectedServer) return;

    setExecuting(true);
    clearResponse();

    const result = await executeRequest({
      baseUrl: selectedServer,
      path: endpoint.path,
      method: endpoint.method,
      pathParams,
      queryParams,
      headers,
      body: requestBody,
    });

    if (result.success) {
      setResponse(result.response);
      addToHistory({
        timestamp: Date.now(),
        method: endpoint.method,
        url: `${selectedServer}${endpoint.path}`,
        response: result.response,
        error: null,
      });
    } else {
      setExecuteError(result.error);
      addToHistory({
        timestamp: Date.now(),
        method: endpoint.method,
        url: `${selectedServer}${endpoint.path}`,
        response: null,
        error: result.error,
      });
    }
  }

  // Copy response to clipboard
  function handleCopyResponse() {
    if (response?.data) {
      navigator.clipboard.writeText(JSON.stringify(response.data, null, 2));
      setCopiedResponse(true);
      setTimeout(() => setCopiedResponse(false), 2000);
    }
  }

  return (
    <div
      style={{
        marginTop: '2.4rem',
        backgroundColor: '#151515',
        borderRadius: '0.8rem',
        border: '1px solid rgba(255,255,255,0.1)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.4rem 1.6rem',
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <span
          style={{
            color: '#e5e5e5',
            fontSize: '1.4rem',
            fontWeight: 600,
          }}
        >
          Try it out
        </span>
        {isExpanded ? (
          <ChevronUp size={18} color='#6b7280' />
        ) : (
          <ChevronDown size={18} color='#6b7280' />
        )}
      </button>

      {isExpanded && (
        <div
          style={{
            padding: '0 1.6rem 1.6rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.6rem',
          }}
        >
          {/* Server Selection */}
          <div>
            <label
              style={{
                display: 'block',
                color: '#9ca3af',
                fontSize: '1.2rem',
                fontWeight: 500,
                marginBottom: '0.6rem',
              }}
            >
              Server
            </label>
            <select
              value={selectedServer}
              onChange={(e) => setSelectedServer(e.target.value)}
              style={{
                width: '100%',
                padding: '1rem 1.2rem',
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '0.6rem',
                color: '#e5e5e5',
                fontSize: '1.3rem',
                outline: 'none',
              }}
            >
              {servers.map((server, i) => (
                <option key={i} value={server.url} style={{ backgroundColor: '#1a1a1a' }}>
                  {server.url} {server.description ? `(${server.description})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Path Parameters */}
          {pathParameters.length > 0 && (
            <div>
              <label
                style={{
                  display: 'block',
                  color: '#9ca3af',
                  fontSize: '1.2rem',
                  fontWeight: 500,
                  marginBottom: '0.8rem',
                }}
              >
                Path Parameters
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {pathParameters.map((param) => (
                  <ParameterInput
                    key={param.name}
                    param={param}
                    value={pathParams[param.name] || ''}
                    onChange={(value) => setPathParam(param.name, value)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Query Parameters */}
          {queryParameters.length > 0 && (
            <div>
              <label
                style={{
                  display: 'block',
                  color: '#9ca3af',
                  fontSize: '1.2rem',
                  fontWeight: 500,
                  marginBottom: '0.8rem',
                }}
              >
                Query Parameters
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {queryParameters.map((param) => (
                  <ParameterInput
                    key={param.name}
                    param={param}
                    value={queryParams[param.name] || ''}
                    onChange={(value) => setQueryParam(param.name, value)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Headers */}
          <div>
            <button
              onClick={() => setShowHeaders(!showHeaders)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                marginBottom: '0.8rem',
              }}
            >
              <span
                style={{
                  color: '#9ca3af',
                  fontSize: '1.2rem',
                  fontWeight: 500,
                }}
              >
                Headers ({Object.keys(headers).length})
              </span>
              {showHeaders ? (
                <ChevronUp size={14} color='#6b7280' />
              ) : (
                <ChevronDown size={14} color='#6b7280' />
              )}
            </button>

            {showHeaders && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {Object.entries(headers).map(([key, value]) => (
                  <div key={key} style={{ display: 'flex', gap: '0.8rem' }}>
                    <input
                      type='text'
                      value={key}
                      readOnly
                      style={{
                        flex: 1,
                        padding: '0.8rem 1.2rem',
                        backgroundColor: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '0.6rem',
                        color: '#9ca3af',
                        fontSize: '1.3rem',
                      }}
                    />
                    <input
                      type='text'
                      value={value}
                      onChange={(e) => setHeader(key, e.target.value)}
                      style={{
                        flex: 1,
                        padding: '0.8rem 1.2rem',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '0.6rem',
                        color: '#e5e5e5',
                        fontSize: '1.3rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Request Body */}
          {hasRequestBody && (
            <div>
              <label
                style={{
                  display: 'block',
                  color: '#9ca3af',
                  fontSize: '1.2rem',
                  fontWeight: 500,
                  marginBottom: '0.6rem',
                }}
              >
                Request Body
              </label>
              <textarea
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                placeholder='{"key": "value"}'
                rows={6}
                style={{
                  width: '100%',
                  padding: '1.2rem',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '0.6rem',
                  color: '#e5e5e5',
                  fontSize: '1.3rem',
                  fontFamily: 'monospace',
                  resize: 'vertical',
                  outline: 'none',
                }}
              />
            </div>
          )}

          {/* Execute Button */}
          <button
            onClick={handleExecute}
            disabled={isExecuting}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.8rem',
              padding: '1.2rem 2.4rem',
              backgroundColor: '#075D46',
              color: '#fff',
              border: 'none',
              borderRadius: '0.6rem',
              fontSize: '1.4rem',
              fontWeight: 500,
              cursor: isExecuting ? 'not-allowed' : 'pointer',
              opacity: isExecuting ? 0.7 : 1,
              transition: 'all 0.2s ease',
            }}
          >
            {isExecuting ? (
              <>
                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                <span>Executing...</span>
              </>
            ) : (
              <>
                <Play size={16} />
                <span>Execute</span>
              </>
            )}
          </button>

          {/* Error */}
          {executeError && (
            <div
              style={{
                padding: '1.2rem 1.6rem',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderRadius: '0.6rem',
                border: '1px solid rgba(239, 68, 68, 0.2)',
              }}
            >
              <span style={{ color: '#ef4444', fontSize: '1.3rem' }}>{executeError}</span>
            </div>
          )}

          {/* Response */}
          {response && (
            <div
              style={{
                backgroundColor: 'rgba(0,0,0,0.3)',
                borderRadius: '0.6rem',
                overflow: 'hidden',
              }}
            >
              {/* Response Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1.2rem 1.6rem',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.6rem' }}>
                  <span
                    style={{
                      color: getStatusColor(response.status),
                      fontSize: '1.4rem',
                      fontWeight: 600,
                    }}
                  >
                    {response.status} {response.statusText}
                  </span>
                  <span style={{ color: '#6b7280', fontSize: '1.2rem' }}>
                    {response.duration}ms
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.8rem' }}>
                  <button
                    onClick={handleCopyResponse}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.6rem 1rem',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '0.4rem',
                      color: '#9ca3af',
                      fontSize: '1.2rem',
                      cursor: 'pointer',
                    }}
                  >
                    {copiedResponse ? <Check size={12} /> : <Copy size={12} />}
                    {copiedResponse ? 'Copied' : 'Copy'}
                  </button>
                  <button
                    onClick={clearResponse}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.6rem',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '0.4rem',
                      color: '#9ca3af',
                      cursor: 'pointer',
                    }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>

              {/* Response Body */}
              <pre
                style={{
                  margin: 0,
                  padding: '1.6rem',
                  color: '#e5e5e5',
                  fontSize: '1.2rem',
                  fontFamily: 'monospace',
                  overflow: 'auto',
                  maxHeight: '400px',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {typeof response.data === 'string'
                  ? response.data
                  : JSON.stringify(response.data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Parameter Input Component
function ParameterInput({
  param,
  value,
  onChange,
}: {
  param: ParameterObject;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
      <span
        style={{
          minWidth: '120px',
          color: '#e5e5e5',
          fontSize: '1.3rem',
          fontFamily: 'monospace',
        }}
      >
        {param.name}
        {param.required && <span style={{ color: '#ef4444' }}>*</span>}
      </span>
      <input
        type='text'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={param.description || param.name}
        style={{
          flex: 1,
          padding: '0.8rem 1.2rem',
          backgroundColor: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '0.6rem',
          color: '#e5e5e5',
          fontSize: '1.3rem',
          outline: 'none',
        }}
      />
    </div>
  );
}
