import {
  API,
  Account,
  SaveTransaction,
  TransactionDetail,
  TransactionsResponse,
} from 'ynab';
import { ynabErrorWrapper, mapEveryAccount } from '@pfy/ynab-utils';
import { throwMultiple, now } from '@pfy/utils';
import { TransactionsByAccount, Transaction } from '../shared';

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
    const sinceDate = now().minus({ days: 10 }).toJSDate();
    const ynabTransactionsResponse: TransactionsResponse = await ynab.transactions
      .getTransactionsByAccount(budgetId, account.id, sinceDate)
      .catch(ynabErrorWrapper);

    const ynabTransactions = mapYnabTransactionsById(ynabTransactionsResponse);

    const newTransactions: SaveTransaction[] = [];
    for (const pendingTransaction of pendingTransactions) {
      const existingTransaction = ynabTransactions[pendingTransaction.getId()];
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

    if (newTransactions.length > 0) {
      await ynab.transactions
        .createTransactions(budgetId, {
          transactions: newTransactions,
        })
        .catch(ynabErrorWrapper);
    }
    console.log(
      `Uploaded ${newTransactions.length} new transactions from ${account.note}`
    );
  }
}

function mapYnabTransactionsById(
  transactionsResponse: TransactionsResponse
): { [id: string]: TransactionDetail } {
  return transactionsResponse.data.transactions.reduce(
    (mapping, ynabTransaction) => {
      const id = Transaction.extractId(ynabTransaction.memo);
      if (id) {
        mapping[id] = ynabTransaction;
      }
      return mapping;
    },
    {}
  );
}

/**
 * @param date ISO date string (e.g. "2020-02-22")
 */
export function convertDate(date: string): string {
  const todayDateString = now().toISODate();
  if (date > todayDateString) {
    return todayDateString;
  }
  return date;
}
