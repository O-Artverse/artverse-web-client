"use client"

import React, { createContext, useContext, ReactNode, useState } from 'react';

type AuthFormType = 'sign-in' | 'sign-up';

interface AuthFormContextType {
  formType: AuthFormType;
  switchForm: (type: AuthFormType) => void;
}

const AuthFormContext = createContext<AuthFormContextType | undefined>(undefined);

export function AuthFormProvider({ children }: { children: ReactNode }) {
  const [formType, setFormType] = useState<AuthFormType>('sign-in');

  const switchForm = (type: AuthFormType) => {
    setFormType(type);
  };

  return (
    <AuthFormContext.Provider value={{ formType, switchForm }}>
      {children}
    </AuthFormContext.Provider>
  );
}

export const useAuthForm = () => {
  const context = useContext(AuthFormContext);
  if (context === undefined) {
    throw new Error('useAuthForm must be used within an AuthFormProvider');
  }
  return context;
}; 