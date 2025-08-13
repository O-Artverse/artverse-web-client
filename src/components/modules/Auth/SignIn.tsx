"use client"

import { addToast, Button, Card, Input } from '@heroui/react'
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import React from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLogin } from '@/hooks/mutations/auth.mutation';
import { AuthService } from '@/services/auth.service';
import { useState, useEffect } from 'react';
import { useAuthForm } from '@/contexts/AuthFormContext';
import { showToast } from '@/utils/showToast';
import { LoginPostDto } from '@/models/auth/LoginSchema';
import { loginSchema } from '@/models/auth/LoginSchema';

const SignIn = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { mutate: postLogin, isPending, isError, error } = useLogin();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { switchForm } = useAuthForm();

    useEffect(() => {
        const errorParam = searchParams.get('error');
        if (errorParam) {
            const errorMsg =
                errorParam === 'authentication_failed' 
                    ? 'Authentication failed. Please try again.' 
                    : errorParam === 'missing_parameters'
                    ? 'Missing authentication parameters. Please try again.'
                    : errorParam === 'token_storage_failed'
                    ? 'Failed to store authentication tokens. Please try again.'
                    : 'An error occurred during login.';
            setErrorMessage(errorMsg);
            showToast({ title: errorMsg, color: 'error' });
        }
    }, [searchParams]);
    
    useEffect(() => {
        if (isError) {
            const msg = error instanceof Error ? error.message : 'Login failed';
            addToast({ title: msg, color: 'danger' });
        }
    }, [isError, error]);
    
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginPostDto>({
        resolver: zodResolver(loginSchema),
    });
    
    const onSubmit: SubmitHandler<LoginPostDto> = (data) => {
        postLogin(data, {
            onSuccess: () => {
                router.push("/explore")
            },
        });
    }

    const handleGoogleLogin = () => {
        try {
            // Get the Google auth URL
            const googleAuthUrl = AuthService.getGoogleAuthUrl();
            console.log("Google Auth URL: ", googleAuthUrl);
            
            // Make sure it has a valid protocol
            if (!googleAuthUrl.startsWith('http://') && !googleAuthUrl.startsWith('https://')) {
                console.error("Invalid Google Auth URL (missing protocol):", googleAuthUrl);
                setErrorMessage("Invalid authentication URL. Please try again later.");
                return;
            }
            
            // Redirect to Google OAuth endpoint
            window.location.href = googleAuthUrl;
        } catch (err) {
            console.error("Error initiating Google login:", err);
            setErrorMessage("Failed to initiate Google login. Please try again later.");
        }
    };
    
    return (
        <Card className="p-5 sm:p-8 md:p-10 h-auto w-full max-w-[380px] md:max-w-[424px] shadow-lg rounded-3xl z-10 flex flex-col items-center justify-start bg-white gap-4">
             <div className="flex gap-[18px] w-full justify-center items-center mb-2">
                <Image src={'/images/logoIcon.png'} className='w-6 h-6' width={24} height={24} alt="Artverse Logo" />
                <b className='whitespace-nowrap text-base sm:text-xl w-full text-foreground !text-black'>Welcome to Artverse</b>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 text-foreground items-center w-full">
                <div className="flex flex-col gap-0 items-center w-full">
                    <div className="flex flex-col w-full items-center mb-2">
                        <Input
                            {...register('email')}
                            variant='faded'
                            label="Email"
                            labelPlacement="outside"
                            placeholder="example@artverse.now"
                            type="email"
                            errorMessage={errors.email?.message}
                            classNames={{
                                inputWrapper: "w-full !h-[39px] !min-h-0 !py-0 bg-gray-100 border border-gray-300 rounded-xl",
                                input: "text-black placeholder:text-gray-400 text-base font-normal",
                                label: "text-black mb-1 text-xs"
                            }}
                            isInvalid={!!errors.email}
                        />
                    </div>
                    <div className="flex flex-col w-full items-center mb-2">
                        <Input
                            {...register('password')}
                            variant='faded'
                            label="Password"
                            labelPlacement="outside"
                            placeholder="Enter your password"
                            type="password"
                            errorMessage={errors.password?.message}
                            classNames={{
                                inputWrapper: "w-full !h-[39px] !min-h-0 !py-0 bg-gray-100 border border-gray-300 rounded-xl",
                                input: "text-black placeholder:text-gray-400 text-base font-normal",
                                label: "text-black mb-1 text-xs"
                            }}
                            isInvalid={!!errors.password}
                        />
                    </div>
                    <a href="#" className="text-xs text-[#9C27B0] hover:underline w-full text-left block mb-1">
                        Forgot your password?
                    </a>
                </div>
                <div className='flex gap-2 flex-col w-full items-center'>
                <Button
                    type="submit"
                    className="w-full bg-primary text-white rounded-xl font-semibold transition h-[41px]"
                    isLoading={isPending}
                >
                    Sign In
                </Button>
                <div className="flex items-center justify-center w-full">
                    <span className="text-foreground text-xs">OR</span>
                </div>
                <Button 
                    className="flex items-center justify-center gap-2 border rounded-xl border-gray-300 bg-white text-black hover:bg-gray-50 w-full h-[41px]"
                    onPress={handleGoogleLogin}
                >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                    <span className="text-xs sm:text-sm">Sign in with Google</span>
                </Button>
                <div className="text-xs text-center text-gray-500 w-full mt-1">
                    By continuing, you agree to Artverse's{' '}
                    <a href="#" className="underline text-foreground !text-black">Terms of Service</a> and{' '}
                    <a href="#" className="underline text-foreground !text-black">Privacy Policy</a>.
                </div>
                <div className="text-xs text-center text-gray-500 w-full">
                    <span>You don't have an account? </span>
                    <button 
                        type="button" 
                        onClick={() => switchForm('sign-up')} 
                        className="font-semibold text-[#9C27B0] hover:underline bg-transparent border-none p-0 cursor-pointer"
                    >
                        Sign up
                    </button>
                </div>
                <div className="text-xs text-center text-gray-500 w-full">
                    <span>Are you a business? </span>
                    <a href="#" className="font-semibold text-foreground hover:underline !text-black">Get start here!</a>
                </div>
                </div>
            </form>
        </Card>
    )
}

export default SignIn