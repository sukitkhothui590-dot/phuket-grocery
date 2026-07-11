import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getPreferencesFromStatus } from "@/lib/cookie-consent-config";

export type CookieConsentStatus = "pending" | "accepted" | "essential";

export interface CookiePreferences {
  analytics: boolean;
  marketing: boolean;
}

interface CookieConsentState {
  status: CookieConsentStatus;
  acceptedAt: string | null;
  preferences: CookiePreferences;
  settingsOpen: boolean;

  acceptAll: () => void;
  acceptEssentialOnly: () => void;
  setSettingsOpen: (open: boolean) => void;
}

export const useCookieConsentStore = create<CookieConsentState>()(
  persist(
    (set) => ({
      status: "pending",
      acceptedAt: null,
      preferences: getPreferencesFromStatus("essential"),
      settingsOpen: false,

      acceptAll: () =>
        set({
          status: "accepted",
          acceptedAt: new Date().toISOString(),
          preferences: getPreferencesFromStatus("accepted"),
          settingsOpen: false,
        }),

      acceptEssentialOnly: () =>
        set({
          status: "essential",
          acceptedAt: new Date().toISOString(),
          preferences: getPreferencesFromStatus("essential"),
          settingsOpen: false,
        }),

      setSettingsOpen: (open) => set({ settingsOpen: open }),
    }),
    {
      name: "phuket-grocery-cookie-consent",
      partialize: (state) => ({
        status: state.status,
        acceptedAt: state.acceptedAt,
        preferences: state.preferences,
      }),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<CookieConsentState> | undefined;
        const status = persisted?.status ?? currentState.status;
        const preferences =
          persisted?.preferences ?? getPreferencesFromStatus(status);

        return {
          ...currentState,
          ...persisted,
          preferences,
          settingsOpen: false,
        };
      },
    }
  )
);
