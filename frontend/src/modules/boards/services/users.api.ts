import type { User } from "@/shared/types/auth.types";

const API_URL = import.meta.env.VITE_API_URL || "";

export const usersApi = {
  getAll: async (): Promise<User[]> => {
    const response = await fetch(`${API_URL}users/all`);
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    return response.json();
  }
};
