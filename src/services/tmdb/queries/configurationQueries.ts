import { queryConfig } from '../queryConfig';
import { getConfiguration } from '../api/configurationApi';
import { configurationQueryKey } from '../queryKeys/configurationQueryKeys';

// ===== Query Options =====

export const configurationQueryObj = {
  queryKey: configurationQueryKey,
  queryFn: () => getConfiguration(),
  ...queryConfig.configuration,
};
