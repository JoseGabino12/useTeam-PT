import { Inject, Injectable } from '@nestjs/common';
import { Db, Collection } from 'mongodb';
import { IColumnRepository } from '../domain/column.repository';
import { Column } from '../domain/column.entity';

@Injectable()
export class ColumnRepositoryImpl implements IColumnRepository {
  private collection: Collection<Column>;

  constructor(@Inject('DATABASE_CONNECTION') private db: Db) {
    this.collection = this.db.collection<Column>('columns');
  }

  async create(column: Column): Promise<Column> {
    await this.collection.insertOne(column);
    return column;
  }

  async findByBoardId(boardId: string): Promise<Column[]> {
    return this.collection.find({ boardId }).sort({ order: 1 }).toArray();
  }

  async updateOrder(columnId: string, newOrder: number): Promise<void> {
    await this.collection.updateOne(
      { id: columnId },
      { $set: { order: newOrder, updatedAt: new Date() } },
    );
  }

  async delete(columnId: string): Promise<void> {
    await this.collection.deleteOne({ id: columnId });
  }

  async rename(columnId: string, newName: string): Promise<void> {
    await this.collection.updateOne(
      { id: columnId },
      { $set: { name: newName, updatedAt: new Date() } },
    );
  }
}
