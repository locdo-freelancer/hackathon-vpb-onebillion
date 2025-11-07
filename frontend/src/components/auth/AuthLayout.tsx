// Auth Layout Component - Single Responsibility: Layout structure
import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden bg-cyber-darker">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyber-accent/5 via-transparent to-cyber-purple/5" />
      <div className="absolute top-20 left-20 w-96 h-96 bg-cyber-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyber-purple/10 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">{children}</div>
    </div>
  );
};
