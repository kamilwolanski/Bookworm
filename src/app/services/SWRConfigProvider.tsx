'use client';

import { SWRConfig } from 'swr';
import { fetcher } from './fetcher';
import { ReactNode } from 'react';

const SWRConfigProvider = ({ children }: { children: ReactNode }) => {
  return (
    <SWRConfig
      value={{
        fetcher: fetcher,
        revalidateOnFocus: false,
        revalidateIfStale: false,
      }}
    >
      {children}
    </SWRConfig>
  );
};

export default SWRConfigProvider;
