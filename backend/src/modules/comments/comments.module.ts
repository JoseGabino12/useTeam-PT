import { Module } from '@nestjs/common';
import { CommentsController } from './infrastructure/comments.controller';
import { CommentRepositoryImpl } from './infrastructure/comment.repository.impl';
import { MongodbModule } from '../../database/mongodb.module';

@Module({
  imports: [MongodbModule],
  controllers: [CommentsController],
  providers: [CommentRepositoryImpl],
})
export class CommentsModule {}
