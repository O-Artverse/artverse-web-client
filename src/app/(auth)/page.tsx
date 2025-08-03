"use client"
import { Button } from "@heroui/react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import BannerImg from "@/assets/images/banner.png";
import SignIn from "@/components/modules/Auth/SignIn";
import SignUp from "@/components/modules/Auth/SignUp";
import { CaretCircleRight } from "@phosphor-icons/react";
import Header from "@/components/core/elements/Header";
import { useTheme } from "next-themes";
import AnyTime from "@/components/modules/Home/AnyTime";
import Coming from "@/components/modules/Home/Coming";

export default function Landing() {
  const router = useRouter();
  const { setTheme, theme } = useTheme();
  const pathname = usePathname();
  const [type, setType] = useState<'sign-in' | 'sign-up'>('sign-in');
  useEffect(() => {
    if (pathname.includes('sign-in')) {
      setType('sign-in');
    } else if (pathname.includes('sign-up')) {
      setType('sign-up');
    } else {
      setType('sign-in');
    }
  }, [pathname]);

  return (
    <div className="snap-y snap-mandatory h-screen overflow-y-scroll">
      <section className="relative snap-start h-screen w-full flex items-center justify-center overflow-hidden">
        <Header/>
        <Image
          src={BannerImg}
          alt="Banner"
          fill
          className="object-cover z-0"
          priority
        />
        <div className="absolute inset-0 bg-black opacity-30 z-10"></div>
        <div className="relative z-20 flex flex-row items-center justify-center w-full h-full  ">
          {type === 'sign-in' ? <SignIn /> : <SignUp />}
          <div className="hidden md:flex flex-col items-center justify-center w-1/2 h-full gap-8 px-8">
            <h1 className="flex justify-end text-4xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-white font-bold text-end leading-tight drop-shadow-md w-full">
              Sign in to explore the masterpieces waiting just for you
            </h1>
            <div className="w-full flex justify-end">
              <Button
                className="bg-[#D243CF] rounded-xl px-4 py-2 text-base md:px-5 md:py-4 md:text-lg lg:text-xl font-bold text-white"
                onPress={() => router.push('/posts')}
                endContent={<CaretCircleRight size={24} weight="fill" />}
              >
                Explore
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="snap-start h-screen w-full">
        <AnyTime />
      </section>

      <section className="snap-start h-screen w-full">
        <Coming />
      </section>

      <section className="snap-start w-full h-screen flex flex-col items-center justify-center bg-white">
        <h1 className="text-4xl font-bold mb-6">Landing Page</h1>
        <Button onPress={() => router.push('/posts')}>Go to demo page (React Query)</Button>
        <Button onPress={() => setTheme(theme === 'light' ? 'dark' : 'light')}>Switch Theme</Button>
      </section>
    </div>
  );
}
