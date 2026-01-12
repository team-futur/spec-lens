import {
  type OpenAPISpec,
  type ParsedEndpoint,
  type EndpointsByTag,
  type HttpMethod,
  type SchemaObject,
  type ReferenceObject,
  HTTP_METHODS,
  isReferenceObject,
} from '../model/openapi-types.ts';

/**
 * Parse OpenAPI spec and extract all endpoints
 */
export function parseEndpoints(spec: OpenAPISpec): ParsedEndpoint[] {
  const endpoints: ParsedEndpoint[] = [];

  for (const [path, pathItem] of Object.entries(spec.paths)) {
    if (!pathItem) continue;

    for (const method of HTTP_METHODS) {
      const operation = pathItem[method];
      if (operation) {
        endpoints.push({
          path,
          method,
          operation,
          pathItem,
        });
      }
    }
  }

  return endpoints;
}

/**
 * Group endpoints by their first tag
 */
export function groupEndpointsByTag(endpoints: ParsedEndpoint[]): EndpointsByTag {
  const grouped: EndpointsByTag = {};
  const untagged: ParsedEndpoint[] = [];

  for (const endpoint of endpoints) {
    const tags = endpoint.operation.tags;
    if (tags && tags.length > 0) {
      const primaryTag = tags[0];
      if (!grouped[primaryTag]) {
        grouped[primaryTag] = [];
      }
      grouped[primaryTag].push(endpoint);
    } else {
      untagged.push(endpoint);
    }
  }

  if (untagged.length > 0) {
    grouped['untagged'] = untagged;
  }

  return grouped;
}

/**
 * Get all unique tags from spec
 */
export function getAllTags(spec: OpenAPISpec): string[] {
  const tagSet = new Set<string>();

  // From spec.tags
  if (spec.tags) {
    for (const tag of spec.tags) {
      tagSet.add(tag.name);
    }
  }

  // From operations
  for (const pathItem of Object.values(spec.paths)) {
    if (!pathItem) continue;
    for (const method of HTTP_METHODS) {
      const operation = pathItem[method];
      if (operation?.tags) {
        for (const tag of operation.tags) {
          tagSet.add(tag);
        }
      }
    }
  }

  return Array.from(tagSet).sort();
}

/**
 * Resolve a $ref reference to its actual schema
 */
export function resolveRef<T>(ref: string, spec: OpenAPISpec): T | null {
  // Format: #/components/schemas/SchemaName
  const parts = ref.replace('#/', '').split('/');

  let current: unknown = spec;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return null;
    }
  }

  return current as T;
}

/**
 * Resolve schema, following $ref if needed
 */
export function resolveSchema(
  schemaOrRef: SchemaObject | ReferenceObject | undefined,
  spec: OpenAPISpec,
): SchemaObject | null {
  if (!schemaOrRef) return null;

  if (isReferenceObject(schemaOrRef)) {
    return resolveRef<SchemaObject>(schemaOrRef.$ref, spec);
  }

  return schemaOrRef;
}

/**
 * Get parameters for an endpoint, merging path-level and operation-level
 */
export function getMergedParameters(endpoint: ParsedEndpoint) {
  const pathParams = endpoint.pathItem.parameters || [];
  const operationParams = endpoint.operation.parameters || [];

  // Operation params override path params with same name+in
  const paramMap = new Map<string, (typeof pathParams)[0]>();

  for (const param of pathParams) {
    if (!isReferenceObject(param)) {
      paramMap.set(`${param.in}:${param.name}`, param);
    }
  }

  for (const param of operationParams) {
    if (!isReferenceObject(param)) {
      paramMap.set(`${param.in}:${param.name}`, param);
    }
  }

  return Array.from(paramMap.values());
}

/**
 * Filter endpoints by search query
 */
