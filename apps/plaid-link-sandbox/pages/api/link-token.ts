import type { NextApiRequest, NextApiResponse } from 'next';
import { plaidClient } from '@pfy/plaid-utils';

export default async function linkTokenHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { link_token } = await plaidClient().createLinkToken({
      user: { client_user_id: '1' },
      client_name: 'Powerups for YNAB',
      products: ['transactions'],
      country_codes: ['US'],
      language: 'en',
    });
    res.status(201).json({ link_token });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
