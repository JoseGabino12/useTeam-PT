export const exportApi = {
  exportBacklog: async (boardId: string, email: string): Promise<{ message: string }> => {
    const API_URL = import.meta.env.VITE_API_URL || "";
    const response = await fetch(`${API_URL}export/backlog`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ boardId, email }),
    });
    if (!response.ok) {
      throw new Error("Failed to export backlog");
    }
    return await response.json();
  }
}