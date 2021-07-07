import React, { useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';

export interface PlaidLinkProps {
  linkToken: string;
  onSuccess: (publicToken: string) => void;
  onExit?: () => void;
}

export const PlaidLink = ({ linkToken, onSuccess, onExit }: PlaidLinkProps) => {
  const onSuccessCallback = useCallback(onSuccess, []);

  const { open, ready, error } = usePlaidLink({
    token: linkToken,
    onSuccess: onSuccessCallback,
    onExit,
  });

  if (ready && !error) {
    open();
  } else if (error) {
    return error;
  }

  return null;
};
