import { mapEveryAccount, ynabApi } from '@pfy/ynab-utils';

export const main = async () => {
  const ynab = ynabApi();
  await mapEveryAccount(ynab, async (account) => {
    console.log(account);
  });
};
