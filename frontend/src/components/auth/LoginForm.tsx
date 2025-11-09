/**
 * Login Form Component
 * Single Responsibility: Login form logic and state management
 * Open/Closed: Uses atomic components for extensibility
 * Dependency Inversion: Depends on component and config abstractions
 */
"use client";

import React, { useState } from "react";
import { EmailInput } from "./EmailInput";
import { PasswordInput } from "./PasswordInput";
import { FormButton } from "./FormButton";
import { FormCheckbox } from "./FormCheckbox";
import { FormError } from "./FormError";
import { validateEmail } from "@/config/auth-validation.config";
import { AuthService } from "@/lib/services/auth.service";
import { LoginCredentials } from "@/types/auth.types";

interface LoginFormProps {
  onSuccess: (requiresMFA: boolean, userId?: string) => void;
  onToggleSignup: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onToggleSignup,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    setIsLoading(true);

    try {
      const credentials: LoginCredentials = {
        email,
        password,
        rememberMe,
      };

      const response = await AuthService.login(credentials);

      if (response.success && response.token) {
        // Token already stored in AuthService.login()
        // Redirect to onboarding
        window.location.href = "/onboarding";
      } else {
        setError(response.message || "Login failed");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
        <p className="text-gray-400 text-sm">Access your financial dashboard</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormError message={error} />

        <EmailInput id="email" value={email} onChange={setEmail} required />

        <PasswordInput
          id="password"
          value={password}
          onChange={setPassword}
          required
          showStrengthIndicator={false}
        />

        <div className="flex items-center justify-between">
          <FormCheckbox
            id="remember-me"
            checked={rememberMe}
            onChange={setRememberMe}
            label="Remember me"
          />
          <a
            href="#"
            className="text-sm text-cyber-accent hover:text-cyan-400 transition-colors"
          >
            Forgot password?
          </a>
        </div>

        <FormButton type="submit" isLoading={isLoading} variant="primary">
          {isLoading ? "Signing in..." : "Sign in"}
        </FormButton>
      </form>

      <p className="text-center text-sm text-gray-400 mt-6">
        Don't have an account?
        <button
          onClick={onToggleSignup}
          className="text-cyber-accent hover:text-cyan-400 font-medium transition-colors ml-1"
        >
          Sign up
        </button>
      </p>
    </>
  );
};
