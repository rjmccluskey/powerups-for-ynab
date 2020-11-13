import { ErrorDetail } from 'ynab';
import { YnabError, ynabErrorWrapper } from '@pfy/ynab-utils';

describe('ynabErrorWrapper', () => {
  it('casts ynab error response to YnabError', () => {
    const errorDetail: ErrorDetail = {
      id: 'abc123',
      name: 'error',
      detail: 'everything broke!',
    };
    expect(() => ynabErrorWrapper({ error: errorDetail })).toThrowError(
      new YnabError(errorDetail)
    );
  });

  it('throws input if it is not an error response from ynab', () => {
    const error = '500';
    expect(() => ynabErrorWrapper(error)).toThrowError(error);
  });
});
