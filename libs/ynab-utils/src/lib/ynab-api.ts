import { API } from 'ynab';
import { getEnvVar } from '@pfy/utils';

export function ynabApi(): API {
  const accessToken = getEnvVar('NX_YNAB_TOKEN');
  return new API(accessToken);
}
