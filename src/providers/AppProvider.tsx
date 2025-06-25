'use client'

import { FC, Suspense } from "react";
import ReactQueryProvider from "./ReactQueryProvider";
import StoreProvider from "./StoreProvider";
import AuthProvider from "./AuthProvider";
import { UIProvider } from "./UIProdivder";
import ThemeProvider from "./ThemeProvider";

interface ComponentProps {
  children: React.ReactNode;
}

const AppProvider: FC<ComponentProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <Suspense>
        <StoreProvider>
          <ReactQueryProvider>
            <UIProvider>
              <AuthProvider>
                {children}
              </AuthProvider>
            </UIProvider>
          </ReactQueryProvider>
        </StoreProvider>
      </Suspense>
    </ThemeProvider>
  );
};

export default AppProvider;