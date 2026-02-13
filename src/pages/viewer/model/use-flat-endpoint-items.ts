import { useDeferredValue, useMemo } from 'react';

import { useSearchQuery, useSelectedMethods, useSelectedTags } from '@/entities/endpoint-filter';
import { useExpandedTags } from '@/entities/sidebar';
import {
  filterEndpoints,
  groupEndpointsByTag,
  useSpecStore,
  type EndpointFlatItem,
} from '@/entities/openapi-spec';

export function useFlatEndpointItems() {
  const searchQuery = useSearchQuery();
  const selectedTags = useSelectedTags();
  const selectedMethods = useSelectedMethods();
  const endpoints = useSpecStore((s) => s.endpoints);
  const expandedTags = useExpandedTags();

  const deferredSearchQuery = useDeferredValue(searchQuery);

  const filteredEndpoints = filterEndpoints(endpoints, {
    searchQuery: deferredSearchQuery,
    selectedTags,
    selectedMethods,
  });
  const endpointsByTag = groupEndpointsByTag(filteredEndpoints);
  const tagEntries = Object.entries(endpointsByTag);

  const flatItems = useMemo<EndpointFlatItem[]>(() => {
    const items: EndpointFlatItem[] = [];

    for (const [tag, tagEndpoints] of tagEntries) {
      const isExpanded = expandedTags.includes(tag);
      items.push({ type: 'header', tag, count: tagEndpoints.length, isExpanded });
      if (isExpanded) {
        for (const endpoint of tagEndpoints) {
          items.push({ type: 'endpoint', endpoint });
        }
      }
    }

    return items;
  }, [tagEntries, expandedTags]);

  return {
    flatItems,
  };
}
