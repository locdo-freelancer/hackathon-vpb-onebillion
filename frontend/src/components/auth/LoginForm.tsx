// Login Form Component - Single Responsibility: Login form logic
"use client";

import React, { useState } from "react";
import { EmailInput } from "./EmailInput";
import { PasswordInput } from "./PasswordInput";
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
    setIsLoading(true);

    try {
      const credentials: LoginCredentials = {
        email,
        password,
        rememberMe,
      };

      const response = await AuthService.login(credentials);

      if (response.success) {
        onSuccess(response.requiresMFA || false, response.userId);
      } else {
        setError(response.message || "Login failed");
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
        <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
        <p className="text-gray-400 text-sm">Access your financial dashboard</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <EmailInput id="email" value={email} onChange={setEmail} required />

        <PasswordInput
          id="password"
          value={password}
          onChange={setPassword}
          required
          showStrengthIndicator={false}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 bg-cyber-dark border border-cyber-border rounded text-cyber-accent focus:ring-2 focus:ring-cyber-accent"
            />
            <span className="ml-2 text-sm text-gray-400">Remember me</span>
          </label>
          <a
            href="#"
            className="text-sm text-cyber-accent hover:text-cyan-400 transition-colors"
          >
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-linear-to-r from-cyber-accent to-cyan-500 hover:from-cyan-500 hover:to-cyber-accent text-cyber-darker font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-glow-cyan disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
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
