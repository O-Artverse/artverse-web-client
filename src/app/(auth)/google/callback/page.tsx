"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { loginSuccess } from "@/store/slices/authSlice";
import webStorageClient from "@/utils/webStorageClient";
import constants from "@/settings/constants";
import Cookies from 'js-cookie';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");
    const userId = searchParams.get("user_id");
    const error = searchParams.get("error");

    console.log("Callback received:", { accessToken, refreshToken, userId, error });

    if (error) {
      console.error("Authentication error:", error);
      router.push("/sign-in?error=authentication_failed");
      return;
    }

    if (accessToken && refreshToken && userId) {
      try {
      
        // Also store in webStorageClient for compatibility
        webStorageClient.setToken(accessToken, {
          maxAge: 60 * 60 * 24 * 30, // 30 days in seconds
        });
        
        webStorageClient.setRefreshToken(refreshToken, {
          maxAge: 60 * 60 * 24 * 30, // 30 days in seconds
        });
        
        // Update auth state
        dispatch(
          loginSuccess({
            token: accessToken,
            user: {
              id: userId,
            },
          })
        );
        
        console.log("Authentication successful, redirecting to home");
        // Redirect to home page
        router.push("/explore");
      } catch (err) {
        console.error("Error storing authentication data:", err);
        router.push("/sign-in?error=token_storage_failed");
      }
    } else {
      console.error("Missing required auth parameters");
      router.push("/sign-in?error=missing_parameters");
    }
  }, [dispatch, router, searchParams]);

  return null;
} 