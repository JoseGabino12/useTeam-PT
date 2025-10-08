import { Controller, Post, Get, Patch, Param, Body } from '@nestjs/common';
import { CreateCommentDto } from '../application/dto/create-comment.dto';
import { CreateCommentUseCase } from '../application/use-cases/create-comment.use-case';
import { FindCommentsByCardUseCase } from '../application/use-cases/find-comments-by-card.use-case';
import { CommentRepositoryImpl } from './comment.repository.impl';

@Controller('comments')
export class CommentsController {
  private createCommentUseCase: CreateCommentUseCase;
  private findCommentsByCardUseCase: FindCommentsByCardUseCase;

  constructor(private readonly commentRepository: CommentRepositoryImpl) {
    this.createCommentUseCase = new CreateCommentUseCase(
      this.commentRepository,
    );
    this.findCommentsByCardUseCase = new FindCommentsByCardUseCase(
      this.commentRepository,
    );
  }

  @Post()
  async create(@Body() dto: CreateCommentDto) {
    return this.createCommentUseCase.execute(dto);
  }

  @Get(':cardId')
  async getCommentsByCard(@Param('cardId') cardId: string) {
    return this.findCommentsByCardUseCase.execute(cardId);
  }

  @Patch(':commentId')
  async updateComment(
    @Param('commentId') commentId: string,
    @Body('content') content: string,
  ) {
    await this.commentRepository.updateContent(commentId, content);
    return { message: 'Comment updated successfully' };
  }
}
