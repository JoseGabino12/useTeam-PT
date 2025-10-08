import { IColumnRepository } from '../../domain/column.repository';

export class DeleteColumnUseCase {
  constructor(private readonly columnRepository: IColumnRepository) {}

  async execute(columnId: string): Promise<void> {
    if (!columnId) {
      throw new Error('Column ID is required');
    }

    await this.columnRepository.delete(columnId);
  }
}
