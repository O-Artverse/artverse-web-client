"use client"

import React from 'react'
import { Button, Card, DatePicker, Input } from '@heroui/react'
import { MailboxIcon } from '@phosphor-icons/react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { Controller, useForm, type SubmitHandler } from 'react-hook-form'
import { useRouter } from 'next/navigation'

import { useRegister } from '@/hooks/mutations/auth.mutation'
import type { RegisterPostDto } from '@/types/user'
import { useAuthForm } from '@/contexts/AuthFormContext'
import { SignUpPostDto } from '@/models/auth/SignUpSchema'


const SignUp = () => {
    const router = useRouter()
    const postRegister = useRegister()
    const { switchForm } = useAuthForm();

    const {
        register,
        handleSubmit,
        watch,
        control,
        formState: { errors },
    } = useForm<SignUpPostDto>()
    const onSubmit: SubmitHandler<SignUpPostDto> = (data) => {
        postRegister.mutate(data, {
            onSuccess: () => {
                // Instead of pushing to sign-in route, switch to sign-in form
                switchForm('sign-in');
            },
        });
    }
    return (
        <Card className="p-5 sm:p-8 md:p-10 h-auto w-full max-w-[380px] md:max-w-[424px] shadow-lg rounded-3xl z-10 flex flex-col items-center justify-start bg-white gap-4">
            <div className="flex gap-[18px] w-full justify-center items-center mb-2">
                <Image src={'/images/logoIcon.png'} className='w-6 h-6' width={24} height={24} alt="Artverse Logo" />
                <b className='whitespace-nowrap text-base sm:text-xl w-full text-foreground !text-black'>Welcome to Artverse</b>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 text-foreground items-center w-full">
                <div className="flex flex-col gap-0 items-center w-full">
                    <Controller
                        control={control}
                        name="email"
                        render={({ field }) => (
                            <div className="flex flex-col w-full items-center mb-2">
                                <Input
                                    {...field}
                                    variant='faded'
                                    label="Email"
                                    labelPlacement="outside"
                                    placeholder="example@artverse.now"
                                    type="email"
                                    classNames={{
                                        inputWrapper: "w-full !h-[39px] !min-h-0 !py-0 bg-gray-100 border border-gray-300 rounded-xl",
                                        input: "text-black placeholder:text-gray-400 text-base font-normal",
                                        label: "text-black mb-1 text-xs"
                                    }}
                                />
                            </div>
                        )}
                    />
                    <Controller
                        control={control}
                        name="password"
                        render={({ field }) => (
                            <div className="flex flex-col w-full items-center mb-2">
                                <Input
                                    {...field}
                                    variant='faded'
                                    label="Password"
                                    labelPlacement="outside"
                                    placeholder="Enter your password"
                                    type="password"
                                    classNames={{
                                        inputWrapper: "w-full !h-[39px] !min-h-0 !py-0 bg-gray-100 border border-gray-300 rounded-xl",
                                        input: "text-black placeholder:text-gray-400 text-base font-normal",
                                        label: "text-black mb-1 text-xs"
                                    }}
                                />
                            </div>
                        )}
                    />
                    <Controller
                        control={control}
                        name="birthdate"
                        render={({ field }) => (
                            <div className="flex flex-col w-full items-center mb-2">
                                <DatePicker
                                    variant='faded'
                                    label="Birthdate"
                                    labelPlacement="outside"
                                    classNames={{
                                        inputWrapper: "w-full !h-[39px] !min-h-0 !py-0 bg-gray-100 border border-gray-300 rounded-xl",
                                        input: "text-black placeholder:text-gray-400 text-base font-normal",
                                        label: "text-black mb-1 text-xs"
                                    }}
                                    onChange={(date) => field.onChange(date)}
                                />
                            </div>
                        )}
                    />
                    <button 
                        type="button" 
                        onClick={() => switchForm('sign-in')} 
                        className="text-xs text-[#9C27B0] hover:underline w-full text-left block mb-1 bg-transparent border-none p-0 cursor-pointer"
                    >
                        Have a account?
                    </button>
                </div>
                <div className='flex gap-2 flex-col w-full items-center'>
                    <Button
                        type="submit"
                        className="w-full bg-primary text-white rounded-xl font-semibold transition h-[41px]"
                        isLoading={postRegister.isPending}
                    >
                        Continue
                    </Button>
                    <div className="flex items-center justify-center w-full">
                        <span className="text-foreground text-xs">OR</span>
                    </div>
                    <Button 
                        className="flex items-center justify-center gap-2 border rounded-xl border-gray-300 bg-white text-black hover:bg-gray-50 w-full h-[41px]"
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
                        <span>Are ready a member? </span>
                        <button 
                            type="button" 
                            onClick={() => switchForm('sign-in')} 
                            className="font-semibold text-[#9C27B0] hover:underline bg-transparent border-none p-0 cursor-pointer"
                        >
                            Sign in
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

export default SignUp