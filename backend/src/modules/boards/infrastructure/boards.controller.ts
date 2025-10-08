import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { CreateBoardDto } from '../application/dto/create-board.dto';
import { CreateBoardUseCase } from '../application/use-cases/create-board.use-case';
import { GetBoardByIdUseCase } from '../application/use-cases/get-board-by-id-use-case';
import { BoardRepositoryImpl } from './board.repository.impl';
import { UserRepositoryImpl } from 'src/modules/users/infrastructure/user.repository.impl';
import { User } from 'src/modules/users/domain/user.entity';
import { ColumnRepositoryImpl } from 'src/modules/columns/infrastructure/column.repository.impl';
import { CardRepositoryImpl } from 'src/modules/cards/infrastructure/card.repository.impl';
import { AddBoardMemberUseCase } from '../application/use-cases/add-board-member.use-case';

@Controller('boards')
export class BoardsController {
  private createBoardUseCase: CreateBoardUseCase;
  private getBoardByIdUseCase: GetBoardByIdUseCase;
  private addBoardMemberUseCase: AddBoardMemberUseCase;

  constructor(
    private readonly boardRepository: BoardRepositoryImpl,
    private readonly userRepository: UserRepositoryImpl,
    private readonly columnRepository: ColumnRepositoryImpl,
    private readonly cardRepository: CardRepositoryImpl,
  ) {
    this.createBoardUseCase = new CreateBoardUseCase(
      boardRepository,
      columnRepository,
    );
    this.getBoardByIdUseCase = new GetBoardByIdUseCase(
      boardRepository,
      this.columnRepository,
      this.cardRepository,
    );
    this.addBoardMemberUseCase = new AddBoardMemberUseCase(
      boardRepository,
      userRepository,
    );
  }

  @Post(':userId')
  async createBoard(
    @Param('userId') userId: string,
    @Body() dto: CreateBoardDto,
  ) {
    // Search for the user by ID
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    // Pass the user snapshot to the use case
    return this.createBoardUseCase.execute(dto, {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    } as Pick<User, 'id' | 'name' | 'email' | 'avatar'>);
  }

  @Post('add-member/:boardId/:userId')
  async addMember(
    @Param('boardId') boardId: string,
    @Param('userId') userId: string,
    @Body('role') role: 'editor' | 'viewer',
  ) {
    return this.addBoardMemberUseCase.execute(boardId, userId, role);
  }

  @Get(':userId')
  async getBoards(@Param('userId') userId: string) {
    return this.boardRepository.findByUserId(userId);
  }

  @Get('detail/:boardId')
  async getBoardById(@Param('boardId') boardId: string) {
    return this.getBoardByIdUseCase.execute(boardId);
  }
}
