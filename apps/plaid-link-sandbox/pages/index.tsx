import React, { useCallback, useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';

const PlaidLink = ({ token }: { token: string }) => {
  const onSuccess = useCallback((token) => {
    fetch('/api/access-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        publicToken: token,
      }),
    });
  }, []);

  const { open, ready, error } = usePlaidLink({
    token,
    onSuccess,
  });

  return (
    <button
      type="button"
      onClick={() => open()}
      disabled={!ready || Boolean(error)}
    >
      Open Plaid Link
    </button>
  );
};

export const Index = () => {
  const [token, setToken] = useState(null);

  async function createLinkToken(): Promise<void> {
    const response = await fetch('/api/link-token', {
      method: 'POST',
    });
    const { link_token } = await response.json();
    setToken(link_token);
  }

  useEffect(() => {
    createLinkToken();
  }, []);

  return (token && <PlaidLink token={token} />) || 'loading';
};

export default Index;
