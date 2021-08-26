import { Config } from './config';
import { NodeEnv } from '@pfy/utils';

export const config: Config = {
  nodeEnv: NodeEnv.test,
  useTracing: false,
  debugBucketName: null,
  accessTokens: ['TOKEN1', 'TOKEN2'],
};
