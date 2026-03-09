import i18n from "@/config/i18n";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";

interface LanguageState {
  locale: string;
  setLocale: (locale: string) => void;
}

const secureStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return await SecureStore.getItemAsync(name);
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await SecureStore.setItemAsync(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await SecureStore.deleteItemAsync(name);
  },
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      locale: i18n.locale,
      setLocale: (locale) => {
        i18n.locale = locale;
        set({ locale });
      },
    }),
    {
      name: "language-storage",
      storage: createJSONStorage(() => secureStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          i18n.locale = state.locale;
        }
      },
    }
  )
);
