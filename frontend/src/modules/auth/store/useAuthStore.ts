import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { authApi } from "../services/auth.api";
import type { RegisterUserDto, User } from "@/shared/types/auth.types";

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  register: (data: RegisterUserDto) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        token: null,
        loading: false,
        error: null,

        register: async (data) => {
          try {
            set({ loading: true, error: null });
            await authApi.register(data);
            set({ loading: false });
            return true;
          } catch (err: unknown) {
            set({ error: (err as Error).message ?? "Error registering user", loading: false });
            return false;
          }
        },

        login: async (email, password) => {
          try {
            set({ loading: true, error: null });
            const res = await authApi.login(email, password);
            set({ user: res.user, token: res.accessToken, loading: false });
            return true;
          } catch (err: unknown) {
            set({ error: (err as Error).message ?? "Invalid credentials", loading: false });
            return false;
          }
        },

        logout: () => {
          set({ user: null, token: null });
        },
      }),
      { name: "auth-storage" }
    )
  )
);