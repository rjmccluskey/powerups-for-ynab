import { mapEveryAccount, ynabApi, ynabErrorWrapper } from '@pfy/ynab-utils';
import { plaidClient } from '@pfy/plaid-utils';
import { floatToMilliunits, getEnvVar, now } from '@pfy/utils';
import { SaveTransaction } from 'ynab';
import { AccountsResponse, PlaidError } from 'plaid';

export const main = async () => {
  const ynab = ynabApi();
  const accountNameToBalance = await mapBalancesByAccountName();
  await mapEveryAccount(ynab, async (account, budget) => {
    const accountName = account.note;
    const currentBalance = accountNameToBalance[accountName];
    if (currentBalance !== undefined && account.balance !== currentBalance) {
      const difference = currentBalance - account.balance;
      console.log(
        `Uploading adjustment transaction to ${accountName} for ${difference}`
      );
      await ynab.transactions
        .createTransaction(budget.id, {
          transaction: {
            account_id: account.id,
            date: now().toISODate(),
            amount: difference,
            payee_name: 'Automatic balance adjustment',
            memo: 'Sent from Powerups for YNAB',
            cleared: SaveTransaction.ClearedEnum.Cleared,
            approved: true,
          },
        })
        .catch(ynabErrorWrapper);
    }
  });
};

async function mapBalancesByAccountName(): Promise<{ [name: string]: number }> {
  const plaid = plaidClient();
  const accessTokens = JSON.parse(getEnvVar('NX_BALANCE_ACCESS_TOKENS'));

  const mappings = await Promise.all(
    accessTokens.map(async (accessToken) => {
      let accountsResponse: AccountsResponse;
      try {
        accountsResponse = await plaid.getAccounts(accessToken);
      } catch (e) {
        if (e instanceof PlaidError && e.error_code === 'ITEM_LOGIN_REQUIRED') {
          const lastSix = accessToken.substr(accessToken.length - 6);
          console.error(
            `Login required on access token ending in ...${lastSix}`
          );
          return {};
        }
        throw e;
      }

      return accountsResponse.accounts.reduce((all, account) => {
        all[account.name] = floatToMilliunits(account.balances.current);
        return all;
      }, {});
    })
  );

  return Object.assign({}, ...mappings);
}

// Uncomment when testing locally
// main()
//   .then(() => console.log('done'))
//   .catch((e) => console.log(e));
