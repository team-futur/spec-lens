import { useState } from 'react';

import { ChevronDown, ChevronRight } from 'lucide-react';

import {
  type ParsedEndpoint,
  type OpenAPISpec,
  type ParameterObject,
  type ResponseObject,
  getMergedParameters,
  isReferenceObject,
  MethodBadge,
  SchemaViewer,
} from '@/entities/openapi';
import { TryItPanel } from '@/features/api-tester';

export function EndpointDetail({
  endpoint,
  spec,
}: {
  endpoint: ParsedEndpoint;
  spec: OpenAPISpec;
}) {
  const { operation, path, method } = endpoint;

  // Get merged parameters
  const allParams = getMergedParameters(endpoint);
  const parameters = allParams.filter((p): p is ParameterObject => !isReferenceObject(p));

  const pathParams = parameters.filter((p) => p.in === 'path');
  const queryParams = parameters.filter((p) => p.in === 'query');
  const headerParams = parameters.filter((p) => p.in === 'header');

  // Get request body schema
  const requestBody = operation.requestBody;
  const requestBodyContent =
    requestBody && !isReferenceObject(requestBody)
      ? requestBody.content?.['application/json']
      : null;

  // Get responses
  const responses = Object.entries(operation.responses || {});

  return (
    <div
      style={{
        padding: '1.5rem',
        maxWidth: '900px',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '0.75rem',
          }}
        >
          <MethodBadge method={method} size='lg' />
          <h1
            style={{
              color: '#e5e5e5',
              fontSize: '1.25rem',
              fontWeight: 600,
              fontFamily: 'monospace',
              wordBreak: 'break-all',
            }}
          >
            {path}
          </h1>
        </div>

        {operation.summary && (
          <p
            style={{
              color: '#e5e5e5',
              fontSize: '1rem',
              marginBottom: '0.5rem',
            }}
          >
            {operation.summary}
          </p>
        )}

        {operation.description && (
          <p
            style={{
              color: '#9ca3af',
              fontSize: '0.875rem',
              lineHeight: 1.6,
            }}
          >
            {operation.description}
          </p>
        )}

        {operation.tags && operation.tags.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              marginTop: '0.75rem',
            }}
          >
            {operation.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  padding: '0.25rem 0.625rem',
                  backgroundColor: 'rgba(107, 114, 128, 0.2)',
                  borderRadius: '0.25rem',
                  color: '#9ca3af',
                  fontSize: '0.75rem',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {operation.deprecated && (
          <div
            style={{
              marginTop: '0.75rem',
              padding: '0.5rem 0.75rem',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              borderRadius: '0.375rem',
              border: '1px solid rgba(239, 68, 68, 0.2)',
            }}
          >
            <span style={{ color: '#ef4444', fontSize: '0.8125rem', fontWeight: 500 }}>
              Deprecated
            </span>
          </div>
        )}
      </div>

      {/* Parameters Section */}
      {parameters.length > 0 && (
        <Section title='Parameters'>
          {pathParams.length > 0 && <ParameterGroup title='Path Parameters' params={pathParams} />}
          {queryParams.length > 0 && (
            <ParameterGroup title='Query Parameters' params={queryParams} />
          )}
          {headerParams.length > 0 && (
            <ParameterGroup title='Header Parameters' params={headerParams} />
          )}
        </Section>
      )}

      {/* Request Body Section */}
      {requestBodyContent?.schema && (
        <Section title='Request Body'>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'rgba(255,255,255,0.02)',
              borderRadius: '0.375rem',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <SchemaViewer schema={requestBodyContent.schema} spec={spec} />
          </div>
        </Section>
      )}

      {/* Responses Section */}
      {responses.length > 0 && (
        <Section title='Responses'>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {responses.map(([statusCode, responseOrRef]) => {
              if (isReferenceObject(responseOrRef)) return null;
              const response = responseOrRef as ResponseObject;
              const responseSchema = response.content?.['application/json']?.schema;

              return (
                <ResponseItem
                  key={statusCode}
                  statusCode={statusCode}
                  response={response}
                  schema={responseSchema}
                  spec={spec}
                />
              );
            })}
          </div>
        </Section>
      )}

      {/* Try It Out Panel */}
      <TryItPanel endpoint={endpoint} spec={spec} />
    </div>
  );
}

// Section Component
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <h2
        style={{
          color: '#e5e5e5',
          fontSize: '0.9375rem',
          fontWeight: 600,
          marginBottom: '0.75rem',
          paddingBottom: '0.5rem',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

// Parameter Group Component
function ParameterGroup({ title, params }: { title: string; params: ParameterObject[] }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <h3
        style={{
          color: '#9ca3af',
          fontSize: '0.75rem',
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '0.5rem',
        }}
      >
        {title}
      </h3>
      <div
        style={{
          backgroundColor: 'rgba(255,255,255,0.02)',
          borderRadius: '0.375rem',
          border: '1px solid rgba(255,255,255,0.1)',
          overflow: 'hidden',
        }}
      >
        {params.map((param, index) => (
          <div
            key={param.name}
            style={{
              padding: '0.75rem 1rem',
              borderBottom: index < params.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.25rem',
              }}
            >
              <span
                style={{
                  color: '#e5e5e5',
                  fontSize: '0.8125rem',
                  fontFamily: 'monospace',
                }}
              >
                {param.name}
              </span>
              {param.required && (
                <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>required</span>
              )}
              {param.schema && !isReferenceObject(param.schema) && param.schema.type && (
                <span
                  style={{
                    color: '#6b7280',
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                  }}
                >
                  {param.schema.type}
                </span>
              )}
            </div>
            {param.description && (
              <p style={{ color: '#9ca3af', fontSize: '0.75rem', margin: 0 }}>
                {param.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Response Item Component
function ResponseItem({
  statusCode,
  response,
  schema,
  spec,
}: {
  statusCode: string;
  response: ResponseObject;
  schema: any;
  spec: OpenAPISpec;
}) {
  const [isExpanded, setIsExpanded] = useState(statusCode.startsWith('2'));

  const statusColor = getStatusCodeColor(statusCode);

  return (
    <div
      style={{
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderRadius: '0.375rem',
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
          gap: '0.75rem',
          padding: '0.75rem 1rem',
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
            color: statusColor,
            fontSize: '0.875rem',
            fontWeight: 600,
            fontFamily: 'monospace',
          }}
        >
          {statusCode}
        </span>
        <span style={{ color: '#9ca3af', fontSize: '0.8125rem' }}>{response.description}</span>
      </button>

      {isExpanded && schema && (
        <div
          style={{
            padding: '0 1rem 1rem',
            borderTop: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <div style={{ paddingTop: '0.75rem' }}>
            <SchemaViewer schema={schema} spec={spec} />
          </div>
        </div>
      )}
    </div>
  );
}

function getStatusCodeColor(statusCode: string): string {
  const code = parseInt(statusCode, 10);
  if (code >= 200 && code < 300) return '#10b981';
  if (code >= 300 && code < 400) return '#3b82f6';
  if (code >= 400 && code < 500) return '#f59e0b';
  if (code >= 500) return '#ef4444';
  return '#6b7280';
}
