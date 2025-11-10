"use client";

import { useLanguageStore } from "@/stores/languageStore";
import enMessages from "@/app/messages/en.json";
import vnMessages from "@/app/messages/vn.json";

type Messages = typeof enMessages;

export function useTranslations(namespace?: string) {
  const { locale } = useLanguageStore();
  const messages: Messages = locale === "vn" ? vnMessages : enMessages;

  const t = (key: string): string => {
    const fullKey = namespace ? `${namespace}.${key}` : key;
    const keys = fullKey.split(".");
    let value: any = messages;

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k as keyof typeof value];
      } else {
        return key; // fallback if translation not found
      }
    }

    return typeof value === "string" ? value : key;
  };

  return { t, locale };
}
