import { ICardRepository } from '../../domain/card.repository';
import { Card } from '../../domain/card.entity';

export class FindCardsByColumnUseCase {
  constructor(private readonly cardRepository: ICardRepository) {}

  async execute(columnId: string): Promise<Card[]> {
    return this.cardRepository.findByColumnId(columnId);
  }
}
