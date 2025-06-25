"use client";
import { Button } from "@heroui/react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import React from "react";

export default function Landing() {
  const router = useRouter();
  const { setTheme } = useTheme();
  const { theme } = useTheme();
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 dark:bg-black bg-white">
      <h1 className="text-4xl dark:text-white text-black font-bold">
        Landing Page
      </h1>
      <Button onPress={() => router.push("/posts")}>Go to demo page (React Query)</Button>
      <Button onPress={() => setTheme(theme === "light" ? "dark" : "light")}>
        Switch Theme
      </Button>
    </div>
  );
}
