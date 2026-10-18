"use client";

import { createContext, type ReactNode, useContext, useSyncExternalStore } from "react";

type LocaleContextValue = {
  locale: string | null;
  formatDate: (date: Date) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

const subscribeToLanguage = (callback: () => void) => {
  window.addEventListener("languagechange", callback);
  return () => window.removeEventListener("languagechange", callback);
};

const getBrowserLanguage = () => navigator.language;
const getServerLanguage = () => null;

function formatDate(date: Date, locale: string | null) {
  const value = new Date(date);

  return locale
    ? value.toLocaleDateString(locale, { timeZone: "UTC" })
    : value.toISOString().slice(0, 10);
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(subscribeToLanguage, getBrowserLanguage, getServerLanguage);
  const value = {
    locale,
    formatDate: (date: Date) => formatDate(date, locale),
  };

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }

  return context;
}
