import React, { useState } from 'react';
import { PlaidLink } from './PlaidLink';

export const NewAccessToken = () => {
  const [linkToken, setLinkToken] = useState<string>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const onSuccess = (publicToken) => {
    fetch('/api/access-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicToken }),
    });
    setLoading(false);
    setLinkToken(null);
  };

  function createLinkToken() {
    setLoading(true);
    fetch('/api/link-token', {
      method: 'POST',
    })
      .then((response) => response.json())
      .then(({ link_token }) => setLinkToken(link_token));
  }

  return (
    <>
      <button type="button" onClick={createLinkToken} disabled={loading}>
        Get Access Token
      </button>
      {linkToken && (
        <PlaidLink
          linkToken={linkToken}
          onSuccess={onSuccess}
          onExit={() => {
            setLoading(false);
            setLinkToken(null);
          }}
        />
      )}
    </>
  );
};
