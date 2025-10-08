import { ICommentRepository } from '../../domain/comment.repository';
import { Comment } from '../../domain/comment.entity';

export class FindCommentsByCardUseCase {
  constructor(private readonly commentRepository: ICommentRepository) {}

  async execute(cardId: string): Promise<Comment[]> {
    return this.commentRepository.findByCardId(cardId);
  }
}
