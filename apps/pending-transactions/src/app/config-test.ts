import { Config } from './config';
import { NodeEnv } from '@pfy/utils';

export const config: Config = {
  nodeEnv: NodeEnv.test,
  useTracing: false,
  debugBucketName: null,
  plaidClientId: 'PLAID_CLIENT_ID',
  plaidSecret: 'PLAID_SECRET',
  plaidPublicKey: 'PLAID_PUBLIC_KEY',
  plaidAccessToken: 'PLAID_ACCESS_TOKEN',
};
