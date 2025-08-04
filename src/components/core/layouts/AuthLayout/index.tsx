"use client"

import React from 'react'
import Header from '@/components/core/elements/Header'

interface AuthLayoutProps {
    readonly children: React.ReactNode
}

function AuthLayout({ children }: AuthLayoutProps) {    
    return (
        <>
            <Header />
            <main className="min-h-screen">
                {children}
            </main>
        </>
    )
}

export default AuthLayout
