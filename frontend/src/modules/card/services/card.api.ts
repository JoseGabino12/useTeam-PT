import type { PayloadCard } from "@/shared/types/cards.types";

const API_URL = import.meta.env.VITE_API_URL || "";

export const cardApi = {
  createCard: async (data: PayloadCard) => {
    const response = await fetch(`${API_URL}cards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data }),
    });
    if (!response.ok) {
      throw new Error("Failed to create card");
    }
    return response.json();
  },

  moveCard: async (cardId: string, newColumnId: string) => {
    const response = await fetch(`${API_URL}cards/${cardId}/move/${newColumnId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to move card");
    }
    return response.json();
  }
};