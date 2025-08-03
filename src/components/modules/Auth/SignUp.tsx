"use client"

import React from 'react'
import { Button, Card, DatePicker, Input } from '@heroui/react'
import { MailboxIcon } from '@phosphor-icons/react'
import LogoIcon from "@/assets/images/logoIcon.png"
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { Controller, useForm, type SubmitHandler } from 'react-hook-form'
import { useRouter } from 'next/navigation'

import { useRegister } from '@/hooks/mutations/auth.mutation'
import type { RegisterPostDto } from '@/types/user'


const SignUp = () => {
    const router = useRouter()
    const postRegister = useRegister()

    const {
        register,
        handleSubmit,
        watch,
        control,
        formState: { errors },
    } = useForm<RegisterPostDto>()
    const onSubmit: SubmitHandler<RegisterPostDto> = (data) => {
        postRegister.mutate(data, {
            onSuccess: () => {
                router.push("/sign-in")
            },
        });
    }
    return (
        <Card className="p-8 h-[654px] w-[424px] mx-auto shadow-lg rounded-[32px] z-10 gap-4">
            <div className="flex gap-[18px] w-full justify-center items-center">
                <Image src={LogoIcon} className='w-6' alt={''} />
                <b className='whitespace-nowrap text-xl w-full text-foreground'>Welcome to Artverse</b>
            </div>
            <div>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 text-foreground">
                    <div className='flex flex-col gap-2.5'>
                        <Controller
                            control={control}
                            name="email"
                            render={({ field }) => (
                                <div>
                                    <Input
                                        {...field}
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
                            )}
                        />
                        <Controller
                            control={control}
                            name="password"
                            render={({ field }) => (
                                <div>
                                    <Input
                                        {...field}
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
                            )}
                        />
                        <Controller
                            control={control}
                            name="birthdate"
                            render={({ field }) => (
                                <DatePicker
                                    variant='faded'
                                    label="Birthdate"
                                    labelPlacement="outside"
                                    classNames={{
                                        inputWrapper: "w-[344px] !h-[39px] !min-h-0 !py-0 bg-gray-100 border border-gray-300 rounded-xl",
                                        input: "text-black placeholder:text-gray-400 text-base font-normal",
                                        label: "text-black mb-1 text-xs"
                                    }}
                                    onChange={(date) => field.onChange(date)}
                                />
                            )}
                        />
                        <a href="#" className="text-xs text-[#9C27B0] hover:underline">
                            Have a account?
                        </a>
                    </div>
                    <div className='flex flex-col gap-2.5'>
                        <Button
                            type="submit"
                            className="w-full bg-[#d243cf] text-white rounded-xl font-semibold transition"
                        >
                            Continue
                        </Button>
                        <div className="flex items-center">
                            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                            <span className="mx-2 text-foreground text-xs">OR</span>
                            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                        </div>
                        <Button className="w-full flex items-center justify-center gap-2 border rounded bg-[#f5f5f5] dark:bg-gray-800 text-foreground hover:bg-gray-50 dark:hover:bg-gray-700">
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                            <span>Sign in with Google</span>
                        </Button>
                        <div className="text-xs text-center text-gray-500 dark:text-gray-400">
                            By continuing, you agree to Artverse's{' '}
                            <a href="#" className="underline text-foreground">Terms of Service</a> and{' '}
                            <a href="#" className="underline text-foreground">Privacy Policy</a>.
                        </div>
                        <div className="text-xs text-center text-gray-500 dark:text-gray-400">
                            <span>Are ready a member? </span>
                            <a href='/sign-in' className="font-semibold text-[#9C27B0] hover:underline">Sign in</a>
                        </div>
                        <div className="text-xs text-center text-gray-500 dark:text-gray-400">
                            Are you a business?{' '}
                            <a href="#" className="font-semibold text-foreground hover:underline">Get start here!</a>
                        </div>
                    </div>
                </form>
            </div>
        </Card>
    )
}

export default SignUp