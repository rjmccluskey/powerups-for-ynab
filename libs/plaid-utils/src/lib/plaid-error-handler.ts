import { PlaidError } from 'plaid';

export function plaidErrorHandler(accessToken: string): (e: Error) => null {
  return (e) => {
    if (e instanceof PlaidError) {
      const last6Token = accessToken.substring(accessToken.length - 6);
      console.log(
        `Failed plaid API request (${e.error_code}) for access token ending in ...${last6Token}`
      );
      return null;
    }

    throw e;
  };
}
