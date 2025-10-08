import { Module } from '@nestjs/common';
import { BoardsController } from './infrastructure/boards.controller';
import { BoardRepositoryImpl } from './infrastructure/board.repository.impl';
import { MongodbModule } from '../../database/mongodb.module';
import { ColumnRepositoryImpl } from '../columns/infrastructure/column.repository.impl';
import { CreateBoardUseCase } from './application/use-cases/create-board.use-case';
import { CardRepositoryImpl } from '../cards/infrastructure/card.repository.impl';
import { UsersModule } from '../users/users.module';
import { UserRepositoryImpl } from '../users/infrastructure/user.repository.impl';
import { ExportController } from './infrastructure/export.controller';
import { ExportBacklogUseCase } from './application/use-cases/export-backlog.use-case';

@Module({
  imports: [MongodbModule, UsersModule],
  controllers: [BoardsController, ExportController],
  providers: [
    BoardRepositoryImpl,
    ColumnRepositoryImpl,
    CardRepositoryImpl,
    CreateBoardUseCase,
    UserRepositoryImpl,
    ExportBacklogUseCase,
  ],
})
export class BoardsModule {}
