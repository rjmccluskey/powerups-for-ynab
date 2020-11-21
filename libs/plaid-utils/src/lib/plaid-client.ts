import { Client, ClientConfigs, environments } from 'plaid';
import { getEnvVar } from '@pfy/utils';

export function plaidClient(): Client {
  const configs: ClientConfigs = {
    clientID: getEnvVar('NX_PLAID_CLIENT_ID'),
    secret: getEnvVar('NX_PLAID_SECRET'),
    env: environments.development,
    options: {
      version: '2020-09-14',
    },
  };
  return new Client(configs);
}
