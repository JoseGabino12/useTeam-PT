import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ExportBacklogUseCase } from '../application/use-cases/export-backlog.use-case';

@Controller('export')
export class ExportController {
  constructor(private readonly exportBacklogUseCase: ExportBacklogUseCase) {}

  @Post('backlog')
  @HttpCode(HttpStatus.ACCEPTED)
  async exportBacklog(@Body() body: { boardId: string; email: string }) {
    await this.exportBacklogUseCase.execute(body.boardId, body.email);
    return { message: 'Exportación solicitada correctamente' };
  }
}
