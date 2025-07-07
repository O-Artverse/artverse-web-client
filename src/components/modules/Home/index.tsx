'use client'

import { useAppSelector } from '@/store/hooks'
import React, { useEffect, useState } from 'react'

const Home = () => {
    const [loading, setLoading] = useState(true)
    const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.authentication)

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false)
        }, 1000)

        return () => clearTimeout(timer)
    }, [])

    if (loading || isLoading) {
        return <div className="text-foreground">Loading...</div>
    }

    return (
        <div className="mx-auto max-w-full md:max-w-[1440px] p-4">
            <div className="text-2xl font-bold text-foreground">
                {isAuthenticated ? (
                    <div>Welcome back, {user?.name}!</div>
                ) : (
                    <div>Please login to continue</div>
                )}
            </div>
        </div>
    )
}

export default Home
