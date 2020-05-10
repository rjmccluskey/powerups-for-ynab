import { NodeEnv } from './node-env';
import { getEnvVar } from '@pfy/utils';

export interface Config {
  ynabToken: string;
  nodeEnv: NodeEnv;
  useTracing: boolean;
  debugBucketName: string|null;
  plaidClientId: string;
  plaidSecret: string;
  plaidPublicKey: string;
  plaidAccessToken: string;
}

export const config: Config = {
  ynabToken: getEnvVar('YNAB_TOKEN'),
  nodeEnv: getEnvVar('NODE_ENV', NodeEnv.prod) as NodeEnv,
  useTracing: getEnvVar('USE_TRACING', 'false') === 'true',
  debugBucketName: getEnvVar('DEBUG_BUCKET_NAME', null),
  plaidClientId: getEnvVar('PLAID_CLIENT_ID'),
  plaidSecret: getEnvVar('PLAID_SECRET'),
  plaidPublicKey: getEnvVar('PLAID_PUBLIC_KEY'),
  plaidAccessToken: getEnvVar('PLAID_ACCESS_TOKEN'),
};
