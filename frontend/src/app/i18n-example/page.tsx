/**
 * Example Component: How to use i18n
 * This demonstrates all the ways to use translations in your components
 */

"use client";

import React from "react";
import { useTranslations } from "@/hooks/useTranslations";
import { LanguageSwitcher } from "@/components/shared";

export default function I18nExamplePage() {
  const { t, locale } = useTranslations();

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header with Language Switcher */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">
            {t("dashboard.title")}
          </h1>
          <LanguageSwitcher />
        </div>

        {/* Current Language Info */}
        <div className="bg-cyber-card border border-cyber-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Current Language / Ngôn ngữ hiện tại
          </h2>
          <p className="text-gray-400">
            Active: <span className="text-cyber-accent font-bold">{locale.toUpperCase()}</span>
          </p>
        </div>

        {/* Navigation Translations */}
        <div className="bg-cyber-card border border-cyber-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Navigation / Điều hướng
          </h2>
          <ul className="space-y-2 text-gray-400">
            <li>• {t("nav.dashboard")}</li>
            <li>• {t("nav.threats")}</li>
            <li>• {t("nav.incidents")}</li>
            <li>• {t("nav.agents")}</li>
            <li>• {t("nav.sites")}</li>
            <li>• {t("nav.actionConsole")}</li>
          </ul>
        </div>

        {/* Dashboard Translations */}
        <div className="bg-cyber-card border border-cyber-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            {t("dashboard.title")}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">{t("dashboard.totalIncidents")}</p>
              <p className="text-2xl font-bold text-white mt-2">1,234</p>
            </div>
            <div className="bg-slate-900 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">{t("dashboard.activeSites")}</p>
              <p className="text-2xl font-bold text-white mt-2">56</p>
            </div>
            <div className="bg-slate-900 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">{t("dashboard.agentsOnline")}</p>
              <p className="text-2xl font-bold text-white mt-2">89</p>
            </div>
            <div className="bg-slate-900 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">{t("dashboard.criticalThreats")}</p>
              <p className="text-2xl font-bold text-red-500 mt-2">12</p>
            </div>
          </div>
        </div>

        {/* Auth Translations */}
        <div className="bg-cyber-card border border-cyber-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            {t("auth.login")} Form
          </h2>
          <div className="space-y-3 text-gray-400">
            <p>• {t("auth.welcomeBack")}</p>
            <p>• {t("auth.email")}</p>
            <p>• {t("auth.password")}</p>
            <p>• {t("auth.rememberMe")}</p>
            <p>• {t("auth.forgotPassword")}</p>
            <button className="mt-4 px-4 py-2 bg-cyber-accent text-white rounded-lg">
              {t("auth.loginButton")}
            </button>
          </div>
        </div>

        {/* Common Translations */}
        <div className="bg-cyber-card border border-cyber-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            {t("common.actions")}
          </h2>
          <div className="flex gap-3 flex-wrap">
            <button className="px-4 py-2 bg-slate-800 text-gray-300 rounded-lg hover:bg-slate-700">
              {t("common.search")}
            </button>
            <button className="px-4 py-2 bg-slate-800 text-gray-300 rounded-lg hover:bg-slate-700">
              {t("common.filter")}
            </button>
            <button className="px-4 py-2 bg-slate-800 text-gray-300 rounded-lg hover:bg-slate-700">
              {t("common.export")}
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              {t("common.save")}
            </button>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              {t("common.delete")}
            </button>
          </div>
        </div>

        {/* Code Example */}
        <div className="bg-cyber-card border border-cyber-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Code Example / Ví dụ code
          </h2>
          <pre className="bg-slate-900 p-4 rounded-lg overflow-x-auto">
            <code className="text-green-400 text-sm">
{`import { useTranslations } from "@/hooks/useTranslations";

export default function MyComponent() {
  const { t } = useTranslations();
  
  return (
    <div>
      <h1>{t("dashboard.title")}</h1>
      <p>{t("dashboard.welcome")}</p>
    </div>
  );
}`}
            </code>
          </pre>
        </div>

        {/* Status Messages */}
        <div className="bg-cyber-card border border-cyber-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Status Messages
          </h2>
          <div className="space-y-3">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-blue-400">
              <i className="fas fa-info-circle mr-2"></i>
              {t("common.loading")}
            </div>
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-green-400">
              <i className="fas fa-check-circle mr-2"></i>
              {t("common.success")}
            </div>
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {t("common.error")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
