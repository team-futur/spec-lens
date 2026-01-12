import { useCallback, useEffect, useState } from 'react';

import {
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Loader2,
  Play,
  RotateCcw,
  Trash2,
} from 'lucide-react';

import {
  apiTesterStoreActions,
  executeRequest,
  getExecuteStatusColor,
  useExecuteError,
  useHeaders,
  useIsExecuting,
  usePathParams,
  useQueryParams,
  useRequestBody,
  useResponse,
  useSelectedServer,
} from '@/entities/api-tester';
import {
  type OpenAPISpec,
  type ParameterObject,
  type ParsedEndpoint,
  generateExample,
  getMergedParameters,
  isReferenceObject,
} from '@/entities/openapi';
import { FuturSelect } from '@/shared/ui/select';

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

  const servers = spec.servers || [{ url: 'http://localhost:3000', description: 'Local' }];

  // Initialize server
  useEffect(() => {
    if (!selectedServer && servers.length > 0) {
      apiTesterStoreActions.setSelectedServer(servers[0].url);
    }
  }, [servers, selectedServer]);

  // Generate example
  const generateBodyExample = useCallback(() => {
    if (!endpoint.operation.requestBody || isReferenceObject(endpoint.operation.requestBody))
      return '';

    const content = endpoint.operation.requestBody.content?.['application/json'];
    if (content?.schema) {
      const example = generateExample(content.schema, spec);
      return example ? JSON.stringify(example, null, 2) : '';
    }
    return '';
  }, [endpoint.operation.requestBody, spec]);

  // Reset params & body on endpoint change
  useEffect(() => {
    apiTesterStoreActions.resetParams();
    const example = generateBodyExample();
    if (example) apiTesterStoreActions.setRequestBody(example);
  }, [endpoint.path, endpoint.method, generateBodyExample]);

  const merged = getMergedParameters(endpoint);
  const parameters = merged.filter((p): p is ParameterObject => !isReferenceObject(p));
  const pathParameters = parameters.filter((p) => p.in === 'path');
  const queryParameters = parameters.filter((p) => p.in === 'query');
  const hasRequestBody = !!endpoint.operation.requestBody;

  async function handleExecute() {
    if (!selectedServer) return;
    apiTesterStoreActions.setExecuting(true);
    apiTesterStoreActions.clearResponse();
    const result = await executeRequest({
      baseUrl: selectedServer,
      path: endpoint.path,
      method: endpoint.method,
      pathParams,
      queryParams,
      headers,
      body: requestBody,
    });
    apiTesterStoreActions.setExecuting(false);

    if (result.success) {
      apiTesterStoreActions.setResponse(result.response);
      apiTesterStoreActions.addToHistory({
        timestamp: Date.now(),
        method: endpoint.method,
        url: `${selectedServer}${endpoint.path}`,
        response: result.response,
        error: null,
      });
    } else {
      apiTesterStoreActions.setExecuteError(result.error);
      apiTesterStoreActions.addToHistory({
        timestamp: Date.now(),
        method: endpoint.method,
        url: `${selectedServer}${endpoint.path}`,
        response: null,
        error: result.error,
      });
    }
  }

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Play size={16} fill='#ffffff' color='#ffffff' style={{ opacity: 0.8 }} />
          <span style={{ color: '#ffffff', fontSize: '1.4rem', fontWeight: 600 }}>Try it out</span>
        </div>
        {isExpanded ? (
          <ChevronUp size={18} color='#9ca3af' />
        ) : (
          <ChevronDown size={18} color='#9ca3af' />
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
          {/* Server */}
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
              Target Server
            </label>
            <FuturSelect
              value={selectedServer}
              onChange={(val) => apiTesterStoreActions.setSelectedServer(val)}
              options={servers.map((s) => ({
                label: `${s.url}${s.description ? ` (${s.description})` : ''}`,
                value: s.url,
              }))}
              placeholder='Select a server'
            />
          </div>

          {/* Parameters Group */}
          {(pathParameters.length > 0 || queryParameters.length > 0) && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {pathParameters.length > 0 && (
                <div>
                  <div
                    style={{
                      color: '#e5e5e5',
                      fontSize: '1.2rem',
                      fontWeight: 600,
                      marginBottom: '0.8rem',
                      textTransform: 'uppercase',
                      opacity: 0.7,
                    }}
                  >
                    Path Params
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    {pathParameters.map((p) => (
                      <ParameterInput
                        key={p.name}
                        param={p}
                        value={pathParams[p.name] || ''}
                        onChange={(v) => apiTesterStoreActions.setPathParam(p.name, v)}
                      />
                    ))}
                  </div>
                </div>
              )}
              {queryParameters.length > 0 && (
                <div>
                  <div
                    style={{
                      color: '#e5e5e5',
                      fontSize: '1.2rem',
                      fontWeight: 600,
                      marginBottom: '0.8rem',
                      textTransform: 'uppercase',
                      opacity: 0.7,
                    }}
                  >
                    Query Params
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    {queryParameters.map((p) => (
                      <ParameterInput
                        key={p.name}
                        param={p}
                        value={queryParams[p.name] || ''}
                        onChange={(v) => apiTesterStoreActions.setQueryParam(p.name, v)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Headers */}
          <div>
            <div
              onClick={() => setShowHeaders(!showHeaders)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                cursor: 'pointer',
                marginBottom: '0.6rem',
              }}
            >
              <span style={{ color: '#9ca3af', fontSize: '1.2rem', fontWeight: 500 }}>Headers</span>
              <span
                style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '1rem',
                  fontSize: '1rem',
                  color: '#e5e5e5',
                }}
              >
                {Object.keys(headers).length}
              </span>
              {showHeaders ? (
                <ChevronUp size={12} color='#9ca3af' />
              ) : (
                <ChevronDown size={12} color='#9ca3af' />
              )}
            </div>
            {showHeaders && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {Object.entries(headers).map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', gap: '0.8rem' }}>
                    <input readOnly value={k} style={inputStyle} />
                    <input
                      value={v}
                      onChange={(e) => apiTesterStoreActions.setHeader(k, e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Request Body */}
          {hasRequestBody && (
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.8rem',
                }}
              >
                <label style={{ color: '#9ca3af', fontSize: '1.2rem', fontWeight: 500 }}>
                  Request Body (JSON)
                </label>
                <button
                  onClick={() => {
                    const example = generateBodyExample();
                    apiTesterStoreActions.setRequestBody(example);
                  }}
                  title='Reset to default example'
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#f59e0b',
                    fontSize: '1.2rem',
                  }}
                >
                  <RotateCcw size={12} />
                  Reset to Default
                </button>
              </div>
              <textarea
                value={requestBody}
                onChange={(e) => apiTesterStoreActions.setRequestBody(e.target.value)}
                rows={8}
                style={{
                  width: '100%',
                  padding: '1.2rem',
                  backgroundColor: 'rgba(0,0,0,0.2)',
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

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.8rem' }}>
            <button
              onClick={handleExecute}
              disabled={isExecuting}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                padding: '1rem 2.4rem',
                backgroundColor: isExecuting ? '#374151' : '#2563eb', // blue-600
                color: '#ffffff',
                border: 'none',
                borderRadius: '0.6rem',
                fontSize: '1.4rem',
                fontWeight: 600,
                cursor: isExecuting ? 'not-allowed' : 'pointer',
              }}
            >
              {isExecuting ? (
                <Loader2 size={16} className='animate-spin' />
              ) : (
                <Play size={16} fill='white' />
              )}
              {isExecuting ? 'Sending...' : 'Execute Request'}
            </button>
          </div>

          {executeError && (
            <div
              style={{
                padding: '1.2rem',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '0.6rem',
                color: '#ef4444',
                fontSize: '1.3rem',
              }}
            >
              Error: {executeError}
            </div>
          )}

          {response && (
            <div
              style={{
                marginTop: '0.8rem',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '0.6rem',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '1rem 1.2rem',
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: '1.3rem',
                      color: getExecuteStatusColor(response.status),
                    }}
                  >
                    {response.status}
                  </span>
                  <span style={{ fontSize: '1.2rem', color: '#9ca3af' }}>
                    {response.duration}ms
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.8rem' }}>
                  <button onClick={handleCopyResponse} style={iconButtonStyle}>
                    {copiedResponse ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                  <button onClick={apiTesterStoreActions.clearResponse} style={iconButtonStyle}>
                    {' '}
                    <Trash2 size={14} />{' '}
                  </button>
                </div>
              </div>
              <div
                style={{
                  padding: '1.2rem',
                  backgroundColor: '#0a0a0a',
                  overflow: 'auto',
                  maxHeight: '400px',
                }}
              >
                <pre
                  style={{
                    margin: 0,
                    fontSize: '1.2rem',
                    fontFamily: 'monospace',
                    color: '#e5e5e5',
                  }}
                >
                  {typeof response.data === 'string'
                    ? response.data
                    : JSON.stringify(response.data, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  flex: 1,
  width: '100%',
  padding: '0.8rem 1.2rem',
  backgroundColor: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '0.6rem',
  color: '#e5e5e5',
  fontSize: '1.3rem',
  outline: 'none',
};

const iconButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '2.4rem',
  height: '2.4rem',
  backgroundColor: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '0.4rem',
  color: '#e5e5e5',
  cursor: 'pointer',
};

function ParameterInput({
  param,
  value,
  onChange,
}: {
  param: ParameterObject;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div style={{ width: '120px', flexShrink: 0 }}>
        <span style={{ fontSize: '1.2rem', fontFamily: 'monospace', color: '#e5e5e5' }}>
          {param.name}
        </span>
        {param.required && <span style={{ color: '#ef4444', marginLeft: '0.2rem' }}>*</span>}
      </div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={
          param.description ||
          (param.schema && !isReferenceObject(param.schema) ? String(param.schema.type || '') : '')
        }
        style={inputStyle}
      />
    </div>
  );
}
