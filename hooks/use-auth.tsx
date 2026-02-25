import { apiFetch } from "@/config/api";
import * as SecureStore from "expo-secure-store";
import React from "react";
import { create } from "zustand";
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from "zustand/middleware";

type AuthUser = {
  id?: string;
  email?: string;
  full_name?: string;
  profile_image_url?: string;
  date_of_birth?: string;
  gender?: string;
  user_type?: string;
  last_login_at?: string;
  [key: string]: unknown;
};

type LoginResponse = {
  token?: string;
  token_type?: string;
  user?: AuthUser;
  [key: string]: unknown;
};

export type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const secureStorage: StateStorage = {
  getItem: (name) => SecureStore.getItemAsync(name),
  setItem: (name, value) => SecureStore.setItemAsync(name, value),
  removeItem: (name) => SecureStore.deleteItemAsync(name),
};

export const useAuthStore = create<AuthContextValue>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          const { data } = await apiFetch<{
            data: LoginResponse;
            message: string;
          }>("/auth/users/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
          });

          const nextToken = data.token;

          if (!nextToken) {
            throw new Error("Unable to sign in. Missing token in response.");
          }

          set({ token: nextToken, isAuthenticated: true });

          await get().refreshUser();
        } catch (err) {
          const message =
            err instanceof Error
              ? err.message
              : "Unable to sign in. Please try again.";
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: message,
          });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },
      logout: async () => {
        const { token } = get();

        if (!token) {
          set({ user: null, error: null, isAuthenticated: false });
          return;
        }

        set({ isLoading: true, error: null });

        try {
          await apiFetch<unknown>("/auth/users/logout", {
            method: "POST",
            authToken: token,
          });
        } catch {
        } finally {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },
      refreshUser: async () => {
        const token = get().token;

        if (!token) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const { data: me } = await apiFetch<{
            data: AuthUser;
            message: string;
          }>("/auth/users/me", {
            method: "GET",
            authToken: token,
          });

          set({
            user: me,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => secureStorage),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          state.refreshUser().catch(() => {});
        }
      },
    },
  ),
);

export function useAuth() {
  return useAuthStore();
}

export function useAuthHydration() {
  const [hasHydrated, setHasHydrated] = React.useState(
    useAuthStore.persist.hasHydrated(),
  );

  React.useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });
    return unsub;
  }, []);

  return hasHydrated;
}
