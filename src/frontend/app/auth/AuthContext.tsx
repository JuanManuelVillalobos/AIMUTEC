// context/AuthContext.tsx
"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { Principal } from '@dfinity/principal';


interface AuthContextType {
  isAuthenticated: boolean;
  principal: Principal | null;
  login: () => void;
  logout: () => void;
}

// Define the type for props, including the 'children' prop
interface AuthProviderProps {
  children: ReactNode;  // ReactNode represents any valid React child
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [principal, setPrincipal] = useState<Principal | null>(null);
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);

  useEffect(() => {
    const initAuthClient = async () => {
      const client = await AuthClient.create();
      setAuthClient(client);
      const identity = await client.getIdentity();
      if (identity) {
        setPrincipal(Principal.fromText(client.getIdentity().getPrincipal().toString()));
        setIsAuthenticated(true);
      }
    };
    initAuthClient();
  }, []);

  const login = async () => {
    if (authClient) {
      await authClient.login({
        identityProvider: 'https://identity.ic0.app', // Internet Identity's authentication endpoint
        onSuccess: () => {
          setIsAuthenticated(true);
          setPrincipal(Principal.fromText(authClient.getIdentity().getPrincipal().toString()));
        },
      });
    }
  };

  const logout = async () => {
    if (authClient) {
      await authClient.logout();
      setIsAuthenticated(false);
      setPrincipal(null);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, principal, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
