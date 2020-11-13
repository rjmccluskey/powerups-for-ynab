import { API, Account, SaveTransaction } from 'ynab';
import { TransactionsByAccount, Transaction } from '../shared';
import { ynabErrorWrapper, mapEveryAccount } from '@pfy/ynab-utils';
import { throwMultiple } from '@pfy/utils';
import { DateTime } from 'luxon';

export async function uploadTransactionsToYnab(
  ynab: API,
  transactions: TransactionsByAccount
): Promise<void> {
  const results: Array<Error | null> = await mapEveryAccount(
    ynab,
    async (account, budget) => {
      const pendingTransactions = transactions[account.note];
      const error = await uploadTransactionsToAccount(
        ynab,
        budget.id,
        account,
        pendingTransactions
      ).catch((e) => e);
      return error || null;
    }
  );

  const errors: Error[] = results.filter((result) => result !== null);
  if (errors.length > 0) {
    throwMultiple(errors);
  }
}

async function uploadTransactionsToAccount(
  ynab: API,
  budgetId: string,
  account: Account,
  pendingTransactions: Transaction[]
): Promise<void> {
  if (pendingTransactions && pendingTransactions.length > 0) {
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - 10); // 10 days ago
    const ynabTransactionsResponse = await ynab.transactions
      .getTransactionsByAccount(budgetId, account.id, sinceDate)
      .catch(ynabErrorWrapper);
    const ynabTransactions = ynabTransactionsResponse.data.transactions.filter(
      (transaction) =>
        transaction.cleared === SaveTransaction.ClearedEnum.Uncleared
    );

    const newTransactions: SaveTransaction[] = [];
    for (const pendingTransaction of pendingTransactions) {
      const existingTransaction = ynabTransactions.find((ynabTransaction) =>
        pendingTransaction.matchesId(ynabTransaction.memo)
      );
      // Only upload new charges (negative amounts)
      if (!existingTransaction && pendingTransaction.amount < 0) {
        const date = convertDate(pendingTransaction.date);
        newTransactions.push({
          account_id: account.id,
          date,
          amount: pendingTransaction.amount,
          payee_name: pendingTransaction.description,
          cleared: SaveTransaction.ClearedEnum.Uncleared,
          memo: pendingTransaction.getId(),
        });
      }
    }

    console.log(
      `Uploading ${newTransactions.length} new transactions from ${account.note}`
    );
    if (newTransactions.length > 0) {
      await ynab.transactions
        .createTransactions(budgetId, {
          transactions: newTransactions,
        })
        .catch(ynabErrorWrapper);
    }
  }
}

/**
 * @param date ISO date string (e.g. "2020-02-22")
 */
export function convertDate(date: string): string {
  const today = DateTime.local().setZone('America/Los_Angeles').toISODate();
  if (date > today) {
    return today;
  }
  return date;
}
