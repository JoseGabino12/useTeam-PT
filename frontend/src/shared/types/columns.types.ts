import type { Card } from "./cards.types";

export type Column = {
  id: string;
  name: string;
  order: number;
  boardId: string;
  cards: Card[];
  createdAt: Date;
  updatedAt: Date;
}