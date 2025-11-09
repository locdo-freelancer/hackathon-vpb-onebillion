"use client";

import { useRouter } from "next/navigation";
import { AuthService } from "@/lib/services/auth.service";

export const useLogout = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      "Are you sure you want to logout?\n\nYou will be redirected to the login page."
    );

    if (!confirmed) {
      return; // User cancelled
    }

    // Clear auth token
    AuthService.logout();

    // Redirect to login page
    router.push("/login");
  };

  return { handleLogout };
};
