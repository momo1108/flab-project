import { queryConfig } from '../queryConfig';
import { getCollectionDetail } from '../api/collectionApi';
import { collectionDetailQueryKey } from '../queryKeys/collectionQueryKeys';

// ===== Query Options =====

export const collectionDetailQuery = (id: number) => ({
  queryKey: collectionDetailQueryKey(id),
  queryFn: () => getCollectionDetail(id),
  ...queryConfig.movies,
  enabled: !!id,
});
