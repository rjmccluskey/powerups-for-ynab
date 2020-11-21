import { Config } from './config';
import { NodeEnv } from '@pfy/utils';

export const config: Config = {
  nodeEnv: NodeEnv.test,
  useTracing: false,
  debugBucketName: null,
  plaidAccessToken: 'PLAID_ACCESS_TOKEN',
};
