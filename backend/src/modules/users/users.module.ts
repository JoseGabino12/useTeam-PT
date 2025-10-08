import { Module } from '@nestjs/common';
import { UsersController } from './infrastructure/users.controller';
import { UserRepositoryImpl } from './infrastructure/user.repository.impl';
import { MongodbModule } from '../../database/mongodb.module';

@Module({
  imports: [MongodbModule],
  controllers: [UsersController],
  providers: [UserRepositoryImpl],
})
export class UsersModule {}
