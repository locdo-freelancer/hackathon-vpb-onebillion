// Auth Header Component - Single Responsibility: Display auth header
import React from "react";

export const AuthHeader: React.FC = () => {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyber-accent to-cyber-purple rounded-xl mb-4 shadow-glow-cyan">
        <i className="fas fa-building-columns text-2xl text-white" />
      </div>
      <h1 className="text-3xl font-bold text-white mb-2">One Billion</h1>
      <p className="text-gray-400 text-sm">
        Smart Banking Solutions for Everyone
      </p>
    </div>
  );
};
