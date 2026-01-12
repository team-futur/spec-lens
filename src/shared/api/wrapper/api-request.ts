import { Adapter } from '../adapter/adapter.ts';
import { ResponseAdapter } from '../adapter/response-adapter.ts';
import type { AdapterResponseType, ApiResponseType } from '../type/api-type.ts';
import { deepCamelize } from '@/shared/lib';

export async function apiRequest<T>(
  request: Promise<any>,
  adaptFn?: (item: ApiResponseType<T>, status: number) => AdapterResponseType<T>,
): Promise<AdapterResponseType<T>> {
  const response = await request;

  let adapted: AdapterResponseType<T>;

  if (adaptFn) {
    adapted = Adapter.from(response.data).to((item: ApiResponseType<T>) =>
      adaptFn(item, response.status),
    );
  } else {
    adapted = Adapter.from(response.data).to((item: ApiResponseType<T>) =>
      new ResponseAdapter(item).adapt(response.status),
    );
  }

  if (adapted.data != null) {
    adapted.data = deepCamelize<T>(adapted.data);
  }

  return adapted;
}
