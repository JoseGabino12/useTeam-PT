import type { ProjectDetail } from "@/shared/types/projects.types";
import { useEffect, useState } from "react";
import { boardApi } from "../services/board.api";
import { useParams } from "react-router";
import type { PayloadCard } from "@/shared/types/cards.types";
import { cardApi } from "@/modules/card/services/card.api";
import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import { toast } from "sonner";
import { io } from "socket.io-client";

export const useBoard = () => {
  const [boardDetail, setBoardDetail] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuthStore();
  const { boardId } = useParams<{ boardId: string }>();

  const socket = io("http://localhost:3000", { withCredentials: true });
  
  const addMember = async (userId: string, role: "editor" | "viewer" = "viewer") => {
    if (!boardId) throw new Error("Board ID not found");
    setLoading(true);
    setError(null);
    try {
      await boardApi.addMember(boardId, userId, role);
      const updatedBoard = await boardApi.getBoardById(boardId);
      setBoardDetail(updatedBoard);
    } catch (error) {
      console.error("Error adding member to board:", error);
      setError("Error adding member to board");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createCard = async (data: PayloadCard) => {
    setLoading(true);
    setError(null);
    try {
      const newCard = await cardApi.createCard({ ...data, boardId: boardId!, createdBy: user?.id || '' });
      const updatedBoard = await boardApi.getBoardById(boardId!);
      socket.emit("cardCreated", { boardId: boardId!, card: newCard })
      setBoardDetail(updatedBoard);
    } catch (error) {
      console.error("Error creating card:", error);
      setError("Error creating card");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const moveCard = async (cardId: string, newColumnId: string) => {
    if (!boardDetail || !boardId) return;

    const snapshot = JSON.parse(JSON.stringify(boardDetail));

    // Local optimistic update
    const sourceCol = boardDetail.columns.find((col) =>
      col.cards?.some((card) => card.id === cardId)
    );
    const targetCol = boardDetail.columns.find((col) => col.id === newColumnId);
    if (!sourceCol || !targetCol) return;

    const movedCard = sourceCol.cards.find((card) => card.id === cardId);
    if (!movedCard) return;

    const updatedBoard = {
      ...boardDetail,
      columns: boardDetail.columns.map((col) => {
        if (col.id === sourceCol.id) {
          return { ...col, cards: col.cards.filter((c) => c.id !== cardId) };
        }
        if (col.id === targetCol.id) {
          return { ...col, cards: [...col.cards, { ...movedCard, columnId: newColumnId }] };
        }
        return col;
      }),
    };

    setBoardDetail(updatedBoard);

    // Persist changes in backend
    try {
      await cardApi.moveCard(cardId, newColumnId);
      socket.emit("cardMoved", { boardId: boardId!, cardId, newColumnId });
    } catch (error) {
      console.error("Error moving card:", error);
      setBoardDetail(snapshot); // rollback
      // Show toast error
      toast.error("Error moving card. Please try again.");
    }
  }

  const fetchBoardDetail = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const fetchedBoardDetail = await boardApi.getBoardById(id);
      setBoardDetail(fetchedBoardDetail);
    } catch (error) {
      console.error("Error fetching board detail:", error);
      setError("Error fetching board detail");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (boardId) {
      fetchBoardDetail(boardId);
    }
  }, [boardId]);

  return {
    createCard,
    moveCard,
    fetchBoardDetail,
    addMember,
    boardDetail,
    loading,
    error,
  };
}
