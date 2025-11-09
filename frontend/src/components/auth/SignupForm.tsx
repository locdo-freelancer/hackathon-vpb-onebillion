/**
 * Signup Form Component
 * Single Responsibility: Signup form logic and state management
 * Open/Closed: Uses atomic components for extensibility
 * Dependency Inversion: Depends on component and config abstractions
 */
"use client";

import React, { useState } from "react";
import { EmailInput } from "./EmailInput";
import { PasswordInput } from "./PasswordInput";
import { FormButton } from "./FormButton";
import { FormError } from "./FormError";
import {
  validateEmail,
  validatePassword,
} from "@/config/auth-validation.config";
import { AuthService } from "@/lib/services/auth.service";
import { SignupCredentials } from "@/types/auth.types";

interface SignupFormProps {
  onSuccess: () => void;
  onToggleLogin: () => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({
  onSuccess,
  onToggleLogin,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const credentials: SignupCredentials = {
        email,
        password,
        confirmPassword,
        fullName: email.split("@")[0], // Extract from email as default
      };

      const response = await AuthService.register(credentials);

      if (response.success) {
        // Redirect directly to onboarding
        onSuccess();
      } else {
        setError(response.message || "Registration failed");
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
        <h2 className="text-2xl font-bold text-white mb-2">
          Create an account
        </h2>
        <p className="text-gray-400 text-sm">
          Join millions managing their finances smarter
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormError message={error} />

        <EmailInput
          id="signup-email"
          value={email}
          onChange={setEmail}
          required
        />

        <PasswordInput
          id="signup-password"
          value={password}
          onChange={setPassword}
          required
          showStrengthIndicator={true}
        />

        <PasswordInput
          id="confirm-password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          label="Confirm Password"
          placeholder="Confirm password"
          required
          showStrengthIndicator={false}
        />

        <FormButton type="submit" isLoading={isLoading} variant="primary">
          {isLoading ? "Creating account..." : "Create account"}
        </FormButton>
      </form>

      <p className="text-center text-sm text-gray-400 mt-6">
        Already have an account?
        <button
          onClick={onToggleLogin}
          className="text-cyber-accent hover:text-cyan-400 font-medium transition-colors ml-1"
        >
          Sign in
        </button>
      </p>
    </>
  );
};
