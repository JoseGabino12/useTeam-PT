import type { User } from "./auth.types";
import type { Column } from "./columns.types";

export type Project = {
  id: string;
  name: string;
  description: string;
  members: ProjectMember[];
  createdBy: Partial<User>;
  createdAt: Date;
  updatedAt: Date;
}

export type ProjectDetail = Project & {
  columns: Column[];
}

export type ProjectMember = {
  userId: string;
  role: 'owner' | 'editor' | 'viewer';
  joinedAt: Date;
  boardId: string;
}