// Dashboard Page - Placeholder after onboarding
"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-cyber-darker flex items-center justify-center p-8">
      {/* Background effects */}
      <div className="absolute inset-0 bg-linear-to-br from-cyber-accent/5 via-transparent to-cyber-purple/5" />
      <div className="absolute top-20 left-20 w-96 h-96 bg-cyber-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyber-purple/10 rounded-full blur-3xl" />

      <div className="relative z-10 text-center max-w-2xl">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-linear-to-br from-cyber-accent to-cyber-purple rounded-full mb-8 shadow-glow-cyan">
          <i className="fas fa-check text-5xl text-white" />
        </div>

        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome to SecureVault! 🎉
        </h1>

        <p className="text-xl text-gray-300 mb-8">
          Your server monitoring setup is complete. Your agent is now actively
          monitoring your infrastructure.
        </p>

        <div className="bg-cyber-card border border-cyber-border rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-6">
            What's Next?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="bg-cyber-dark rounded-lg p-4">
              <i className="fas fa-chart-line text-3xl text-cyber-accent mb-3" />
              <h3 className="font-semibold text-white mb-2">View Metrics</h3>
              <p className="text-sm text-gray-400">
                Monitor CPU, memory, disk usage in real-time
              </p>
            </div>

            <div className="bg-cyber-dark rounded-lg p-4">
              <i className="fas fa-bell text-3xl text-cyber-purple mb-3" />
              <h3 className="font-semibold text-white mb-2">Set Alerts</h3>
              <p className="text-sm text-gray-400">
                Configure notifications for critical events
              </p>
            </div>

            <div className="bg-cyber-dark rounded-lg p-4">
              <i className="fas fa-server text-3xl text-green-400 mb-3" />
              <h3 className="font-semibold text-white mb-2">Add More Servers</h3>
              <p className="text-sm text-gray-400">
                Monitor multiple servers from one dashboard
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => router.push("/login")}
            className="px-8 py-4 bg-linear-to-r from-cyber-accent to-cyan-500 hover:from-cyan-500 hover:to-cyber-accent text-cyber-darker font-semibold rounded-lg transition-all duration-200 shadow-glow-cyan"
          >
            <i className="fas fa-rocket mr-2" />
            Go to Dashboard
          </button>

          <button
            onClick={() => router.push("/login")}
            className="px-8 py-4 bg-cyber-card hover:bg-cyber-dark border border-cyber-border text-white rounded-lg transition-all duration-200"
          >
            <i className="fas fa-book mr-2" />
            Learn More
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-8">
          <i className="fas fa-shield-check text-cyber-accent mr-1" />
          Your monitoring data is encrypted end-to-end
        </p>
      </div>
    </div>
  );
}
