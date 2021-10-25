import * as plaid from 'plaid';
import { plaidClient } from '@pfy/plaid-utils';
import { floatToMilliunits, now } from '@pfy/utils';
import { config } from '../config';
import { TransactionsByAccount, Transaction } from '../shared';

export async function getPendingTransactions(): Promise<TransactionsByAccount> {
  console.log('Searching for pending transactions from bank...');

  const mappings = await Promise.all(
    config.accessTokens.map(getTransactionsByAccount)
  );
  const transactionsByAccount = Object.assign({}, ...mappings);

  const totalAccounts = Object.keys(transactionsByAccount).length;
  console.log(`Found pending transactions in ${totalAccounts} account(s).`);

  return transactionsByAccount;
}

async function getTransactionsByAccount(
  accessToken: string
): Promise<TransactionsByAccount> {
  const plaidTransactions = await plaidClient()
    .getAllTransactions(accessToken, getStartDate(), getEndDate())
    .catch((e) => {
      if (e?.error_code === 'ITEM_LOGIN_REQUIRED') {
        console.log(
          `Login required for account token ending in ...${accessToken.substring(
            accessToken.length - 6
          )}`
        );
        return null;
      }

      throw e;
    });

  if (!plaidTransactions) {
    return {};
  }

  const transactionsByAccount = plaidTransactions.transactions
    .filter((transaction) => transaction.pending)
    .filter(amountIsValid)
    .filter(notATransfer)
    .reduce(transactionsByAccountReducer(plaidTransactions.accounts), {});

  return transactionsByAccount;
}

function transactionsByAccountReducer(
  accounts: plaid.Account[]
): (
  byAccount: TransactionsByAccount,
  plaidTransaction: plaid.Transaction
) => TransactionsByAccount {
  return (byAccount, plaidTransaction) => {
    const accountName = getAccountNameById(
      accounts,
      plaidTransaction.account_id
    );
    const currentTransactions = byAccount[accountName] || [];
    byAccount[accountName] = [
      ...currentTransactions,
      mapPlaidToTransaction(plaidTransaction),
    ];
    return byAccount;
  };
}

function getAccountNameById(
  accounts: plaid.Account[],
  accountId: string
): string {
  for (const account of accounts) {
    if (account.account_id === accountId && account.name) {
      return account.name;
    }
  }
  throw new Error(`Could not find account name for accountId: ${accountId}`);
}

function mapPlaidToTransaction(
  plaidTransaction: plaid.Transaction
): Transaction {
  return new Transaction(
    // Charge transactions from plaid come in with positive amounts so multiple by -1
    floatToMilliunits(plaidTransaction.amount) * -1,
    plaidTransaction.date,
    plaidTransaction.name || 'unknown'
  );
}

function amountIsValid(plaidTransaction: plaid.Transaction): boolean {
  return plaidTransaction.amount !== null && plaidTransaction.amount > 1;
}

function notATransfer(plaidTransaction: plaid.Transaction): boolean {
  if (!plaidTransaction.name) {
    return true;
  }
  const match = plaidTransaction.name.match(/transfer/i);
  return match === null;
}

function getEndDate(): string {
  return now().plus({ days: 2 }).toISODate();
}

function getStartDate(): string {
  return now().minus({ days: 10 }).toISODate();
}
