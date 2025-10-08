import type { Card } from "@/shared/types/cards.types";
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

interface UseBoardSocketProps {
  boardId: string;
  onCardCreated?: (card: Card) => void;
  onCardMoved?: (payload: { cardId: string; newColumnId: string }) => void;
}

export function useBoardSocket ({
  boardId,
  onCardCreated,
  onCardMoved,
}: UseBoardSocketProps) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io("http://localhost:3000", { withCredentials: true });
    socketRef.current = socket;

    // Join board room
    socket.emit("joinBoard", boardId);

    // --- Listeners ---
    socket.on("cardCreated", (card) => {
      console.log("🆕 Card created (realtime)", card);
      onCardCreated?.(card);
    });

    socket.on("cardMoved", (payload) => {
      console.log("🔀 Card moved (realtime)", payload);
      onCardMoved?.(payload);
    });

    return () => {
      socket.disconnect();
    };
  }, [boardId, onCardCreated, onCardMoved]);

  // --- Emitters (optional if you also want to send) ---
  const emitCardCreated = (card: Card) => {
    socketRef.current?.emit("cardCreated", { boardId, card });
  };

  const emitCardMoved = (cardId: string, newColumnId: string) => {
    socketRef.current?.emit("cardMoved", { boardId, cardId, newColumnId });
  };

  return { emitCardCreated, emitCardMoved };
}