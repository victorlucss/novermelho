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

const formatAuthUser = user => ({
  uid: user.uid,
  email: user.email,
});

export const UserProvider = ({ children }: UserProviderProps) => {
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);

  const authStateChanged = async authState => {
    if (!authState) {
      setUserId(null);
      setUser(null);
      return;
    }

    // var formattedUser = formatAuthUser(authState);
    console.log(authState);
    setUserId(authState.uid);
    // setUser(formatAuthUser);
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
