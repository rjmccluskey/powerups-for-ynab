import React from 'react';
import { NewAccessToken } from './components/NewAccessToken';
import { UpdateAccessToken } from './components/UpdateAccessToken';

export const Index = () => {
  return (
    <>
      <NewAccessToken />
      <UpdateAccessToken />
    </>
  );
};

export default Index;
