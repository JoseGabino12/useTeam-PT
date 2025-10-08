import { IBoardRepository } from '../../domain/board.repository';
import { Board } from '../../domain/entities/board.entity';
import { BoardMember } from '../../domain/entities/board-member.entity';
import { CreateBoardDto } from '../dto/create-board.dto';
import { User } from '../../../../modules/users/domain/user.entity';
import { IColumnRepository } from '../../../columns/domain/column.repository';
import { Column } from '../../../columns/domain/column.entity';
import crypto from 'crypto';

export class CreateBoardUseCase {
  constructor(
    private readonly boardRepository: IBoardRepository,
    private readonly columnRepository: IColumnRepository,
  ) {}

  async execute(
    data: CreateBoardDto,
    user: Pick<User, 'id' | 'name' | 'email' | 'avatar'>,
  ): Promise<Board> {
    const boardId = crypto.randomUUID();

    const owner = new BoardMember(user.id, boardId, user, 'owner', new Date());

    const board = new Board(
      boardId,
      data.name,
      data.description || '',
      [owner],
      user,
      new Date(),
      new Date(),
    );

    const createdBoard = await this.boardRepository.create(board);

    // Create default columns
    const defaultColumns = ['To Do', 'In Progress', 'Done'];
    const createdColumns = await Promise.all(
      defaultColumns.map((name, index) => {
        const column = new Column(
          crypto.randomUUID(),
          name,
          boardId,
          index,
          new Date(),
          new Date(),
        );
        return this.columnRepository.create(column);
      }),
    );

    const result = createdBoard as Board & { columns: Column[] };
    result.columns = createdColumns;

    return result;
  }
}
