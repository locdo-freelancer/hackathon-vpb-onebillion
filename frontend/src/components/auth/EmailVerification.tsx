// Email Verification Component - Single Responsibility: Email verification screen
"use client";

import React, { useState } from "react";
import { AuthService } from "@/lib/services/auth.service";

interface EmailVerificationProps {
  email: string;
  onBack: () => void;
  onComplete?: () => void; // Optional callback when verification is complete
}

export const EmailVerification: React.FC<EmailVerificationProps> = ({
  email,
  onBack,
  onComplete,
}) => {
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState("");

  const handleResend = async () => {
    setIsResending(true);
    setMessage("");

    try {
      // TODO: Implement resendVerificationEmail in AuthService
      setMessage("Verification email resend feature not yet implemented");
      // const response = await AuthService.resendVerificationEmail(email);
      // setMessage(response.message || "Verification email sent!");
    } catch (error) {
      setMessage("Failed to resend email. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="bg-cyber-card border border-cyber-border rounded-2xl p-8 shadow-2xl backdrop-blur-xl text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-cyber-accent/20 rounded-full mb-6">
        <i className="fas fa-envelope-open-text text-4xl text-cyber-accent" />
      </div>

      <h2 className="text-2xl font-bold text-white mb-3">Check your email</h2>
      <p className="text-gray-400 mb-6">
        We've sent a verification link to
        <br />
        <span className="text-white font-medium">{email}</span>
      </p>

      <div className="bg-cyber-dark border border-cyber-border rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3 text-left">
          <i className="fas fa-info-circle text-cyber-accent mt-1" />
          <div>
            <p className="text-sm text-gray-300 mb-2">
              Click the link in the email to verify your account
            </p>
            <p className="text-xs text-gray-500">
              The link will expire in 24 hours
            </p>
          </div>
        </div>
      </div>

      {onComplete && (
        <button
          onClick={onComplete}
          className="w-full bg-linear-to-r from-cyber-accent to-cyan-500 hover:from-cyan-500 hover:to-cyber-accent text-cyber-darker font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-glow-cyan mb-4"
        >
          <i className="fas fa-check-circle mr-2" />
          Email Verified - Continue to Setup
        </button>
      )}

      {message && (
        <div className="bg-cyber-accent/10 border border-cyber-accent/50 text-cyber-accent px-4 py-3 rounded-lg text-sm mb-4">
          {message}
        </div>
      )}

      <button
        onClick={handleResend}
        disabled={isResending}
        className="w-full bg-cyber-dark hover:bg-cyber-darker border border-cyber-border text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <i className="fas fa-rotate-right mr-2" />
        {isResending ? "Sending..." : "Resend verification email"}
      </button>

      <button
        onClick={onBack}
        className="text-sm text-gray-400 hover:text-white transition-colors"
      >
        <i className="fas fa-arrow-left mr-2" />
        Back to login
      </button>
    </div>
  );
};
