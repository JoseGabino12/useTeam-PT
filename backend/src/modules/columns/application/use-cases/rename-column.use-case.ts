import { IColumnRepository } from '../../domain/column.repository';

export class RenameColumnUseCase {
  constructor(private readonly columnRepository: IColumnRepository) {}

  async execute(columnId: string, newName: string): Promise<void> {
    if (!newName.trim()) {
      throw new Error('New name cannot be empty');
    }

    await this.columnRepository.rename(columnId, newName);
  }
}