export function filterEndpoints(
  endpoints: ParsedEndpoint[],
  options: {
    searchQuery?: string;
    selectedTags?: string[];
    selectedMethods?: HttpMethod[];
  },
): ParsedEndpoint[] {
  const { searchQuery, selectedTags, selectedMethods } = options;

  return endpoints.filter((endpoint) => {
    // Filter by method
    if (selectedMethods && selectedMethods.length > 0) {
      if (!selectedMethods.includes(endpoint.method)) {
        return false;
      }
    }

    // Filter by tag
    if (selectedTags && selectedTags.length > 0) {
      const endpointTags = endpoint.operation.tags || [];
      if (!endpointTags.some((tag) => selectedTags.includes(tag))) {
        return false;
      }
    }

    // Filter by search query
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const path = endpoint.path.toLowerCase();
      const summary = (endpoint.operation.summary || '').toLowerCase();
      const description = (endpoint.operation.description || '').toLowerCase();
      const operationId = (endpoint.operation.operationId || '').toLowerCase();

      if (
        !path.includes(query) &&
        !summary.includes(query) &&
        !description.includes(query) &&
        !operationId.includes(query)
      ) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Validate if the given object is a valid OpenAPI 3.x spec
 */
export function validateOpenAPISpec(obj: unknown): { valid: boolean; error?: string } {
  if (!obj || typeof obj !== 'object') {
    return { valid: false, error: 'Invalid JSON object' };
  }

  const spec = obj as Record<string, unknown>;

  if (!spec.openapi || typeof spec.openapi !== 'string') {
    return { valid: false, error: 'Missing or invalid "openapi" field' };
  }

  if (!spec.openapi.startsWith('3.')) {
    return {
      valid: false,
      error: `Unsupported OpenAPI version: ${spec.openapi}. Only 3.x is supported.`,
    };
  }

  if (!spec.info || typeof spec.info !== 'object') {
    return { valid: false, error: 'Missing or invalid "info" object' };
  }

  if (!spec.paths || typeof spec.paths !== 'object') {
    return { valid: false, error: 'Missing or invalid "paths" object' };
  }

  return { valid: true };
}

/**
 * Get method color for UI display
 */
export function getMethodColor(method: HttpMethod): string {
  const colors: Record<HttpMethod, string> = {
    get: '#10b981',
    post: '#3b82f6',
    put: '#f59e0b',
    delete: '#ef4444',
    patch: '#8b5cf6',
    options: '#6b7280',
    head: '#6b7280',
    trace: '#6b7280',
  };
  return colors[method] || '#6b7280';
}

/**
 * recursively generate example value from schema
 */
export function generateExample(
  schemaOrRef: SchemaObject | ReferenceObject | undefined,
  spec: OpenAPISpec,
  depth = 0,
): unknown {
  if (!schemaOrRef) return null;

  // Prevent infinite recursion
  if (depth > 5) return null;

  const schema = resolveSchema(schemaOrRef, spec);
  if (!schema) return null;

  // 1. Use explicit example/default if present
  if (schema.example !== undefined) return schema.example;
  if (schema.default !== undefined) return schema.default;

  // 2. Generate based on type
  switch (schema.type) {
    case 'object':
      const obj: Record<string, unknown> = {};
      if (schema.properties) {
        for (const [key, propSchema] of Object.entries(schema.properties)) {
          obj[key] = generateExample(propSchema, spec, depth + 1);
        }
      }
      return obj;

    case 'array':
      if (schema.items) {
        // Return array with one example item
        return [generateExample(schema.items, spec, depth + 1)];
      }
      return [];

    case 'string':
      if (schema.enum && schema.enum.length > 0) return schema.enum[0];
      if (schema.format === 'date') return '2024-01-01';
      if (schema.format === 'date-time') return '2024-01-01T12:00:00Z';
      if (schema.format === 'email') return 'user@example.com';
      if (schema.format === 'uri') return 'https://example.com';
      if (schema.format === 'uuid') return '3fa85f64-5717-4562-b3fc-2c963f66afa6';
      return 'string';

    case 'integer':
    case 'number':
      return 0;

    case 'boolean':
      return true;

    default:
      return null;
  }
}

/**
 * Legacy wrapper for backward compatibility if needed, though we should migrate usage.
 */
export function getSchemaExample(schema: SchemaObject): unknown {
  // Simple non-recursive fallback for legacy calls without spec
  return generateExample(schema, { openapi: '3.0.0', info: {} as any, paths: {} });
}
