import { isString } from 'util';

export class Transaction {
  private static idWrapper = '|';

  constructor(
    private readonly id: string,
    // Amount in milliunits, ex: 12340 (instead of '$12.340')
    readonly amount: number,
    // ISO "full date" format: (YYYY-MM-dd)
    readonly date: string,
    readonly description: string
  ) {}

  getId(): string {
    const wrapper = Transaction.idWrapper;
    return `${wrapper}integration-id:${this.id}${wrapper}`;
  }

  static extractId(stringContainingId?: string): string | null {
    if (!isString(stringContainingId)) {
      return null;
    }

    const wrapper = Transaction.idWrapper;
    const regex = new RegExp(`\\${wrapper}.*\\${wrapper}`);
    const matches = stringContainingId.match(regex);

    return (Array.isArray(matches) && matches[0]) || null;
  }
}
