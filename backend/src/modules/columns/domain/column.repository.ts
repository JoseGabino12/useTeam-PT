import { Column } from './column.entity';

export interface IColumnRepository {
  create(column: Column): Promise<Column>;
  findByBoardId(boardId: string): Promise<Column[]>;
  updateOrder(columnId: string, newOrder: number): Promise<void>;
  delete(columnId: string): Promise<void>;
  rename(columnId: string, newName: string): Promise<void>;
}

export const IColumnRepository = Symbol('IColumnRepository');
