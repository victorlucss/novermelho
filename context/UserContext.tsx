import React, { createContext, useContext } from 'react';

interface whateverContextInterface {
  authUser?: Object | null;
  loading: boolean;
}

const WhateverContext = createContext({} as whateverContextInterface);

interface WhateverProviderProps {
  children: React.ReactNode;
}

export const WhateverProvider = ({ children }: WhateverProviderProps) => {
  return (
    <WhateverContext.Provider
      value={{
        authUser: null,
        loading: true,
      }}
    >
      {children}
    </WhateverContext.Provider>
  );
};

export const useWhatever = () => useContext(WhateverContext);
