import { Transaction } from './transaction';

export interface TransactionsByAccount {
  [accountName: string]: Transaction[];
}
