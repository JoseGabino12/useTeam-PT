import { Comment } from './comment.entity';

export interface ICommentRepository {
  create(comment: Comment): Promise<Comment>;
  findByCardId(cardId: string): Promise<Comment[]>;
  updateContent(commentId: string, newContent: string): Promise<void>;
}
