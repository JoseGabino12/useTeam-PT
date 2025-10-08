import type { Project } from "@/shared/types/projects.types";

const API_URL = import.meta.env.VITE_API_URL || "";

export const boardsApi = {
  getBoards: async (userId: string): Promise<Project[]> => {
    const response = await fetch(`${API_URL}boards/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch boards');
    }
    return response.json();
  },
  
  createBoard: async (userId: string, data: { name: string; description?: string }): Promise<Project> => {
    const response = await fetch(`${API_URL}boards/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create board');
    }
    return response.json();
  }
}