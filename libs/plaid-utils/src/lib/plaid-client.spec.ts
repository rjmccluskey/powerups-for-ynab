import { plaidClient } from './plaid-client';

describe('plaidUtils', () => {
  it('should work', () => {
    expect(plaidClient()).toEqual('plaid-utils');
  });
});
