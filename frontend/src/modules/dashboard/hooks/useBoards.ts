import { useEffect, useState } from "react";
import { boardsApi } from "../services/dashboard.api"
import type { Project } from "@/shared/types/projects.types";
import { useAuthStore } from "@/modules/auth/store/useAuthStore";

export const useBoards = () => {
  const [boards, setBoards] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuthStore();

  const createBoard = async (boardData: { name: string; description?: string }) => {
    setLoading(true);
    setError(null);
    try {
      if (!user) throw new Error("User not authenticated");
      const newBoard = await boardsApi.createBoard(user.id, boardData);
      setBoards((prevBoards) => [...prevBoards, newBoard]);
    } catch (error) {
      console.error("Error creating board:", error);
      setError("Error creating board");
      throw error;
    } finally {
      setLoading(false);
    }
  }

  const refetchBoards = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!user) return;
      const fetchedBoards = await boardsApi.getBoards(user.id);
      setBoards(fetchedBoards);
    } catch (error) {
      console.error("Error fetching boards:", error);
      setError("Error fetching boards");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchBoards = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const fetchedBoards = await boardsApi.getBoards(user.id);
        setBoards(fetchedBoards);
      } catch (error) {
        console.error("Error fetching boards:", error);
        setError("Error fetching boards");
      } finally {
        setLoading(false);
      }
    };

    fetchBoards();
  }, [user]);

  return {
    createBoard,
    refetchBoards,
    loading,
    error,
    boards
  }
}
