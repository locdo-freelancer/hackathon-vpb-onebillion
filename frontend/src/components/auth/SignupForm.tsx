// Signup Form Component - Single Responsibility: Signup form logic
"use client";

import React, { useState } from "react";
import { EmailInput } from "./EmailInput";
import { PasswordInput } from "./PasswordInput";
import { AuthService } from "@/lib/services/auth.service";
import { SignupCredentials } from "@/types/auth.types";

interface SignupFormProps {
  onSuccess: (email: string) => void;
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
      };

      const response = await AuthService.signup(credentials);

      if (response.success) {
        onSuccess(email);
      } else {
        setError(response.message || "Signup failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
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
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

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
          placeholder="Confirm password"
          required
          showStrengthIndicator={false}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-linear-to-r from-cyber-accent to-cyan-500 hover:from-cyan-500 hover:to-cyber-accent text-cyber-darker font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-glow-cyan disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Creating account..." : "Create account"}
        </button>
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
