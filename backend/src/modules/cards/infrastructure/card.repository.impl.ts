import { Inject, Injectable } from '@nestjs/common';
import { Db, Collection } from 'mongodb';
import { ICardRepository } from '../domain/card.repository';
import { Card } from '../domain/card.entity';

@Injectable()
export class CardRepositoryImpl implements ICardRepository {
  private collection: Collection<Card>;

  constructor(@Inject('DATABASE_CONNECTION') private db: Db) {
    this.collection = this.db.collection<Card>('cards');
  }

  async create(card: Card): Promise<Card> {
    await this.collection.insertOne(card);
    return card;
  }

  async findByColumnId(columnId: string): Promise<Card[]> {
    return this.collection.find({ columnId }).toArray();
  }

  async moveCard(cardId: string, newColumnId: string): Promise<void> {
    await this.collection.updateOne(
      { id: cardId },
      { $set: { columnId: newColumnId, updatedAt: new Date() } },
    );
  }
}
