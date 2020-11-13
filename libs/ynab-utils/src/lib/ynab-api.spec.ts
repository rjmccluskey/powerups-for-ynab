import { API } from 'ynab';
import { ynabApi } from './ynab-api';

describe('ynab-utils', () => {
  const originalEnv = process.env;

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('ynabApi', () => {
    it('throws exception if env var is missing', () => {
      expect(ynabApi).toThrow();
    });

    it('returns instance of API with valid token', () => {
      process.env.YNAB_TOKEN = 'abc123';
      expect(ynabApi()).toBeInstanceOf(API);
    });
  });
});
