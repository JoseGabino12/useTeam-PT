import { IColumnRepository } from '../../domain/column.repository';
import { Column } from '../../domain/column.entity';
import { CreateColumnDto } from '../dto/create-column.dto';

export class CreateColumnUseCase {
  constructor(private readonly columnRepository: IColumnRepository) {}

  async execute(data: CreateColumnDto): Promise<Column> {
    const column = new Column(
      crypto.randomUUID(),
      data.name,
      data.boardId,
      data.order,
      new Date(),
      new Date(),
    );

    return this.columnRepository.create(column);
  }
}
