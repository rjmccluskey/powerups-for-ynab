import type { NextApiRequest, NextApiResponse } from 'next';
import { plaidClient } from '@pfy/plaid-utils';

export default async function updateModeHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { link_token } = await plaidClient().createLinkToken({
      user: { client_user_id: '1' },
      client_name: 'Powerups for YNAB',
      country_codes: ['US'],
      language: 'en',
      access_token: process.env.NX_UPDATE_ACCESS_TOKEN,
    });
    res.status(201).json({ link_token });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
