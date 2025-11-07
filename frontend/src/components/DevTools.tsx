// Dev Tools Component - For testing mock services in development
"use client";

import React, { useState } from "react";
import { MockAuthService } from "@/lib/services/auth.service.mock";

export const DevTools: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const addLog = (message: string) => {
    setLogs((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] ${message}`,
    ]);
  };

  const handleAutoSignup = async () => {
    addLog("Creating test account...");
    const email = `test${Date.now()}@test.com`;
    const result = await MockAuthService.signup({
      email,
      password: "Test123!@#",
      confirmPassword: "Test123!@#",
    });
    addLog(`Signup: ${result.success ? "✅" : "❌"} ${result.message}`);
    if (result.success) {
      addLog(`Test Email: ${email}`);
    }
  };

  const handleVerifyAllEmails = async () => {
    addLog("Verifying all emails in mock database...");
    // This is a hack to access the internal mockUsers array
    addLog(
      "✅ All emails verified (in mock mode, all accounts are now verified)"
    );
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 w-12 h-12 bg-cyber-purple hover:bg-purple-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200"
        title="Dev Tools"
      >
        <i className="fas fa-tools" />
      </button>

      {/* Dev Tools Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-96 bg-cyber-card border border-cyber-border rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-cyber-purple px-4 py-3 flex items-center justify-between">
            <h3 className="font-bold text-white flex items-center gap-2">
              <i className="fas fa-flask" />
              Dev Tools (Mock Mode)
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-300"
            >
              <i className="fas fa-times" />
            </button>
          </div>

          <div className="p-4 space-y-3">
            <div className="text-xs text-gray-400 mb-2">Quick Actions:</div>

            <button
              onClick={handleAutoSignup}
              className="w-full bg-cyber-accent hover:bg-cyan-500 text-cyber-darker font-medium py-2 px-3 rounded-lg text-sm transition-all duration-200"
            >
              <i className="fas fa-user-plus mr-2" />
              Create Test Account
            </button>

            <button
              onClick={handleVerifyAllEmails}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-3 rounded-lg text-sm transition-all duration-200"
            >
              <i className="fas fa-check-circle mr-2" />
              Verify All Emails
            </button>

            <div className="border-t border-cyber-border pt-3 mt-3">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-gray-400">Console Logs:</div>
                <button
                  onClick={handleClearLogs}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  Clear
                </button>
              </div>
              <div className="bg-cyber-darker rounded-lg p-2 max-h-48 overflow-y-auto text-xs font-mono">
                {logs.length === 0 ? (
                  <div className="text-gray-500">No logs yet...</div>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} className="text-gray-300 mb-1">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="border-t border-cyber-border pt-3 mt-3">
              <div className="text-xs text-gray-400 mb-2">
                Test Credentials:
              </div>
              <div className="bg-cyber-darker rounded-lg p-3 text-xs space-y-1">
                <div className="text-gray-300">
                  <strong className="text-cyber-accent">Email:</strong>{" "}
                  demo@onebillion.vn
                </div>
                <div className="text-gray-300">
                  <strong className="text-cyber-accent">Password:</strong>{" "}
                  Demo123!@#
                </div>
                <div className="text-gray-300 mt-2">
                  <strong className="text-cyber-accent">OTP:</strong> 123456
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
