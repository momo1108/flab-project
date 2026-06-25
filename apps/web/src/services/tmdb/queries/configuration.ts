import { queryConfig } from '../queryConfig';
import { getConfiguration } from '../api/configuration';
import { configurationKeys } from '../queryKeys/configuration';

// ===== Query Options =====

export const configurationQueryObj = {
  queryKey: configurationKeys.all,
  queryFn: () => getConfiguration(),
  ...queryConfig.configuration,
};
