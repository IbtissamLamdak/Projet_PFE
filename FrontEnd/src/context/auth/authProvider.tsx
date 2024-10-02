import React, { createContext, useState, useMemo, useEffect } from 'react';

type AuthType = {
  username?: string;
  role?: string;
  accessToken?: string;
};

type AuthContextType = {
  auth: AuthType;
  setAuth: React.Dispatch<React.SetStateAction<AuthType>>;
};

const AuthContext = createContext<AuthContextType>({
  auth: {} as AuthType,
  setAuth: () => {},
});

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState<AuthType>(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      return { accessToken: token };
    }
    return {} as AuthType;
  });

  useEffect(() => {
    if (auth.accessToken) {
      localStorage.setItem('access_token', auth.accessToken);
    } else {
      localStorage.removeItem('access_token');
    }
  }, []);

  const contextValues = useMemo(() => {
    return { auth, setAuth };
  }, [auth, setAuth]);

  return (
    <AuthContext.Provider value={contextValues}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
