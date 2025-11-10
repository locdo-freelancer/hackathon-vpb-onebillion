"use client";

import React from "react";
import { useLanguageStore, Locale } from "@/stores/languageStore";

export const LanguageSwitcher: React.FC = () => {
  const { locale, setLocale } = useLanguageStore();

  const handleLanguageChange = (newLocale: Locale) => {
    setLocale(newLocale);
    // Language updates via store - no URL change needed
    // Components using useTranslations will re-render automatically
  };

  return (
    <div className="flex items-center gap-2 bg-cyber-card border border-cyber-border rounded-lg p-1">
      <button
        onClick={() => handleLanguageChange("en")}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
          locale === "en"
            ? "bg-cyber-accent text-white shadow-lg shadow-cyber-accent/20"
            : "text-gray-400 hover:text-white hover:bg-slate-800"
        }`}
        aria-label="Switch to English"
      >
        <span className="flex items-center gap-1.5">
          🇬🇧 EN
        </span>
      </button>
      <button
        onClick={() => handleLanguageChange("vn")}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
          locale === "vn"
            ? "bg-cyber-accent text-white shadow-lg shadow-cyber-accent/20"
            : "text-gray-400 hover:text-white hover:bg-slate-800"
        }`}
        aria-label="Switch to Vietnamese"
      >
        <span className="flex items-center gap-1.5">
          🇻🇳 VN
        </span>
      </button>
    </div>
  );
};
