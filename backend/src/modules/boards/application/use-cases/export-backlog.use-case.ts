import { Injectable } from '@nestjs/common';
import { BoardRepositoryImpl } from '../../infrastructure/board.repository.impl';
import axios from 'axios';

@Injectable()
export class ExportBacklogUseCase {
  constructor(private readonly boardRepository: BoardRepositoryImpl) {}

  async execute(boardId: string, email: string): Promise<void> {
    const board = await this.boardRepository.findById(boardId);
    if (!board) throw new Error('Board not found');

    // Aquí llamas a n8n con el webhook
    await axios.post(process.env.N8N_WEBHOOK_URL!, {
      boardId,
      email,
    });
  }
}
