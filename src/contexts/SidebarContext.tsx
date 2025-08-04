"use client"

import React, { createContext, useContext, useState } from 'react';

export type SideBarUnRouteKey = 'notifications' | 'messages';

interface SidebarContextType {
    activeSideBarUnRoute: SideBarUnRouteKey | null;
    setActiveSideBarUnRoute: (key: SideBarUnRouteKey | null) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
    const [activeSideBarUnRoute, setActiveSideBarUnRoute] = useState<SideBarUnRouteKey | null>(null);
    
    const handleSetActiveSideBarUnRoute = (key: SideBarUnRouteKey | null) => {
        setActiveSideBarUnRoute(key as SideBarUnRouteKey);
    };

    return (
        <SidebarContext.Provider value={{ activeSideBarUnRoute, setActiveSideBarUnRoute: handleSetActiveSideBarUnRoute }}>
            {children}
        </SidebarContext.Provider>
    )
}

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
}