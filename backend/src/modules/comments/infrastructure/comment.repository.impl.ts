import { Inject, Injectable } from '@nestjs/common';
import { Db, Collection } from 'mongodb';
import { ICommentRepository } from '../domain/comment.repository';
import { Comment } from '../domain/comment.entity';

@Injectable()
export class CommentRepositoryImpl implements ICommentRepository {
  private collection: Collection<Comment>;

  constructor(@Inject('DATABASE_CONNECTION') private db: Db) {
    this.collection = this.db.collection<Comment>('comments');
  }

  async create(comment: Comment): Promise<Comment> {
    await this.collection.insertOne(comment);
    return comment;
  }

  async findByCardId(cardId: string): Promise<Comment[]> {
    return this.collection.find({ cardId }).sort({ createdAt: 1 }).toArray();
  }

  async updateContent(commentId: string, newContent: string): Promise<void> {
    await this.collection.updateOne(
      { id: commentId },
      { $set: { content: newContent, updatedAt: new Date() } },
    );
  }
}
