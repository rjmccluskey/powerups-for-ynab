import React, { useState } from 'react';
import { PlaidLink } from './PlaidLink';

export const UpdateAccessToken = () => {
  const [linkToken, setLinkToken] = useState<string>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const reset = () => {
    setLoading(false);
    setLinkToken(null);
  };

  function createLinkToken() {
    setLoading(true);
    fetch('/api/update-mode', {
      method: 'POST',
    })
      .then((response) => response.json())
      .then(({ link_token }) => setLinkToken(link_token));
  }

  return (
    <>
      <button type="button" onClick={createLinkToken} disabled={loading}>
        Update Access Token
      </button>
      {linkToken && (
        <PlaidLink linkToken={linkToken} onSuccess={reset} onExit={reset} />
      )}
    </>
  );
};
