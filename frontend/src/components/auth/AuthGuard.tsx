"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AuthService } from "@/lib/services/auth.service";

// Public routes that don't require authentication
const PUBLIC_ROUTES = ["/login", "/signup", "/"];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = AuthService.isAuthenticated();
      const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

      // If not authenticated and trying to access protected route
      if (!isAuthenticated && !isPublicRoute) {
        router.push("/login");
      }

      // If authenticated and trying to access login/signup, redirect to dashboard
      if (
        isAuthenticated &&
        (pathname === "/login" || pathname === "/signup")
      ) {
        router.push("/dashboard");
      }
    };

    checkAuth();
  }, [pathname, router]);

  return <>{children}</>;
}
