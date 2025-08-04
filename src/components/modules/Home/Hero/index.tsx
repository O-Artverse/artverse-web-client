"use client"
import { Button } from "@heroui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import BannerImg from "@/assets/images/banner.png";
import SignIn from "@/components/modules/Auth/SignIn";
import SignUp from "@/components/modules/Auth/SignUp";
import { CaretCircleRight } from "@phosphor-icons/react";
import { AuthFormProvider, useAuthForm } from "@/contexts/AuthFormContext";

// Form switcher component that renders either SignIn or SignUp based on context
const AuthFormSwitcher = () => {
    const { formType } = useAuthForm();
    return formType === 'sign-in' ? <SignIn /> : <SignUp />;
}

export default function Hero() {
    const router = useRouter();

    return (
        <AuthFormProvider>
            <section className="relative snap-start h-screen w-full flex items-center justify-center overflow-hidden">
                {/* Background image */}
                <Image
                    src={BannerImg}
                    alt="Banner"
                    fill
                    className="object-cover z-0"
                    priority
                />
                <div className="absolute inset-0 bg-black opacity-30 z-10"></div>

                {/* Content container */}
                <div className="container mx-auto relative z-20 px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        {/* Auth forms container */}
                        <div className="w-full md:w-1/2 flex items-center justify-center mb-8 md:mb-0">
                            <AuthFormSwitcher />
                        </div>

                        {/* Hero content */}
                        <div className="hidden md:flex flex-col items-end justify-center w-full md:w-1/2 gap-6">
                            <h1 className="text-4xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-white font-bold text-right leading-tight drop-shadow-md max-w-xl mr-16">
                                Sign in to explore the masterpieces waiting just for you
                            </h1>
                            <div className="mr-16">
                                <Button
                                    className="bg-primary hover:bg-primary/80 rounded-full px-6 py-3 text-base md:text-lg font-bold text-white flex items-center gap-2"
                                    onPress={() => router.push('/posts')}
                                    endContent={<CaretCircleRight size={24} weight="fill" />}
                                >
                                    Explore
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </AuthFormProvider>
    )
}
