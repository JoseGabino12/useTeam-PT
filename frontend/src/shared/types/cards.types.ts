import type { User } from "./auth.types";

export type Card = {
  id: string;
  title: string;
  description: string;
  columnId: string;
  boardId: string;
  assignedTo: string | null;
  createdBy: Partial<User>;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  createdAt: Date;
  dueDate: Date | null;
  updatedAt: Date;
}

export type PayloadCard = {
  columnId: string;
  title: string;
  description: string;
  boardId: string;
  createdBy: string;
  priority?: Priority;
  tags?: Tags[];
  dueDate?: string | null;
}

export type Tags = 'bug' | 'feature' | 'design' | 'urgent' | 'research';
export type Priority = 'low' | 'medium' | 'high';