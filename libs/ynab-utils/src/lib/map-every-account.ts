import { Account, API, BudgetSummary } from 'ynab';
import { ynabErrorWrapper } from './ynab-error-wrapper';

export async function mapEveryAccount<T>(
  ynab: API,
  callback: (account: Account, budget: BudgetSummary) => Promise<T>
): Promise<T[]> {
  const budgetsResponse = await ynab.budgets
    .getBudgets()
    .catch(ynabErrorWrapper);

  const promises = [];

  for (const budget of budgetsResponse.data.budgets) {
    const accountsResponse = await ynab.accounts
      .getAccounts(budget.id)
      .catch(ynabErrorWrapper);
    for (const account of accountsResponse.data.accounts) {
      promises.push(callback(account, budget));
    }
  }

  return await Promise.all(promises);
}
