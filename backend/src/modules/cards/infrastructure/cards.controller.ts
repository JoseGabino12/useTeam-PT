import { Controller, Post, Get, Patch, Param, Body } from '@nestjs/common';
import { CreateCardDto } from '../application/dto/create-card.dto';
import { CreateCardUseCase } from '../application/use-cases/create-card.use-case';
import { FindCardsByColumnUseCase } from '../application/use-cases/find-cards-by-column.use-case';
import { MoveCardUseCase } from '../application/use-cases/move-card.use-case';
import { CardRepositoryImpl } from './card.repository.impl';
import { UserRepositoryImpl } from 'src/modules/users/infrastructure/user.repository.impl';

@Controller('cards')
export class CardsController {
  private createCardUseCase: CreateCardUseCase;
  private findCardsByColumnUseCase: FindCardsByColumnUseCase;
  private moveCardUseCase: MoveCardUseCase;

  constructor(
    private readonly cardRepository: CardRepositoryImpl,
    private readonly userRepository: UserRepositoryImpl,
  ) {
    this.createCardUseCase = new CreateCardUseCase(
      this.cardRepository,
      this.userRepository,
    );
    this.findCardsByColumnUseCase = new FindCardsByColumnUseCase(
      this.cardRepository,
    );
    this.moveCardUseCase = new MoveCardUseCase(this.cardRepository);
  }

  @Post()
  async create(@Body() dto: CreateCardDto) {
    return this.createCardUseCase.execute(dto);
  }

  @Get(':columnId')
  async getCardsByColumn(@Param('columnId') columnId: string) {
    return this.findCardsByColumnUseCase.execute(columnId);
  }

  @Patch(':cardId/move/:newColumnId')
  async moveCard(
    @Param('cardId') cardId: string,
    @Param('newColumnId') newColumnId: string,
  ) {
    await this.moveCardUseCase.execute(cardId, newColumnId);
    return { message: 'Card moved successfully' };
  }
}
