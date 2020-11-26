import { getEnvVar, NodeEnv } from '@pfy/utils';

export interface Config {
  nodeEnv: NodeEnv;
  useTracing: boolean;
  debugBucketName: string | null;
  plaidAccessToken: string;
}

export const config: Config = {
  nodeEnv: getEnvVar('NODE_ENV', NodeEnv.prod) as NodeEnv,
  useTracing: getEnvVar('USE_TRACING', 'false') === 'true',
  debugBucketName: getEnvVar('DEBUG_BUCKET_NAME', null),
  plaidAccessToken: getEnvVar('NX_PLAID_ACCESS_TOKEN'),
};
