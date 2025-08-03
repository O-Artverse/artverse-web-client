"use client"

import { Button, Card, Input } from '@heroui/react'
import LogoIcon from "@/assets/images/logoIcon.png"
import { useForm, type SubmitHandler } from 'react-hook-form';

import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import type { LoginPostDto } from '@/types/user';
import { useLogin } from '@/hooks/mutations/auth.mutation';

const SignIn = () => {
    const router = useRouter();
    const postLogin = useLogin()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginPostDto>();
    const onSubmit: SubmitHandler<LoginPostDto> = (data) => {
        postLogin.mutate(data, {
            onSuccess: () => {
                router.push("/")
            },
        });
    }
    return (
        <Card className="p-6 h-[531px] w-[424px] mx-auto shadow-lg rounded-[32px] z-10 flex flex-col items-center justify-start bg-white gap-4">
             <div className="flex gap-[18px] w-full justify-center items-center">
                <Image src={LogoIcon} className='w-6' alt={''} />
                <b className='whitespace-nowrap text-xl w-full text-foreground'>Welcome to Artverse</b>
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
                            classNames={{
                                inputWrapper: "w-[344px] !h-[39px] !min-h-0 !py-0 bg-gray-100 border border-gray-300 rounded-xl",
                                input: "text-black placeholder:text-gray-400 text-base font-normal",
                                label: "text-black mb-1 text-xs"
                            }}
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
                            classNames={{
                                inputWrapper: "w-[344px] !h-[39px] !min-h-0 !py-0 bg-gray-100 border border-gray-300 rounded-xl",
                                input: "text-black placeholder:text-gray-400 text-base font-normal",
                                label: "text-black mb-1 text-xs"
                            }}
                        />
                    </div>
                    <a href="#" className="text-xs text-[#9C27B0] hover:underline w-[344px] text-left block mb-1">
                        Forgot your password?
                    </a>
                </div>
                <div className='flex gap-2 flex-col w-full'>
                <Button
                    type="submit"
                    className="w-[344px] bg-[#d243cf] text-white rounded-xl font-semibold transition h-[41px]"
                >
                    Sign In
                </Button>
                <div className="flex items-center justify-center w-[344px]">
                    <span className=" text-foreground text-xs">OR</span>
                </div>
                <Button className=" flex items-center justify-center gap-2 border rounded-xl  border-gray-300  bg-white text-black hover:bg-gray-50 h-[41px]  pl-4">
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                    <span>Sign in with Google</span>
                </Button>
                <div className="text-xs text-center text-gray-500 w-[344px] mt-1">
                    By continuing, you agree to Artverse's{' '}
                    <a href="#" className="underline text-foreground">Terms of Service</a> and{' '}
                    <a href="#" className="underline text-foreground">Privacy Policy</a>.
                </div>
                <div className="text-xs text-center text-gray-500 w-[344px]">
                    <span>You don't have an account? </span>
                    <a href='/sign-up' className="font-semibold text-[#9C27B0] hover:underline">Sign up</a>
                </div>
                <div className="text-xs text-center text-gray-500 w-[344px]">
                    Are you a business?{' '}
                    <a href="#" className="font-semibold text-foreground hover:underline">Get start here!</a>
                </div>
                </div>
            </form>
        </Card>
    )
}

export default SignIn