import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { CreateColumnDto } from '../application/dto/create-column.dto';
import { CreateColumnUseCase } from '../application/use-cases/create-column.use-case';
import { FindColumnsByBoardUseCase } from '../application/use-cases/find-columns-by-board.use-case';
import { ColumnRepositoryImpl } from './column.repository.impl';
import { RenameColumnUseCase } from '../application/use-cases/rename-column.use-case';
import { DeleteColumnUseCase } from '../application/use-cases/delete-column.use-case';

@Controller('columns')
export class ColumnsController {
  private createColumnUseCase: CreateColumnUseCase;
  private findColumnsByBoardUseCase: FindColumnsByBoardUseCase;
  private renameColumnUseCase: RenameColumnUseCase;
  private deleteColumnUseCase: DeleteColumnUseCase;

  constructor(private readonly columnRepository: ColumnRepositoryImpl) {
    this.createColumnUseCase = new CreateColumnUseCase(this.columnRepository);
    this.findColumnsByBoardUseCase = new FindColumnsByBoardUseCase(
      this.columnRepository,
    );
  }

  @Post()
  async create(@Body() dto: CreateColumnDto) {
    return this.createColumnUseCase.execute(dto);
  }

  @Get(':boardId')
  async getColumnsByBoard(@Param('boardId') boardId: string) {
    return this.findColumnsByBoardUseCase.execute(boardId);
  }

  @Patch(':columnId/rename')
  async renameColumn(
    @Param('columnId') columnId: string,
    @Body('name') newName: string,
  ) {
    return this.renameColumnUseCase.execute(columnId, newName);
  }

  @Delete(':columnId')
  async deleteColumn(@Param('columnId') columnId: string) {
    return this.deleteColumnUseCase.execute(columnId);
  }
}
