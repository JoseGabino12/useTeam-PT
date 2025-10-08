import { Module } from '@nestjs/common';
import { ColumnsController } from './infrastructure/columns.controller';
import { ColumnRepositoryImpl } from './infrastructure/column.repository.impl';
import { MongodbModule } from '../../database/mongodb.module';

@Module({
  imports: [MongodbModule],
  controllers: [ColumnsController],
  providers: [ColumnRepositoryImpl],
})
export class ColumnsModule {}
