// MFA Modal Component - Single Responsibility: Two-factor authentication modal
"use client";

import React, { useState } from "react";
import { useMFAInput } from "@/hooks/useMFAInput";

interface MFAModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (code: string) => Promise<void>;
}

export const MFAModal: React.FC<MFAModalProps> = ({
  isOpen,
  onClose,
  onVerify,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    code,
    inputRefs,
    handleInput,
    handleKeyDown,
    handlePaste,
    getFullCode,
    isComplete,
  } = useMFAInput();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isComplete()) return;

    setIsLoading(true);
    try {
      await onVerify(getFullCode());
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-cyber-card border border-cyber-border rounded-2xl p-8 max-w-md w-full shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <i className="fas fa-times text-xl" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-cyber-purple/20 rounded-full mb-4">
            <i className="fas fa-mobile-screen-button text-3xl text-cyber-purple" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Two-Factor Authentication
          </h3>
          <p className="text-gray-400 text-sm">
            Enter the 6-digit code from your authenticator app
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-2 justify-center">
            {code.map((digit, index) => (
              <React.Fragment key={index}>
                {index === 3 && <div className="w-4" />}
                <input
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInput(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-14 bg-cyber-dark border border-cyber-border text-white text-center text-2xl font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-cyber-purple focus:border-transparent transition-all duration-200"
                  pattern="[0-9]"
                />
              </React.Fragment>
            ))}
          </div>

          <button
            type="submit"
            disabled={!isComplete() || isLoading}
            className="w-full bg-gradient-to-r from-cyber-purple to-purple-600 hover:from-purple-600 hover:to-cyber-purple text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-glow-purple disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Verifying..." : "Verify Code"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Didn't receive a code?
            <button className="text-cyber-purple hover:text-purple-400 font-medium transition-colors ml-1">
              Resend
            </button>
          </p>
          <p className="text-xs text-gray-500 mt-2">
            <i className="fas fa-clock mr-1" />
            Code expires in 5:00
          </p>
        </div>
      </div>
    </div>
  );
};
