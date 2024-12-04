// components/AuthButton.tsx
"use client"
import React from 'react';
import { useAuth } from '@/app/auth/AuthContext';

const AuthButton: React.FC = () => {
  const { isAuthenticated, login, logout, principal } = useAuth();

  return (
    <div>
      {!isAuthenticated ? (
        <button onClick={login}>Login with Internet Identity</button>
      ) : (
        <div>
          <p>Logged in as {principal?.toString()}</p>
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default AuthButton;
