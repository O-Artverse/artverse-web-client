'use client'

import { userData } from '@/data/UserData'
import type { RootState } from '@/store'
import { loginSuccess } from '@/store/slices/authSlice'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const Home = () => {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)

    const { isAuthenticated, user } = useSelector((state: RootState) => state.authentication)

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false)
        }, 1000)

        if (!isAuthenticated) {
            dispatch(loginSuccess({ user: userData, token: '' }))
        }

        return () => clearTimeout(timer)
    }, [dispatch, isAuthenticated])

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false)
        }, 1000)

        return () => clearTimeout(timer)
    }, [])

    return loading ? (
        <Loading />
    ) : (
        <div className="mx-auto max-w-full md:max-w-[1440px]">
            <div>
                {user?.name}
            </div>
        </div>
    )
}

const Loading = () => {
    return (
        <div className="flex flex-col gap-6 p-6 animate-pulse">
            {[...Array(2)].map((_, i) => (
                <div
                    key={i}
                    className="h-40 bg-gray-200 rounded-md "
                />
            ))}
        </div>
    )
}

export default Home
