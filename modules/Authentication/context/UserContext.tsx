import React, { createContext, useContext, useState, useEffect } from 'react';

import { auth } from '@Configs/Firebase';

interface userContextInterface {
  userId: string | null;
  setUserId: Function;
  user: Object | null;
  setUser: Function;
}

export const UserContext = createContext({} as userContextInterface);

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);

  const authStateChanged = async authState => {
    if (!authState) {
      setUserId(null);
      setUser(null);
      return;
    }

    setUserId(authState.uid);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(authStateChanged);
    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider
      value={{
        userId,
        setUserId,
        user,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
