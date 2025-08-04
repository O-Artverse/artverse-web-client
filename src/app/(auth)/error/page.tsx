"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@heroui/react";

export default function AuthErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "authentication_failed") {
      setErrorMessage("Authentication failed. Please try again.");
    } else if (error === "missing_parameters") {
      setErrorMessage("Missing required authentication parameters. Please try again.");
    } else {
      setErrorMessage("An unknown error occurred during authentication.");
    }
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <div className="text-red-500 text-5xl mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
        <p className="text-gray-600 mb-6">{errorMessage}</p>
        <div className="flex flex-col gap-3">
          <Button 
            className="w-full bg-primary text-white rounded-xl font-semibold transition"
            onPress={() => router.push("/sign-in")}
          >
            Back to Sign In
          </Button>
          <Button 
            className="w-full border border-gray-300 bg-white text-black hover:bg-gray-50 rounded-xl"
            onPress={() => router.push("/")}
          >
            Go to Home
          </Button>
        </div>
      </div>
    </div>
  );
} 