import { ICardRepository } from '../../domain/card.repository';

export class MoveCardUseCase {
  constructor(private readonly cardRepository: ICardRepository) {}

  async execute(cardId: string, newColumnId: string): Promise<void> {
    await this.cardRepository.moveCard(cardId, newColumnId);
  }
}
