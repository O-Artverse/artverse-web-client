"use client"
import { Button } from "@heroui/react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import BannerImg from "@/assets/images/banner.png";
import SignIn from "@/components/modules/Auth/SignIn";
import SignUp from "@/components/modules/Auth/SignUp";
import { CaretCircleRight } from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import AnyTime from "@/components/modules/Home/AnyTime";
import Coming from "@/components/modules/Home/Coming";
import LogoIcon from "@/assets/images/logoIcon.png";
import Footer from "@/components/modules/Home/Footer";
import Hero from "@/components/modules/Home/Hero";

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
      {/* Hero Section with Authentication */}
      <Hero />

      {/* AnyTime Section */}
      {/* <section className="snap-start h-screen w-full">
        <AnyTime />
      </section> */}

      {/* Coming Section */}
      {/* <section className="snap-start h-screen w-full">
        <Coming />
      </section> */}

      {/* Demo Section */}
      {/* <section className="snap-start w-full h-screen flex flex-col items-center justify-center bg-white">
        <h1 className="text-4xl font-bold mb-6">Landing Page</h1>
        <Button onPress={() => router.push('/posts')}>Go to demo page (React Query)</Button>
        <Button onPress={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="mt-4">
          Switch Theme
        </Button>
      </section> */}

      {/* Footer Section */}
      <Footer />
    </div>
  );
}
