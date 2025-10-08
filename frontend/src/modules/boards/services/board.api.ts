import type { ProjectDetail } from "@/shared/types/projects.types";

const API_URL = import.meta.env.VITE_API_URL || "";

export const boardApi = {
  getBoardById: async (boardId: string): Promise<ProjectDetail> => {
    const response = await fetch(`${API_URL}boards/detail/${boardId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch board');
    }
    return response.json();
  },
  addMember: async (boardId: string, userId: string, role: "editor" | "viewer"): Promise<void> => {
    const response = await fetch(`${API_URL}boards/add-member/${boardId}/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role }),
    });
    if (!response.ok) {
      throw new Error("Failed to add member to board");
    }
  }
}
