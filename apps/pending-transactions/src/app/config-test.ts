import { Config } from './config';
import { NodeEnv } from './node-env';

export const config: Config = {
  ynabToken: 'YNAB_TOKEN',
  nodeEnv: NodeEnv.test,
  useTracing: false,
  debugBucketName: null,
  plaidClientId: 'PLAID_CLIENT_ID',
  plaidSecret: 'PLAID_SECRET',
  plaidPublicKey: 'PLAID_PUBLIC_KEY',
  plaidAccessToken: 'PLAID_ACCESS_TOKEN',
};
