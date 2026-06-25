import { queryConfig } from '../queryConfig';
import { getCollectionDetail } from '../api/collection';
import { collectionKeys } from '../queryKeys/collection';

// ===== Query Options =====

export const collectionDetailQuery = (id: number) => ({
  queryKey: collectionKeys.detail(id),
  queryFn: () => getCollectionDetail(id),
  ...queryConfig.movies,
  enabled: !!id,
});
