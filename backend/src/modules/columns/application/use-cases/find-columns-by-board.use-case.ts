import { IColumnRepository } from '../../domain/column.repository';
import { Column } from '../../domain/column.entity';

export class FindColumnsByBoardUseCase {
  constructor(private readonly columnRepository: IColumnRepository) {}

  async execute(boardId: string): Promise<Column[]> {
    return this.columnRepository.findByBoardId(boardId);
  }
}
