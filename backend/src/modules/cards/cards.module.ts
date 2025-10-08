import { Module } from '@nestjs/common';
import { CardsController } from './infrastructure/cards.controller';
import { CardRepositoryImpl } from './infrastructure/card.repository.impl';
import { MongodbModule } from '../../database/mongodb.module';
import { UserRepositoryImpl } from '../users/infrastructure/user.repository.impl';

@Module({
  imports: [MongodbModule],
  controllers: [CardsController],
  providers: [CardRepositoryImpl, UserRepositoryImpl],
})
export class CardsModule {}
