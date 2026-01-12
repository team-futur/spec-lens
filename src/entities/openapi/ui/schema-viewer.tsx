import { useState } from 'react';

import { ChevronDown, ChevronRight } from 'lucide-react';

import { resolveSchema } from '../lib/openapi-parser.ts';
import {
  isReferenceObject,
  type OpenAPISpec,
  type ReferenceObject,
  type SchemaObject,
} from '../model/openapi-types';

export function SchemaViewer({
  schema,
  spec,
  name,
  depth = 0,
  required = false,
}: {
  schema: SchemaObject | ReferenceObject;
  spec: OpenAPISpec;
  name?: string;
  depth?: number;
  required?: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(depth < 2);

  // Resolve $ref if needed
  const resolvedSchema = isReferenceObject(schema) ? resolveSchema(schema, spec) : schema;

  if (!resolvedSchema) {
    return (
      <div style={{ color: '#ef4444', fontSize: '0.75rem' }}>
        Unable to resolve schema: {isReferenceObject(schema) ? schema.$ref : 'unknown'}
      </div>
    );
  }

  const refName = isReferenceObject(schema) ? schema.$ref.split('/').pop() : null;
  const hasChildren =
    resolvedSchema.type === 'object' ||
    resolvedSchema.type === 'array' ||
    resolvedSchema.allOf ||
    resolvedSchema.oneOf ||
    resolvedSchema.anyOf;

  const getTypeDisplay = (s: SchemaObject): string => {
    if (s.type === 'array' && s.items) {
      const itemSchema = isReferenceObject(s.items) ? resolveSchema(s.items, spec) : s.items;
      if (itemSchema) {
        return `array<${getTypeDisplay(itemSchema)}>`;
      }
      return 'array';
    }
    if (s.enum) {
      return `enum`;
    }
    return s.type || 'any';
  };

  const typeColor = getTypeColor(resolvedSchema.type);

  return (
    <div
      style={{
        marginLeft: depth > 0 ? '1rem' : 0,
        borderLeft: depth > 0 ? '1px solid rgba(255,255,255,0.1)' : 'none',
        paddingLeft: depth > 0 ? '0.75rem' : 0,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.5rem',
          padding: '0.25rem 0',
          cursor: hasChildren ? 'pointer' : 'default',
        }}
        onClick={() => hasChildren && setIsExpanded(!isExpanded)}
      >
        {hasChildren && (
          <span style={{ color: '#666', flexShrink: 0, marginTop: '0.125rem' }}>
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </span>
        )}

        {name && (
          <span
            style={{
              color: '#e5e5e5',
              fontFamily: 'monospace',
              fontSize: '0.8125rem',
            }}
          >
            {name}
            {required && <span style={{ color: '#ef4444' }}>*</span>}
          </span>
        )}

        <span
          style={{
            color: typeColor,
            fontFamily: 'monospace',
            fontSize: '0.75rem',
            opacity: 0.8,
          }}
        >
          {getTypeDisplay(resolvedSchema)}
          {refName && <span style={{ color: '#8b5cf6', marginLeft: '0.25rem' }}>({refName})</span>}
        </span>

        {resolvedSchema.nullable && (
          <span
            style={{
              color: '#6b7280',
              fontSize: '0.625rem',
              padding: '0.125rem 0.25rem',
              backgroundColor: 'rgba(107, 114, 128, 0.2)',
              borderRadius: '0.125rem',
            }}
          >
            nullable
          </span>
        )}
      </div>

      {resolvedSchema.description && (
        <div
          style={{
            color: '#9ca3af',
            fontSize: '0.75rem',
            marginLeft: hasChildren ? '1.25rem' : 0,
            marginBottom: '0.25rem',
          }}
        >
          {resolvedSchema.description}
        </div>
      )}

      {resolvedSchema.enum && (
        <div
          style={{
            marginLeft: hasChildren ? '1.25rem' : 0,
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.25rem',
            marginBottom: '0.25rem',
          }}
        >
          {resolvedSchema.enum.map((value, i) => (
            <span
              key={i}
              style={{
                color: '#f59e0b',
                fontSize: '0.6875rem',
                fontFamily: 'monospace',
                padding: '0.125rem 0.375rem',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                borderRadius: '0.125rem',
              }}
            >
              {String(value)}
            </span>
          ))}
        </div>
      )}

      {isExpanded && hasChildren && (
        <div style={{ marginTop: '0.25rem' }}>
          {/* Object properties */}
          {resolvedSchema.properties &&
            Object.entries(resolvedSchema.properties).map(([propName, propSchema]) => (
              <SchemaViewer
                key={propName}
                name={propName}
                schema={propSchema}
                spec={spec}
                depth={depth + 1}
                required={resolvedSchema.required?.includes(propName)}
              />
            ))}

          {/* Array items */}
          {resolvedSchema.type === 'array' && resolvedSchema.items && (
            <SchemaViewer
              name='items'
              schema={resolvedSchema.items}
              spec={spec}
              depth={depth + 1}
            />
          )}

          {/* allOf */}
          {resolvedSchema.allOf &&
            resolvedSchema.allOf.map((subSchema, i) => (
              <SchemaViewer
                key={`allOf-${i}`}
                name={`allOf[${i}]`}
                schema={subSchema}
                spec={spec}
                depth={depth + 1}
              />
            ))}

          {/* oneOf */}
          {resolvedSchema.oneOf &&
            resolvedSchema.oneOf.map((subSchema, i) => (
              <SchemaViewer
                key={`oneOf-${i}`}
                name={`oneOf[${i}]`}
                schema={subSchema}
                spec={spec}
                depth={depth + 1}
              />
            ))}

          {/* anyOf */}
          {resolvedSchema.anyOf &&
            resolvedSchema.anyOf.map((subSchema, i) => (
              <SchemaViewer
                key={`anyOf-${i}`}
                name={`anyOf[${i}]`}
                schema={subSchema}
                spec={spec}
                depth={depth + 1}
              />
            ))}
        </div>
      )}
    </div>
  );
}

function getTypeColor(type?: string): string {
  switch (type) {
    case 'string':
      return '#10b981';
    case 'number':
    case 'integer':
      return '#3b82f6';
    case 'boolean':
      return '#f59e0b';
    case 'array':
      return '#8b5cf6';
    case 'object':
      return '#ec4899';
    default:
      return '#6b7280';
  }
}
