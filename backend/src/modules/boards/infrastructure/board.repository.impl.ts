import { Inject, Injectable } from '@nestjs/common';
import { Db, Collection } from 'mongodb';
import { IBoardRepository } from '../domain/board.repository';
import { Board } from '../domain/entities/board.entity';

@Injectable()
export class BoardRepositoryImpl implements IBoardRepository {
  private collection: Collection<ReturnType<Board['toPlain']>>;

  constructor(@Inject('DATABASE_CONNECTION') private db: Db) {
    this.collection =
      this.db.collection<ReturnType<Board['toPlain']>>('boards');
  }

  async create(board: Board): Promise<Board> {
    await this.collection.insertOne(board.toPlain());
    return board;
  }

  async findById(id: string): Promise<Board | null> {
    const data = await this.collection.findOne({ id });
    if (!data) return null;

    // Rebuild the Board entity from the plain data
    return new Board(
      data.id,
      data.name,
      data.description,
      data.members,
      {
        id: data.createdBy.id,
        name: data.createdBy.name,
        email: data.createdBy.email,
        avatar: data.createdBy.avatar,
      },
      data.createdAt,
      data.updatedAt,
    );
  }

  async findByUserId(userId: string): Promise<Board[]> {
    const docs = await this.collection
      .find({ 'members.userId': userId })
      .toArray();
    return docs.map(
      (data) =>
        new Board(
          data.id,
          data.name,
          data.description,
          data.members,
          {
            id: data.createdBy.id,
            name: data.createdBy.name,
            email: data.createdBy.email,
            avatar: data.createdBy.avatar,
          },
          data.createdAt,
          data.updatedAt,
        ),
    );
  }

  async update(board: Board): Promise<void> {
    await this.collection.updateOne(
      { id: board.id },
      { $set: board.toPlain() },
    );
  }
}
