import { mapEveryAccount, ynabApi, ynabErrorWrapper } from '@pfy/ynab-utils';
import { plaidClient } from '@pfy/plaid-utils';
import { getEnvVar } from '@pfy/utils';
import { DateTime } from 'luxon';
import { SaveTransaction } from 'ynab';

export const main = async () => {
  const plaid = plaidClient();
  const ynab = ynabApi();
  const accessTokens = JSON.parse(getEnvVar('NX_BALANCE_ACCESS_TOKENS'));
  for (const accessToken of accessTokens) {
    const accountsResponse = await plaid.getAccounts(accessToken);
    const accountNameToBalance: {
      [name: string]: number;
    } = accountsResponse.accounts.reduce((all, account) => {
      all[account.name] = Math.round(account.balances.current * 1000);
      return all;
    }, {});
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
              date: DateTime.local().setZone('America/Los_Angeles').toISODate(),
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
  }
};

// Uncomment when testing locally
// main()
//   .then(() => console.log('done'))
//   .catch((e) => console.log(e));
