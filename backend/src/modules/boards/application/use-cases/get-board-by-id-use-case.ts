import { IBoardRepository } from '../../domain/board.repository';
import { IColumnRepository } from '../../../columns/domain/column.repository';
import { ICardRepository } from '../../../cards/domain/card.repository';
import { Board } from '../../domain/entities/board.entity';
import { Column } from '../../../columns/domain/column.entity';

export class GetBoardByIdUseCase {
  constructor(
    private readonly boardRepository: IBoardRepository,
    private readonly columnRepository: IColumnRepository,
    private readonly cardRepository: ICardRepository,
  ) {}

  async execute(boardId: string): Promise<Board & { columns: Column[] }> {
    const board = await this.boardRepository.findById(boardId);
    if (!board) throw new Error('Board not found');

    const columns = await this.columnRepository.findByBoardId(boardId);

    for (const column of columns) {
      const cards = await this.cardRepository.findByColumnId(column.id);
      (column as Column & { cards: any[] }).cards = cards;
    }

    const boardWithColumns = board as Board & { columns: Column[] };
    boardWithColumns.columns = columns;

    return boardWithColumns;
  }
}
