import { API } from 'ynab';
import { config } from './config';
import { NodeEnv } from './node-env';
import { handledAsync, retryable } from '@pfy/utils';
import { uploadTransactionsToYnab } from './ynab-api';
import { getPendingTransactions } from './plaid-api';

const ynab = new API(config.ynabToken);

let findAndUploadTransactions = handledAsync(async () => {
    const transactions = await getPendingTransactions();
    await uploadTransactionsToYnab(ynab, transactions);
    return 'success';
}, handleError);

if (config.nodeEnv === NodeEnv.prod) {
  findAndUploadTransactions = retryable(findAndUploadTransactions);
}

export const main = findAndUploadTransactions;

async function handleError(e: Error): Promise<string> {
  // Add things here to do before the error kills the script

  throw e;
}
