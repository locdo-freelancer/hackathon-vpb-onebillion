"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Auth Protection Hook
 * Redirects unauthenticated users to login page
 * Use this hook in any protected page/component that requires authentication
 */
export const useAuthProtection = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      // No token found, redirect to login
      router.push("/login");
    }
  }, [router]);

  return {
    isAuthenticated: typeof window !== "undefined" && !!localStorage.getItem("token"),
  };
};
