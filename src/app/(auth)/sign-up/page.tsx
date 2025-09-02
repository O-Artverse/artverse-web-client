"use client"

import React from 'react';
import SignUp from '@/components/modules/Auth/SignUp';
import { AuthFormProvider } from '@/contexts/AuthFormContext';
import Image from 'next/image';

export default function SignUpPage() {
    return (
        <AuthFormProvider>
            <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
                {/* Background gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-500/10 to-pink-600/20 z-0"></div>
                
                {/* Pattern overlay */}
                <div className="absolute inset-0 opacity-5 z-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C4DC4' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}></div>
                </div>

                {/* Content container */}
                <div className="container mx-auto relative z-20 px-4 py-8">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
                        {/* Left side - Welcome content */}
                        <div className="w-full lg:w-1/2 text-center lg:text-left">
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Join the Artverse Community
                            </h1>
                            <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 max-w-lg mx-auto lg:mx-0">
                                Create your account and start exploring a world of amazing artworks
                            </p>
                            <div className="hidden lg:block">
                                <div className="flex flex-col gap-4 text-sm text-gray-600">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-purple-600 font-bold">1</span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800">Create Your Profile</h3>
                                            <p className="text-gray-500">Set up your personal art gallery and showcase your taste</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-purple-600 font-bold">2</span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800">Discover Art</h3>
                                            <p className="text-gray-500">Browse thousands of artworks from talented artists worldwide</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-purple-600 font-bold">3</span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800">Connect & Create</h3>
                                            <p className="text-gray-500">Follow artists, save favorites, and build your collection</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right side - Sign up form */}
                        <div className="w-full lg:w-1/2 flex items-center justify-center">
                            <SignUp />
                        </div>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-20 left-20 w-24 h-24 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute top-40 right-20 w-24 h-24 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-20 left-40 w-24 h-24 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>
        </AuthFormProvider>
    );
}