import { Board } from './entities/board.entity';

export interface IBoardRepository {
  create(board: Board): Promise<Board>;
  findById(id: string): Promise<Board | null>;
  findByUserId(userId: string): Promise<Board[]>;
  update(board: Board): Promise<void>;
}

export const IBoardRepository = Symbol('IBoardRepository');
