import type { RegisterUserDto, User } from "@/shared/types/auth.types";

const API_URL = import.meta.env.VITE_API_URL || "";

export const authApi = {
  register: async (data: RegisterUserDto): Promise<{ user: User; accessToken: string }> => {
    const res = await fetch(`${API_URL}auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to register");
    return res.json();
  },

  login: async (email: string, password: string): Promise<{ user: User; accessToken: string }> => {
    const res = await fetch(`${API_URL}auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Invalid credentials");
    return res.json();
  },
};