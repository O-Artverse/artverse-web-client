'use client'

import { FC, Suspense } from "react";
import ReactQueryProvider from "./ReactQueryProvider";
import StoreProvider from "./StoreProvider";
import AuthProvider from "./AuthProvider";
import { UIProvider } from "./UIProdivder";
import ThemeProvider from "./ThemeProvider";
import { SidebarProvider } from "@/contexts/SidebarContext";

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
                <SidebarProvider>
                  {children}
                </SidebarProvider>
              </AuthProvider>
            </UIProvider>
          </ReactQueryProvider>
        </StoreProvider>
      </Suspense>
    </ThemeProvider>
  );
};

export default AppProvider;