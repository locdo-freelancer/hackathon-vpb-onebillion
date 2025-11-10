"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Locale = "en" | "vn";

interface LanguageStore {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      locale: "en",
      setLocale: (locale: Locale) => {
        set({ locale });
        // Store in localStorage for persistence
        if (typeof window !== "undefined") {
          document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=31536000`;
        }
      },
    }),
    {
      name: "language-storage",
    }
  )
);
