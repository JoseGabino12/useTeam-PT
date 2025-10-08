import { ICommentRepository } from '../../domain/comment.repository';
import { Comment } from '../../domain/comment.entity';
import { CreateCommentDto } from '../dto/create-comment.dto';

export class CreateCommentUseCase {
  constructor(private readonly commentRepository: ICommentRepository) {}

  async execute(data: CreateCommentDto): Promise<Comment> {
    const comment = new Comment(
      crypto.randomUUID(),
      data.cardId,
      data.userId,
      data.content,
      new Date(),
      new Date(),
    );

    return this.commentRepository.create(comment);
  }
}
