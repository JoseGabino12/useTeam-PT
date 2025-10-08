import { ICardRepository } from '../../domain/card.repository';
import { Card } from '../../domain/card.entity';
import { CreateCardDto } from '../dto/create-card.dto';
import { IUserRepository } from '../../../../modules/users/domain/user.repository';

export class CreateCardUseCase {
  constructor(
    private readonly cardRepository: ICardRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(data: CreateCardDto): Promise<Card> {
    const user = await this.userRepository.findById(data.createdBy);

    if (!user) {
      throw new Error('User not found');
    }

    const card = new Card(
      crypto.randomUUID(),
      data.title,
      data.description || '',
      data.columnId,
      data.boardId,
      data.assignedTo || null,
      {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
      data.priority,
      data.tags || [],
      new Date(),
      data.dueDate ? new Date(data.dueDate) : null,
      new Date(),
    );

    return this.cardRepository.create(card);
  }
}
