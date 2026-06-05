/**
 * Lightweight client-side auth — gates personal features (profile, history)
 * behind a sign-in screen. No backend; credentials simulated and persisted.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  createdAt: number;
}

interface AuthState {
  user: AuthUser | null;
  signIn: (email: string, name?: string) => AuthUser;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      signIn: (email, name) => {
        const user: AuthUser = {
          id: "u_" + Math.random().toString(36).slice(2, 10),
          email: email.trim().toLowerCase(),
          name: (name?.trim() || email.split("@")[0] || "Friend"),
          createdAt: Date.now(),
        };
        set({ user });
        return user;
      },
      signOut: () => set({ user: null }),
    }),
    {
      name: "allerguard-auth",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : (undefined as never),
      ),
    },
  ),
);
