import { Card } from './card.entity';

export interface ICardRepository {
  create(card: Card): Promise<Card>;
  findByColumnId(columnId: string): Promise<Card[]>;
  moveCard(cardId: string, newColumnId: string): Promise<void>;
}

export const ICardRepository = Symbol('ICardRepository');
