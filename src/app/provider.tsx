'use client'

import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { store } from '@/store'
export default function AppProvider({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ReduxProvider store={store}>
            {children}
        </ReduxProvider>
    )
}
