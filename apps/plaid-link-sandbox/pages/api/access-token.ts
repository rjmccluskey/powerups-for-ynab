import type { NextApiRequest, NextApiResponse } from 'next';
import { plaidClient } from '@pfy/plaid-utils';

export default async function linkTokenHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const response = await plaidClient().exchangePublicToken(
      req.body.publicToken
    );
    console.log(response);
    res.status(201).json({ status: 'created' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
