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
        // Store using webStorageClient
        webStorageClient.setToken(accessToken, {
          maxAge: 60 * 60 * 24 * 30, // 30 days in seconds
        });
        
        webStorageClient.setRefreshToken(refreshToken, {
          maxAge: 60 * 60 * 24 * 30, // 30 days in seconds
        });
        
        // Also set cookies directly with js-cookie for better browser compatibility
        // Set cookies with and without underscore to ensure compatibility with all parts of the app
        Cookies.set(constants.ACCESS_TOKEN, accessToken, {
          expires: 30, // 30 days
          path: '/',
          sameSite: 'strict'
        });
        
        Cookies.set(constants.REFRESH_TOKEN, refreshToken, {
          expires: 30, // 30 days
          path: '/',
          sameSite: 'strict'
        });
        
        // Also set cookies with names used in axios-client
        Cookies.set('accessToken', accessToken, {
          expires: 30, // 30 days
          path: '/',
          sameSite: 'strict'
        });
        
        Cookies.set('refreshToken', refreshToken, {
          expires: 30, // 30 days
          path: '/',
          sameSite: 'strict'
        });
        
        console.log("Cookies set successfully:", {
          withUnderscore: Cookies.get(constants.ACCESS_TOKEN),
          withoutUnderscore: Cookies.get('accessToken')
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